#!/bin/bash
# Script principal de desenvolvimento - Canada Intercâmbio
# Uso: ./scripts/dev.sh [comando] [argumentos]

set -euo pipefail  # Parar execução em caso de erro, undefined variables ou pipe failures

# Configurações do projeto
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
readonly BACKEND_SERVICE="backend"
readonly FRONTEND_SERVICE="frontend"
readonly DB_NAME="canada_intercambio_db"

# Cores para output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly MAGENTA='\033[0;95m'
readonly NC='\033[0m' # No Color

# Função para logging
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        "INFO")  echo -e "${BLUE}[INFO]${NC} ${timestamp} - $message" ;;
        "SUCCESS") echo -e "${GREEN}[SUCCESS]${NC} ${timestamp} - $message" ;;
        "WARNING") echo -e "${YELLOW}[WARNING]${NC} ${timestamp} - $message" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} ${timestamp} - $message" ;;
        "DEBUG") echo -e "${PURPLE}[DEBUG]${NC} ${timestamp} - $message" ;;
    esac
}

# Função para exibir banner
show_banner() {
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║                 🍁 CANADA INTERCÂMBIO 🍁                  ║"
    echo "║                Scripts de Desenvolvimento                 ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Função para exibir ajuda
show_help() {
    show_banner
    echo ""
    echo -e "${YELLOW}Uso:${NC} ./scripts/dev.sh [comando] [argumentos]"
    echo ""
    echo -e "${YELLOW}🐳 Comandos Docker:${NC}"
    echo "  up              - Iniciar todos os serviços"
    echo "  down            - Parar todos os serviços"
    echo "  restart         - Reiniciar todos os serviços"
    echo "  rebuild         - Rebuild e restart dos containers"
    echo "  logs [serviço]  - Ver logs (padrão: todos os serviços)"
    echo "  status          - Status dos containers"
    echo ""
    echo -e "${YELLOW}🗄️  Comandos Banco de Dados:${NC}"
    echo "  db:setup        - Configuração inicial do banco de dados"
    echo "  db:migrate      - Executar migrations do banco"
    echo "  db:push         - Sincronizar schema com o banco"
    echo "  db:list         - Listar todas as migrations disponíveis"
    echo "  db:reset        - Reset completo do banco (cuidado!)"
    echo "  db:seed         - Executar dados iniciais (seed)"
    echo "  db:studio       - Abrir Prisma Studio (interface visual)"
    echo "  db:backup       - Criar backup do banco de dados"
    echo "  db:restore      - Restaurar backup do banco"
    echo "  db:info         - Informações de conexão e configuração"
    echo ""
    echo -e "${YELLOW}🔧 Comandos Desenvolvimento:${NC}"
    echo "  setup           - Configuração inicial completa do projeto"
    echo "  dev             - Iniciar modo desenvolvimento (watch)"
    echo "  build           - Build do projeto completo"
    echo "  test            - Executar todos os testes"
    echo "  lint            - Executar verificação de código (linting)"
    echo "  format          - Formatar código automaticamente"
    echo ""
    echo -e "${YELLOW}📱 Comandos Frontend:${NC}"
    echo "  frontend:dev    - Iniciar frontend em modo desenvolvimento"
    echo "  frontend:build  - Build do aplicativo frontend"
    echo "  frontend:ios    - Executar aplicativo no iOS"
    echo "  frontend:android - Executar aplicativo no Android"
    echo ""
    echo -e "${YELLOW}🛠️  Comandos Utilitários:${NC}"
    echo "  fresh           - Reinício completo do ambiente (down + up + migrate)"
    echo "  watch           - Modo desenvolvimento com hot reload ativo"
    echo "  shell [serviço] - Acesso ao shell de um container específico"
    echo "  clean           - Limpar cache e arquivos temporários"
    echo "  clean:images    - Remover todas as imagens Docker"
    echo "  clean:volumes   - Remover todos os volumes Docker"
    echo "  clean:all       - Limpeza completa (containers, imagens e volumes)"
    echo "  health          - Diagnóstico completo da saúde do sistema"
    echo "  pgadmin         - Informações de acesso ao pgAdmin"
    echo "  help            - Exibir esta mensagem de ajuda"
    echo ""
    echo -e "${YELLOW}Exemplos Principais:${NC}"
    echo "  ./scripts/dev.sh setup          # Configuração inicial completa"
    echo "  ./scripts/dev.sh up             # Iniciar todos os serviços"
    echo "  ./scripts/dev.sh watch          # Desenvolvimento com hot reload"
    echo "  ./scripts/dev.sh db:migrate     # Executar migrations"
    echo "  ./scripts/dev.sh health         # Verificar status do sistema"
    echo ""
    echo -e "${PURPLE}💡 Dica: Execute ${CYAN}'./scripts/dev.sh health'${PURPLE} para verificar o status do sistema${NC}"
    echo ""
    
    # Verificação rápida de status
    if [ -f "docker-compose.yml" ] && command -v docker &> /dev/null && docker info &> /dev/null; then
        if docker compose ps --services --filter status=running 2>/dev/null | grep -q .; then
            echo -e "${GREEN}✅ Containers estão rodando${NC}"
        else
            echo -e "${YELLOW}⚠️  Containers não estão rodando - use ${CYAN}'./scripts/dev.sh up'${YELLOW} para iniciar${NC}"
        fi
    else
        echo -e "${RED}❌ Docker não está disponível ou docker-compose.yml não encontrado${NC}"
    fi
    echo ""
}

# Função para verificar dependências
check_dependencies() {
    log "INFO" "Verificando dependências do sistema..."
    
    local missing_deps=()
    local optional_deps=()
    local system_ok=true
    
    # Dependências obrigatórias
    if ! command -v docker &> /dev/null; then
        missing_deps+=("docker")
        system_ok=false
    else
        # Verificar se Docker daemon está rodando
        if ! docker info &> /dev/null; then
            log "ERROR" "Docker está instalado mas o daemon não está rodando"
            system_ok=false
        else
            log "SUCCESS" "✅ Docker: $(docker --version | cut -d' ' -f3 | cut -d',' -f1)"
        fi
    fi
    
    # Verificar Docker Compose (nova sintaxe ou plugin)
    if ! docker compose version &> /dev/null; then
        if ! command -v docker-compose &> /dev/null; then
            missing_deps+=("docker-compose")
            system_ok=false
        else
            log "SUCCESS" "✅ Docker Compose (standalone): $(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)"
        fi
    else
        log "SUCCESS" "✅ Docker Compose (plugin): $(docker compose version --short)"
    fi
    
    # Dependências úteis (não obrigatórias)
    if ! command -v curl &> /dev/null; then
        optional_deps+=("curl")
    else
        log "SUCCESS" "✅ curl: $(curl --version | head -1 | cut -d' ' -f2)"
    fi
    
    if ! command -v jq &> /dev/null; then
        optional_deps+=("jq")
    else
        log "SUCCESS" "✅ jq: $(jq --version)"
    fi
    
    if ! command -v node &> /dev/null; then
        optional_deps+=("node")
    else
        log "SUCCESS" "✅ Node.js: $(node --version)"
    fi
    
    if ! command -v npm &> /dev/null; then
        optional_deps+=("npm")
    else
        log "SUCCESS" "✅ npm: $(npm --version)"
    fi
    
    # Verificar Git
    if ! command -v git &> /dev/null; then
        optional_deps+=("git")
    else
        log "SUCCESS" "✅ Git: $(git --version | cut -d' ' -f3)"
    fi
    
    # Verificar ferramentas de rede
    if ! command -v netstat &> /dev/null && ! command -v ss &> /dev/null; then
        optional_deps+=("net-tools ou iproute2 (para verificar portas)")
    fi
    
    # Verificar se pode executar comandos com privilégios (se necessário)
    if groups 2>/dev/null | grep -q docker; then
        log "SUCCESS" "✅ Usuário está no grupo docker"
    else
        log "WARNING" "⚠️  Usuário não está no grupo docker - pode precisar de sudo"
    fi
    
    # Reportar resultados
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log "ERROR" "❌ Dependências obrigatórias ausentes:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        echo -e "${YELLOW}📋 Instruções de instalação:${NC}"
        echo "  • Docker: https://docs.docker.com/get-docker/"
        echo "  • Docker Compose: https://docs.docker.com/compose/install/"
        echo ""
        exit 1
    fi
    
    if [ ${#optional_deps[@]} -ne 0 ]; then
        log "WARNING" "⚠️  Dependências opcionais ausentes (recomendadas):"
        for dep in "${optional_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        echo -e "${YELLOW}💡 Para melhor experiência, instale:${NC}"
        echo "  sudo apt update && sudo apt install -y curl jq nodejs npm git net-tools"
        echo ""
    fi
    
    if [ "$system_ok" = true ]; then
        log "SUCCESS" "✅ Todas as dependências obrigatórias estão disponíveis"
    fi
    
    return 0
}

# Função para verificar se os containers estão rodando
check_containers() {
    log "DEBUG" "Verificando status dos containers..."
    
    cd "$PROJECT_DIR"
    
    # Verificar se o arquivo docker-compose.yml existe
    if [ ! -f "docker-compose.yml" ]; then
        log "ERROR" "Arquivo docker-compose.yml não encontrado no diretório do projeto"
        return 1
    fi
    
    # Método mais robusto para verificar containers
    local containers_running=false
    local services_status=""
    
    # Tentar usar docker compose ps primeiro (método preferido)
    if command -v docker &> /dev/null && docker info &> /dev/null; then
        if docker compose version &> /dev/null 2>&1; then
            # Usar docker compose (plugin)
            if services_status=$(docker compose ps --services --filter status=running 2>/dev/null); then
                if [ -n "$services_status" ]; then
                    containers_running=true
                    log "DEBUG" "Containers rodando (compose plugin): $services_status"
                fi
            fi
        elif command -v docker-compose &> /dev/null; then
            # Usar docker-compose (standalone)
            if services_status=$(docker-compose ps --services --filter status=running 2>/dev/null); then
                if [ -n "$services_status" ]; then
                    containers_running=true
                    log "DEBUG" "Containers rodando (compose standalone): $services_status"
                fi
            fi
        fi
        
        # Método alternativo: verificar containers por nome do projeto
        if [ "$containers_running" = false ]; then
            local project_name=$(basename "$PROJECT_DIR" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]//g')
            local running_containers=$(docker ps --filter "name=${project_name}" --format "{{.Names}}" 2>/dev/null)
            if [ -n "$running_containers" ]; then
                containers_running=true
                log "DEBUG" "Containers encontrados por nome do projeto: $running_containers"
            fi
        fi
        
        # Método final: verificar containers nas portas conhecidas
        if [ "$containers_running" = false ]; then
            if docker ps --filter "publish=3000" --filter "publish=5432" --filter "publish=8080" --format "{{.Names}}" 2>/dev/null | grep -q .; then
                containers_running=true
                log "DEBUG" "Containers encontrados nas portas do projeto"
            fi
        fi
    else
        log "ERROR" "Docker não está disponível ou o daemon não está rodando"
        return 1
    fi
    
    if [ "$containers_running" = true ]; then
        log "DEBUG" "Containers do projeto estão rodando"
        return 0
    else
        log "DEBUG" "Nenhum container do projeto está rodando"
        return 1
    fi
}

# Função para aguardar serviços ficarem prontos
wait_for_services() {
    log "INFO" "Aguardando serviços ficarem prontos..."
    
    # Aguardar banco de dados
    local retries=30
    while [ $retries -gt 0 ]; do
        if docker compose exec postgres pg_isready -q; then
            log "SUCCESS" "Banco de dados está pronto"
            break
        fi
        retries=$((retries - 1))
        sleep 2
    done
    
    if [ $retries -eq 0 ]; then
        log "ERROR" "Timeout aguardando banco de dados"
        exit 1
    fi
    
    # Aguardar backend
    sleep 5
    log "SUCCESS" "Serviços estão prontos"
}

# Função para executar comando no container
run_in_container() {
    local service="$1"
    shift
    cd "$PROJECT_DIR"
    docker compose exec "$service" "$@"
}

# Comandos Docker
cmd_up() {
    log "INFO" "Iniciando serviços..."
    cd "$PROJECT_DIR"
    docker compose up -d
    wait_for_services
    log "SUCCESS" "Serviços iniciados com sucesso!"
    echo ""
    echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║                    🍁 SERVIÇOS ATIVOS 🍁                    ║${NC}"
    echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}🚀 Backend API:${NC}"
    echo -e "   ${BLUE}URL:${NC} http://localhost:3000"
    echo -e "   ${BLUE}Health:${NC} http://localhost:3000/health"
    echo ""
    echo -e "${GREEN}🗄️  Banco de Dados PostgreSQL:${NC}"
    echo -e "   ${BLUE}Host:${NC} localhost"
    echo -e "   ${BLUE}Port:${NC} 5432"
    echo -e "   ${BLUE}Database:${NC} $DB_NAME"
    echo -e "   ${BLUE}User:${NC} postgres"
    echo -e "   ${BLUE}Password:${NC} 123456"
    echo ""
    echo -e "${GREEN}🔧 pgAdmin (Interface Web):${NC}"
    echo -e "   ${BLUE}URL:${NC} http://localhost:8080"
    echo -e "   ${BLUE}Email:${NC} admin@admin.com"
    echo -e "   ${BLUE}Password:${NC} admin"
    echo ""
    echo -e "${YELLOW}💡 Configuração pgAdmin:${NC}"
    echo -e "   1. Acesse http://localhost:8080"
    echo -e "   2. Login: admin@admin.com / admin"
    echo -e "   3. Add New Server:"
    echo -e "      • Nome: Canada Intercambio"
    echo -e "      • Host: postgres (nome do container)"
    echo -e "      • Port: 5432"
    echo -e "      • Database: $DB_NAME"
    echo -e "      • Username: postgres"
    echo -e "      • Password: 123456"
    echo ""
    echo -e "${YELLOW}📱 Próximos passos:${NC}"
    echo -e "   • 🔥 Hot Reload: ${CYAN}./scripts/dev.sh watch${NC} (recomendado!)"
    echo -e "   • Frontend: ${CYAN}./scripts/dev.sh frontend:dev${NC}"
    echo -e "   • Prisma Studio: ${CYAN}./scripts/dev.sh db:studio${NC}"
    echo -e "   • Dev Mode: ${CYAN}./scripts/dev.sh dev${NC}"
    echo ""
    echo -e "${GREEN}🔥 HOT RELOAD CONFIGURADO!${NC}"
    echo -e "   • Edite ${CYAN}schema.prisma${NC} → mudanças refletem automaticamente"
    echo -e "   • Edite arquivos ${CYAN}.ts/.js${NC} → servidor reinicia automaticamente"
    echo ""
}

cmd_down() {
    log "INFO" "Parando serviços..."
    cd "$PROJECT_DIR"
    docker compose down
    log "SUCCESS" "Serviços parados"
}

cmd_restart() {
    log "INFO" "Reiniciando serviços..."
    cmd_down
    cmd_up
}

cmd_rebuild() {
    log "INFO" "Rebuild dos containers..."
    cd "$PROJECT_DIR"
    docker compose down
    docker compose build --no-cache
    docker compose up -d
    wait_for_services
    log "SUCCESS" "Rebuild completo!"
}

cmd_logs() {
    local service="${1:-}"
    cd "$PROJECT_DIR"
    
    if [ -n "$service" ]; then
        log "INFO" "Logs do serviço: $service"
        docker compose logs -f "$service"
    else
        log "INFO" "Logs de todos os serviços"
        docker compose logs -f
    fi
}

cmd_status() {
    log "INFO" "Status detalhado dos containers:"
    cd "$PROJECT_DIR"
    
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}                    STATUS DOS CONTAINERS${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # Status do docker compose
    if docker compose ps --format "table {{.Service}}\t{{.State}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null; then
        echo ""
    else
        log "ERROR" "Erro ao obter status dos containers"
        return 1
    fi
    
    # Informações adicionais
    echo -e "${YELLOW}📊 Informações Adicionais:${NC}"
    
    # Verificar se as portas estão sendo usadas
    if command -v netstat &> /dev/null; then
        echo -e "${BLUE}🔌 Portas em uso:${NC}"
        netstat -ln 2>/dev/null | grep -E ":(3000|5432|8080) " | while read line; do
            port=$(echo "$line" | grep -oE ":(3000|5432|8080)" | tr -d ':')
            case "$port" in
                3000) echo "   • Porta 3000: Backend API" ;;
                5432) echo "   • Porta 5432: PostgreSQL" ;;
                8080) echo "   • Porta 8080: pgAdmin" ;;
            esac
        done
        echo ""
    fi
    
    # Links úteis
    echo -e "${GREEN}🔗 Links Úteis:${NC}"
    if docker compose ps --services --filter status=running | grep -q backend; then
        echo -e "   • Backend: ${CYAN}http://localhost:3000${NC}"
        echo -e "   • API Health: ${CYAN}http://localhost:3000/health${NC}"
        echo -e "   • API Docs: ${CYAN}http://localhost:3000/docs${NC}"
    fi
    
    if docker compose ps --services --filter status=running | grep -q pgadmin; then
        echo -e "   • pgAdmin: ${CYAN}http://localhost:8080${NC}"
        echo -e "     User: admin@admin.com | Pass: admin"
    fi
    
    echo ""
    echo -e "${PURPLE}💡 Comandos úteis:${NC}"
    echo -e "   • ${CYAN}./scripts/dev.sh health${NC} - Diagnóstico completo"
    echo -e "   • ${CYAN}./scripts/dev.sh logs${NC} - Ver logs dos containers"
    echo -e "   • ${CYAN}./scripts/dev.sh logs [serviço]${NC} - Logs de um serviço específico"
    echo ""
}

# Comandos de Banco de Dados
cmd_db_setup() {
    log "INFO" "Configuração inicial do banco de dados..."
    check_containers
    
    run_in_container "$BACKEND_SERVICE" npx prisma generate
    run_in_container "$BACKEND_SERVICE" npx prisma migrate dev --name init
    
    log "SUCCESS" "Banco de dados configurado!"
}

cmd_db_migrate() {
    local name="${1:-}"
    log "INFO" "Executando migrations..."
    check_containers
    
    if [ -n "$name" ]; then
        run_in_container "$BACKEND_SERVICE" npx prisma migrate dev --name "$name"
    else
        run_in_container "$BACKEND_SERVICE" npx prisma migrate dev
    fi
    
    log "SUCCESS" "Migrations executadas!"
}

cmd_db_reset() {
    log "WARNING" "⚠️  ATENÇÃO: Isso irá apagar todos os dados do banco!"
    read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "INFO" "Resetando banco de dados..."
        check_containers
        run_in_container "$BACKEND_SERVICE" npx prisma migrate reset --force
        log "SUCCESS" "Banco resetado!"
    else
        log "INFO" "Operação cancelada"
    fi
}

cmd_db_push() {
    log "INFO" "Push do schema para banco..."
    check_containers
    run_in_container "$BACKEND_SERVICE" npx prisma db push
    log "SUCCESS" "Schema enviado para banco!"
}

cmd_db_seed() {
    log "INFO" "Executando seed..."
    check_containers
    
    if run_in_container "$BACKEND_SERVICE" test -f prisma/seed.ts || run_in_container "$BACKEND_SERVICE" test -f prisma/seed.js; then
        run_in_container "$BACKEND_SERVICE" npx prisma db seed
        log "SUCCESS" "Seed executado!"
    else
        log "WARNING" "Arquivo de seed não encontrado"
    fi
}

cmd_db_studio() {
    log "INFO" "Abrindo Prisma Studio..."
    check_containers
    echo -e "${YELLOW}Prisma Studio: http://localhost:5555${NC}"
    run_in_container "$BACKEND_SERVICE" npx prisma studio
}

cmd_db_backup() {
    local backup_name="backup_$(date +%Y%m%d_%H%M%S).sql"
    log "INFO" "Criando backup: $backup_name"
    
    cd "$PROJECT_DIR"
    mkdir -p backups
    
    docker compose exec postgres pg_dump -U postgres $DB_NAME > "backups/$backup_name"
    log "SUCCESS" "Backup criado: backups/$backup_name"
}

cmd_db_restore() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        log "ERROR" "Especifique o arquivo de backup"
        echo "Uso: ./scripts/dev.sh db:restore <arquivo_backup>"
        return 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        log "ERROR" "Arquivo de backup não encontrado: $backup_file"
        return 1
    fi
    
    log "WARNING" "⚠️  Isso irá substituir todos os dados atuais!"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "INFO" "Restaurando backup..."
        check_containers
        
        cd "$PROJECT_DIR"
        docker compose exec -T postgres psql -U postgres -d $DB_NAME < "$backup_file"
        log "SUCCESS" "Backup restaurado!"
    else
        log "INFO" "Operação cancelada"
    fi
}

cmd_db_info() {
    log "INFO" "Informações de conexão do banco de dados"
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                🗄️  INFORMAÇÕES DO BANCO 🗄️                 ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}📊 Conexão Direta PostgreSQL:${NC}"
    echo -e "   ${BLUE}Host:${NC} localhost"
    echo -e "   ${BLUE}Port:${NC} 5432"
    echo -e "   ${BLUE}Database:${NC} $DB_NAME"
    echo -e "   ${BLUE}Username:${NC} postgres"
    echo -e "   ${BLUE}Password:${NC} 123456"
    echo ""
    echo -e "${GREEN}🔗 String de Conexão:${NC}"
    echo -e "   ${YELLOW}postgresql://postgres:123456@localhost:5432/$DB_NAME${NC}"
    echo ""
    echo -e "${GREEN}🔧 pgAdmin (Interface Web):${NC}"
    echo -e "   ${BLUE}URL:${NC} http://localhost:8080"
    echo -e "   ${BLUE}Email:${NC} admin@admin.com"
    echo -e "   ${BLUE}Password:${NC} admin"
    echo ""
    echo -e "${YELLOW}💡 Para conectar via pgAdmin:${NC}"
    echo -e "   1. Acesse: ${CYAN}http://localhost:8080${NC}"
    echo -e "   2. Login com: ${CYAN}admin@admin.com${NC} / ${CYAN}admin${NC}"
    echo -e "   3. Clique em 'Add New Server'"
    echo -e "   4. Configure:"
    echo -e "      • ${BLUE}Name:${NC} Canada Intercambio"
    echo -e "      • ${BLUE}Host name/address:${NC} postgres"
    echo -e "      • ${BLUE}Port:${NC} 5432"
    echo -e "      • ${BLUE}Maintenance database:${NC} $DB_NAME"
    echo -e "      • ${BLUE}Username:${NC} postgres"
    echo -e "      • ${BLUE}Password:${NC} 123456"
    echo ""
    echo -e "${YELLOW}🛠️  Comandos úteis:${NC}"
    echo -e "   • Prisma Studio: ${CYAN}./scripts/dev.sh db:studio${NC}"
    echo -e "   • Ver logs do DB: ${CYAN}./scripts/dev.sh logs postgres${NC}"
    echo -e "   • Shell do DB: ${CYAN}./scripts/dev.sh shell postgres${NC}"
    echo ""
}

cmd_db_list() {
    log "INFO" "Listando migrations..."
    check_containers
    
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                  📁 MIGRATIONS DO PROJETO 📁              ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Verificar se existe pasta de migrations
    if ! run_in_container "$BACKEND_SERVICE" test -d prisma/migrations; then
        echo -e "${RED}❌ Pasta de migrations não encontrada${NC}"
        echo -e "${YELLOW}💡 Execute: ${CYAN}./scripts/dev.sh db:migrate${NC} para criar o primeiro migration"
        return 0
    fi
    
    # Listar migrations
    local migrations_output
    migrations_output=$(run_in_container "$BACKEND_SERVICE" find prisma/migrations -type d -name "*_*" | sort)
    
    if [ -z "$migrations_output" ]; then
        echo -e "${RED}❌ Nenhum migration encontrado${NC}"
        echo -e "${YELLOW}💡 Execute: ${CYAN}./scripts/dev.sh db:migrate nome_do_migration${NC}"
        return 0
    fi
    
    # Processar e exibir migrations
    local counter=1
    while IFS= read -r migration_path; do
        if [ -n "$migration_path" ]; then
            local migration_name=$(basename "$migration_path")
            local timestamp=$(echo "$migration_name" | cut -d'_' -f1)
            local name_part=$(echo "$migration_name" | cut -d'_' -f2- | tr '_' ' ')
            
            # Status do SQL
            local sql_status="❌"
            if run_in_container "$BACKEND_SERVICE" test -f "$migration_path/migration.sql"; then
                sql_status="✅"
            fi
            
            echo -e "${YELLOW}${counter}.${NC} ${BLUE}${name_part}${NC}"
            echo -e "    ${GREEN}📅${NC} ${timestamp} ${GREEN}📄${NC} ${sql_status}"
            
            counter=$((counter + 1))
        fi
    done <<< "$migrations_output"
    
    # Exibir total e comandos úteis
    local total=$((counter - 1))
    echo ""
    echo -e "${GREEN}📊 Total: ${total} migrations${NC}"
    echo ""
    echo -e "${YELLOW}💡 Comandos:${NC}"
    echo -e "   • Novo migration: ${CYAN}./scripts/dev.sh db:migrate nome${NC}"
    echo -e "   • Reset migrations: ${CYAN}./scripts/dev.sh db:reset${NC}"
    echo -e "   • Status detalhado: ${CYAN}./scripts/dev.sh shell backend${NC} → ${CYAN}npx prisma migrate status${NC}"
    echo ""
}

# Comandos de Desenvolvimento
cmd_setup() {
    log "INFO" "🚀 Configuração inicial completa..."
    
    check_dependencies
    
    # Build containers
    log "INFO" "Building containers..."
    cd "$PROJECT_DIR"
    docker compose build
    
    # Start services
    cmd_up
    
    # Setup database
    cmd_db_setup
    
    # Run seed
    log "INFO" "Executando seed inicial..."
    cmd_db_seed
    
    # Install frontend dependencies
    if [ -d "$PROJECT_DIR/frontend" ]; then
        log "INFO" "Instalando dependências do frontend..."
        cd "$PROJECT_DIR/frontend"
        npm install
    fi
    
    log "SUCCESS" "✅ Setup completo!"
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║            🎉 PROJETO CANADA INTERCÂMBIO PRONTO! 🎉        ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}🎯 Próximos passos:${NC}"
    echo -e "1. 🌐 Backend: ${CYAN}http://localhost:3000${NC}"
    echo -e "2. 🗄️  pgAdmin: ${CYAN}http://localhost:8080${NC} (admin@admin.com/admin)"
    echo -e "3. 🎨 Prisma Studio: ${CYAN}./scripts/dev.sh db:studio${NC}"
    echo -e "4. 📱 Frontend: ${CYAN}./scripts/dev.sh frontend:dev${NC}"
    echo -e "5. 💻 Dev Mode: ${CYAN}./scripts/dev.sh dev${NC}"
    echo ""
    echo -e "${YELLOW}📚 Comandos úteis:${NC}"
    echo -e "• ${CYAN}./scripts/dev.sh help${NC} - Ver todos os comandos"
    echo -e "• ${CYAN}./scripts/dev.sh db:migrate${NC} - Executar migrations"
    echo -e "• ${CYAN}./scripts/dev.sh db:list${NC} - Listar migrations"
    echo -e "• ${CYAN}./scripts/dev.sh fresh${NC} - Reinício completo"
    echo -e "• ${CYAN}./scripts/dev.sh db:info${NC} - Infos do banco"
    echo ""
}

cmd_dev() {
    log "INFO" "Iniciando modo desenvolvimento..."
    check_containers
    
    # Start backend in watch mode
    run_in_container "$BACKEND_SERVICE" npm run dev
}

cmd_build() {
    log "INFO" "Building projeto..."
    cd "$PROJECT_DIR"
    
    # Build backend
    log "INFO" "Building backend..."
    run_in_container "$BACKEND_SERVICE" npm run build
    
    # Build frontend
    if [ -d "$PROJECT_DIR/frontend" ]; then
        log "INFO" "Building frontend..."    
        cd "$PROJECT_DIR/frontend"
        npm run build
    fi
    
    log "SUCCESS" "Build completo!"
}

cmd_test() {
    log "INFO" "Executando testes..."
    check_containers
    
    # Backend tests
    run_in_container "$BACKEND_SERVICE" npm test
    
    # Frontend tests
    if [ -d "$PROJECT_DIR/frontend" ]; then
        cd "$PROJECT_DIR/frontend"
        npm test
    fi
}

cmd_lint() {
    log "INFO" "Executando linting..."
    
    # Backend lint
    run_in_container "$BACKEND_SERVICE" npm run lint
    
    # Frontend lint
    if [ -d "$PROJECT_DIR/frontend" ]; then
        cd "$PROJECT_DIR/frontend"
        npm run lint
    fi
}

cmd_format() {
    log "INFO" "Formatando código..."
    
    # Backend format
    run_in_container "$BACKEND_SERVICE" npm run format
    
    # Frontend format
    if [ -d "$PROJECT_DIR/frontend" ]; then
        cd "$PROJECT_DIR/frontend"
        npm run format
    fi
}

# Comandos Frontend
cmd_frontend_dev() {
    log "INFO" "Iniciando frontend em desenvolvimento..."
    cd "$PROJECT_DIR/frontend"
    npm start
}

cmd_frontend_build() {
    log "INFO" "Building frontend..."
    cd "$PROJECT_DIR/frontend"
    npm run build
}

cmd_frontend_ios() {
    log "INFO" "Executando no iOS..."
    cd "$PROJECT_DIR/frontend"
    npm run ios
}

cmd_frontend_android() {
    log "INFO" "Executando no Android..."
    cd "$PROJECT_DIR/frontend"
    npm run android
}

# Comandos Utilitários
cmd_clean() {
    log "INFO" "Limpando cache e arquivos temporários..."
    
    cd "$PROJECT_DIR"
    
    # Clean Docker
    docker system prune -f
    
    # Clean node_modules
    find . -name "node_modules" -type d -prune -exec rm -rf {} +
    find . -name ".next" -type d -prune -exec rm -rf {} +
    
    # Clean backend
    if [ -d "backend" ]; then
        cd backend
        rm -rf dist/ build/ .cache/
        cd ..
    fi
    
    # Clean frontend  
    if [ -d "frontend" ]; then
        cd frontend
        rm -rf .expo/ dist/ build/
    fi
    
    log "SUCCESS" "Limpeza completa!"
}

cmd_clean_images() {
    log "WARNING" "⚠️  Isso irá remover TODAS as imagens Docker!"
    read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "INFO" "Removendo todas as imagens Docker..."
        
        # Parar containers primeiro
        cd "$PROJECT_DIR"
        docker compose down 2>/dev/null || true
        
        # Remover todas as imagens
        if docker images -q | wc -l | grep -q "0"; then
            log "INFO" "Nenhuma imagem encontrada"
        else
            docker rmi $(docker images -q) -f 2>/dev/null || true
            log "SUCCESS" "Todas as imagens Docker removidas!"
        fi
    else
        log "INFO" "Operação cancelada"
    fi
}

cmd_clean_volumes() {
    log "WARNING" "⚠️  Isso irá remover TODOS os volumes Docker!"
    read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "INFO" "Removendo todos os volumes Docker..."
        
        # Parar containers primeiro
        cd "$PROJECT_DIR"
        docker compose down -v 2>/dev/null || true
        
        # Remover volumes órfãos
        docker volume prune -f
        
        # Remover todos os volumes
        if docker volume ls -q | wc -l | grep -q "0"; then
            log "INFO" "Nenhum volume encontrado"
        else
            docker volume rm $(docker volume ls -q) 2>/dev/null || true
            log "SUCCESS" "Todos os volumes Docker removidos!"
        fi
    else
        log "INFO" "Operação cancelada"
    fi
}

cmd_clean_all() {
    log "WARNING" "⚠️  LIMPEZA TOTAL: Containers, Imagens e Volumes!"
    echo -e "${RED}ATENÇÃO: Isso irá remover:${NC}"
    echo -e "• ${YELLOW}Todos os containers${NC}"
    echo -e "• ${YELLOW}Todas as imagens Docker${NC}"
    echo -e "• ${YELLOW}Todos os volumes Docker${NC}"
    echo -e "• ${YELLOW}Redes órfãs${NC}"
    echo -e "• ${YELLOW}Cache de build${NC}"
    echo ""
    read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "INFO" "Iniciando limpeza completa..."
        
        cd "$PROJECT_DIR"
        
        # 1. Parar e remover containers
        log "INFO" "1/5 - Parando e removendo containers..."
        docker compose down -v --remove-orphans 2>/dev/null || true
        docker container prune -f
        
        # 2. Remover imagens
        log "INFO" "2/5 - Removendo imagens..."
        if ! docker images -q | wc -l | grep -q "0"; then
            docker rmi $(docker images -q) -f 2>/dev/null || true
        fi
        
        # 3. Remover volumes
        log "INFO" "3/5 - Removendo volumes..."
        docker volume prune -f
        if ! docker volume ls -q | wc -l | grep -q "0"; then
            docker volume rm $(docker volume ls -q) 2>/dev/null || true
        fi
        
        # 4. Remover redes
        log "INFO" "4/5 - Removendo redes..."
        docker network prune -f
        
        # 5. Limpeza geral do sistema
        log "INFO" "5/5 - Limpeza final do sistema..."
        docker system prune -a -f --volumes
        
        log "SUCCESS" "🧹 Limpeza completa do Docker finalizada!"
        echo ""
        echo -e "${GREEN}✅ Containers removidos${NC}"
        echo -e "${GREEN}✅ Imagens removidas${NC}"
        echo -e "${GREEN}✅ Volumes removidos${NC}"
        echo -e "${GREEN}✅ Redes limpas${NC}"
        echo -e "${GREEN}✅ Cache limpo${NC}"
        echo ""
        echo -e "${YELLOW}💡 Para reiniciar o projeto: ${CYAN}./scripts/dev.sh setup${NC}"
        
    else
        log "INFO" "Operação cancelada"
    fi
}

cmd_shell() {
    local service="${1:-$BACKEND_SERVICE}"
    log "INFO" "Acessando shell do container: $service"
    check_containers
    run_in_container "$service" bash
}

cmd_health() {
    log "INFO" "Executando diagnóstico completo do sistema..."
    
    cd "$PROJECT_DIR"
    
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                 🏥 DIAGNÓSTICO DO SISTEMA 🏥               ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    local overall_health=true
    local warnings_count=0
    local errors_count=0
    
    # 1. Verificar dependências do sistema
    log "INFO" "1. 🔧 Verificando dependências do sistema..."
    echo ""
    
    # Executar verificação de dependências (sem sair em caso de erro)
    local deps_ok=true
    check_dependencies || deps_ok=false
    
    if [ "$deps_ok" = false ]; then
        overall_health=false
        errors_count=$((errors_count + 1))
    fi
    
    echo ""
    
    # 2. Verificar arquivos de configuração
    log "INFO" "2. 📁 Verificando arquivos de configuração..."
    
    if [ ! -f "docker-compose.yml" ]; then
        log "ERROR" "❌ Arquivo docker-compose.yml não encontrado"
        overall_health=false
        errors_count=$((errors_count + 1))
    else
        log "SUCCESS" "✅ docker-compose.yml encontrado"
        
        # Verificar sintaxe do docker-compose
        if docker compose config &> /dev/null; then
            log "SUCCESS" "✅ docker-compose.yml válido"
        else
            log "ERROR" "❌ docker-compose.yml contém erros de sintaxe"
            overall_health=false
            errors_count=$((errors_count + 1))
        fi
    fi
    
    # Verificar outros arquivos importantes
    local important_files=("backend/package.json" "backend/Dockerfile" "backend/prisma/schema.prisma")
    for file in "${important_files[@]}"; do
        if [ -f "$file" ]; then
            log "SUCCESS" "✅ $file encontrado"
        else
            log "WARNING" "⚠️  $file não encontrado"
            warnings_count=$((warnings_count + 1))
        fi
    done
    
    echo ""
    
    # 3. Verificar status dos containers de forma mais robusta
    log "INFO" "3. 🐳 Verificando status dos containers..."
    
    local containers_info=""
    local postgres_running=false
    local backend_running=false
    local pgadmin_running=false
    
    # Método mais robusto para verificar containers
    if command -v docker &> /dev/null && docker info &> /dev/null; then
        # Tentar docker compose ps primeiro
        if docker compose version &> /dev/null 2>&1; then
            containers_info=$(docker compose ps --format "table {{.Service}}\t{{.State}}\t{{.Status}}" 2>/dev/null || echo "")
        elif command -v docker-compose &> /dev/null; then
            containers_info=$(docker-compose ps --format "table {{.Service}}\t{{.State}}\t{{.Status}}" 2>/dev/null || echo "")
        fi
        
        # Verificar serviços específicos usando múltiplos métodos
        
        # PostgreSQL
        if docker ps --filter "status=running" --format "{{.Names}}" 2>/dev/null | grep -q postgres; then
            postgres_running=true
        fi
        
        # Backend
        if docker ps --filter "status=running" --format "{{.Names}}" 2>/dev/null | grep -q backend; then
            backend_running=true
        fi
        
        # pgAdmin
        if docker ps --filter "status=running" --format "{{.Names}}" 2>/dev/null | grep -q pgadmin; then
            pgadmin_running=true
        fi
        
        # Exibir informações dos containers
        if [ -n "$containers_info" ]; then
            echo "$containers_info"
            echo ""
        fi
        
        # Status individual dos serviços
        if [ "$postgres_running" = true ]; then
            log "SUCCESS" "✅ PostgreSQL: Rodando"
        else
            log "ERROR" "❌ PostgreSQL: Parado"
            overall_health=false
            errors_count=$((errors_count + 1))
        fi
        
        if [ "$backend_running" = true ]; then
            log "SUCCESS" "✅ Backend: Rodando"
        else
            log "ERROR" "❌ Backend: Parado"
            overall_health=false
            errors_count=$((errors_count + 1))
        fi
        
        if [ "$pgadmin_running" = true ]; then
            log "SUCCESS" "✅ pgAdmin: Rodando"
        else
            log "WARNING" "⚠️  pgAdmin: Parado (opcional)"
            warnings_count=$((warnings_count + 1))
        fi
        
    else
        log "ERROR" "❌ Docker não está disponível ou daemon não está rodando"
        overall_health=false
        errors_count=$((errors_count + 1))
    fi
    
    echo ""
    
    # 4. Verificar conectividade do banco de dados
    log "INFO" "4. 🗄️  Verificando conectividade do banco de dados..."
    
    if [ "$postgres_running" = true ]; then
        # Múltiplas tentativas de verificar o banco
        local db_accessible=false
        
        # Método 1: pg_isready
        if docker compose exec -T postgres pg_isready -q 2>/dev/null; then
            db_accessible=true
            log "SUCCESS" "✅ Banco de dados está acessível (pg_isready)"
        # Método 2: conexão simples
        elif docker compose exec -T postgres psql -U postgres -d canada_intercambio_db -c "SELECT 1;" &>/dev/null; then
            db_accessible=true
            log "SUCCESS" "✅ Banco de dados está acessível (conexão direta)"
        else
            log "ERROR" "❌ Banco de dados não está acessível"
            overall_health=false
            errors_count=$((errors_count + 1))
        fi
        
        # Verificar se o banco específico existe
        if [ "$db_accessible" = true ]; then
            if docker compose exec -T postgres psql -U postgres -l 2>/dev/null | grep -q "canada_intercambio_db"; then
                log "SUCCESS" "✅ Database 'canada_intercambio_db' existe"
            else
                log "WARNING" "⚠️  Database 'canada_intercambio_db' não encontrada"
                warnings_count=$((warnings_count + 1))
            fi
        fi
    else
        log "ERROR" "❌ Container PostgreSQL não está rodando"
    fi
    
    echo ""
    
    # 5. Verificar backend API
    log "INFO" "5. 🌐 Verificando backend API..."
    
    if [ "$backend_running" = true ]; then
        # Verificar se API está respondendo usando a rota /ping
        if command -v curl &> /dev/null; then
            local response
            if response=$(curl -s --max-time 5 http://localhost:3000/ping 2>/dev/null); then
                if [ "$response" = "pong" ]; then
                    log "SUCCESS" "✅ Backend API respondendo em http://localhost:3000/ping"
                else
                    log "WARNING" "⚠️  Backend respondeu mas com conteúdo inesperado: $response"
                    warnings_count=$((warnings_count + 1))
                fi
            else
                log "ERROR" "❌ Backend API não está respondendo na porta 3000"
                errors_count=$((errors_count + 1))
                overall_health=false
            fi
        else
            log "WARNING" "⚠️  curl não disponível - não foi possível testar API"
            warnings_count=$((warnings_count + 1))
        fi
    else
        log "ERROR" "❌ Container Backend não está rodando"
        errors_count=$((errors_count + 1))
        overall_health=false
    fi
    
    echo ""
    
    # 6. Verificar portas do sistema
    log "INFO" "6. 🔌 Verificando portas do sistema..."
    
    local ports_check=()
    if command -v netstat &> /dev/null; then
        # Verificar porta 3000 (Backend)
        if netstat -tuln 2>/dev/null | grep -E '(:3000|\.3000)' >/dev/null; then
            if [ "$backend_running" = true ]; then
                ports_check+=("✅ Porta 3000 (Backend) - Serviço funcionando")
            else
                ports_check+=("❌ Porta 3000 (Backend) - Ocupada por outro processo")
            fi
        else
            if [ "$backend_running" = true ]; then
                ports_check+=("⚠️  Porta 3000 (Backend) - Container rodando mas porta não disponível")
            else
                ports_check+=("ℹ️  Porta 3000 (Backend) - Disponível")
            fi
        fi
        
        # Verificar porta 5432 (PostgreSQL)
        if netstat -tuln 2>/dev/null | grep -E '(:5432|\.5432)' >/dev/null; then
            if [ "$postgres_running" = true ]; then
                ports_check+=("✅ Porta 5432 (PostgreSQL) - Serviço funcionando")
            else
                ports_check+=("❌ Porta 5432 (PostgreSQL) - Ocupada por outro processo")
            fi
        else
            if [ "$postgres_running" = true ]; then
                ports_check+=("⚠️  Porta 5432 (PostgreSQL) - Container rodando mas porta não disponível")
            else
                ports_check+=("ℹ️  Porta 5432 (PostgreSQL) - Disponível")
            fi
        fi
        
        # Verificar porta 8080 (pgAdmin)
        if netstat -tuln 2>/dev/null | grep -E '(:8080|\.8080)' >/dev/null; then
            if [ "$pgadmin_running" = true ]; then
                ports_check+=("✅ Porta 8080 (pgAdmin) - Serviço funcionando")
            else
                ports_check+=("❌ Porta 8080 (pgAdmin) - Ocupada por outro processo")
            fi
        else
            if [ "$pgadmin_running" = true ]; then
                ports_check+=("⚠️  Porta 8080 (pgAdmin) - Container rodando mas porta não disponível")
            else
                ports_check+=("ℹ️  Porta 8080 (pgAdmin) - Disponível")
            fi
        fi
    elif command -v ss &> /dev/null; then
        if ss -ln 2>/dev/null | grep -q ":3000"; then
            if [ "$backend_running" = true ]; then
                ports_check+=("✅ Porta 3000 (Backend) - Serviço funcionando")
            else
                ports_check+=("❌ Porta 3000 (Backend) - Ocupada por outro processo")
            fi
        else
            if [ "$backend_running" = true ]; then
                ports_check+=("⚠️  Porta 3000 (Backend) - Container rodando mas porta não disponível")
            else
                ports_check+=("ℹ️  Porta 3000 (Backend) - Disponível")
            fi
        fi
        
        if ss -ln 2>/dev/null | grep -q ":5432"; then
            if [ "$postgres_running" = true ]; then
                ports_check+=("✅ Porta 5432 (PostgreSQL) - Serviço funcionando")
            else
                ports_check+=("❌ Porta 5432 (PostgreSQL) - Ocupada por outro processo")
            fi
        else
            if [ "$postgres_running" = true ]; then
                ports_check+=("⚠️  Porta 5432 (PostgreSQL) - Container rodando mas porta não disponível")
            else
                ports_check+=("ℹ️  Porta 5432 (PostgreSQL) - Disponível")
            fi
        fi
        
        if ss -ln 2>/dev/null | grep -q ":8080"; then
            if [ "$pgadmin_running" = true ]; then
                ports_check+=("✅ Porta 8080 (pgAdmin) - Serviço funcionando")
            else
                ports_check+=("❌ Porta 8080 (pgAdmin) - Ocupada por outro processo")
            fi
        else
            if [ "$pgadmin_running" = true ]; then
                ports_check+=("⚠️  Porta 8080 (pgAdmin) - Container rodando mas porta não disponível")
            else
                ports_check+=("ℹ️  Porta 8080 (pgAdmin) - Disponível")
            fi
        fi
    else
        ports_check+=("⚠️  Ferramentas de verificação de porta não disponíveis (netstat/ss)")
        warnings_count=$((warnings_count + 1))
    fi
    
    for port_info in "${ports_check[@]}"; do
        echo "   $port_info"
    done
    
    echo ""
    
    # 7. Verificar recursos do sistema
    log "INFO" "7. 💻 Verificando recursos do sistema..."
    
    # Verificar espaço em disco
    local disk_usage=$(df -h . 2>/dev/null | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ -n "$disk_usage" ] && [ "$disk_usage" -gt 90 ]; then
        log "WARNING" "⚠️  Espaço em disco baixo: ${disk_usage}% usado"
        warnings_count=$((warnings_count + 1))
    elif [ -n "$disk_usage" ]; then
        log "SUCCESS" "✅ Espaço em disco OK: ${disk_usage}% usado"
    fi
    
    # Verificar memória (se disponível)
    if command -v free &> /dev/null; then
        local mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
        if [ -n "$mem_usage" ] && [ "$mem_usage" -gt 90 ]; then
            log "WARNING" "⚠️  Uso de memória alto: ${mem_usage}%"
            warnings_count=$((warnings_count + 1))
        elif [ -n "$mem_usage" ]; then
            log "SUCCESS" "✅ Uso de memória OK: ${mem_usage}%"
        fi
    fi
    
    echo ""
    
    # 8. Resumo final do diagnóstico
    log "INFO" "8. 📊 Resumo do diagnóstico:"
    echo ""
    
    if [ "$overall_health" = true ] && [ "$errors_count" -eq 0 ]; then
        echo -e "${GREEN}🎉 SISTEMA ESTÁ FUNCIONANDO PERFEITAMENTE!${NC}"
        
        if [ "$warnings_count" -eq 0 ]; then
            echo -e "${GREEN}   Nenhum problema encontrado.${NC}"
        else
            echo -e "${YELLOW}   $warnings_count aviso(s) encontrado(s), mas não afetam o funcionamento.${NC}"
        fi
        
        echo ""
        echo -e "${CYAN}🔗 Links úteis:${NC}"
        echo -e "   • Backend: ${CYAN}http://localhost:3000${NC}"
        echo -e "   • Backend Health: ${CYAN}http://localhost:3000/health${NC}"
        echo -e "   • pgAdmin: ${CYAN}http://localhost:8080${NC}"
        echo -e "   • Prisma Studio: ${CYAN}./scripts/dev.sh db:studio${NC}"
        
    elif [ "$errors_count" -eq 0 ]; then
        echo -e "${YELLOW}⚠️  SISTEMA FUNCIONANDO COM AVISOS${NC}"
        echo -e "${YELLOW}   $warnings_count aviso(s) encontrado(s).${NC}"
        echo ""
        echo -e "${CYAN}🔗 Links disponíveis:${NC}"
        if [ "$backend_running" = true ]; then
            echo -e "   • Backend: ${CYAN}http://localhost:3000${NC}"
        fi
        if [ "$pgadmin_running" = true ]; then
            echo -e "   • pgAdmin: ${CYAN}http://localhost:8080${NC}"
        fi
        
    else
        echo -e "${RED}❌ SISTEMA COM PROBLEMAS${NC}"
        echo -e "${RED}   $errors_count erro(s) e $warnings_count aviso(s) encontrado(s).${NC}"
        echo ""
        echo -e "${YELLOW}🔧 Ações recomendadas:${NC}"
        
        if ! command -v docker &> /dev/null || ! docker info &> /dev/null; then
            echo -e "   1. ${CYAN}Instalar/iniciar Docker${NC}"
        fi
        
        if [ "$postgres_running" = false ] || [ "$backend_running" = false ]; then
            echo -e "   2. ${CYAN}./scripts/dev.sh up${NC} - Iniciar containers"
        fi
        
        if [ "$postgres_running" = false ]; then
            echo -e "   3. ${CYAN}./scripts/dev.sh logs postgres${NC} - Ver logs do PostgreSQL"
        fi
        
        if [ "$backend_running" = false ]; then
            echo -e "   4. ${CYAN}./scripts/dev.sh logs backend${NC} - Ver logs do Backend"
        fi
        
        echo -e "   • ${CYAN}./scripts/dev.sh status${NC} - Ver status detalhado"
        echo -e "   • ${CYAN}./scripts/dev.sh setup${NC} - Setup completo do projeto"
        echo -e "   • ${CYAN}./scripts/dev.sh rebuild${NC} - Rebuild dos containers"
    fi
    
    echo ""
    echo -e "${PURPLE}📋 Comandos úteis para diagnóstico:${NC}"
    echo -e "   • ${CYAN}./scripts/dev.sh status${NC} - Status dos containers"
    echo -e "   • ${CYAN}./scripts/dev.sh logs${NC} - Ver todos os logs"
    echo -e "   • ${CYAN}docker compose ps${NC} - Status direto do compose"
    echo -e "   • ${CYAN}docker ps${NC} - Todos os containers rodando"
    
    echo ""
    
    # Retornar código baseado na saúde geral
    if [ "$overall_health" = true ] && [ "$errors_count" -eq 0 ]; then
        return 0
    else
        return 1
    fi
}

cmd_pgadmin() {
    cmd_db_info
}

# Comandos Rápidos
cmd_fresh() {
    log "INFO" "🆕 Reinício completo (down + up + migrate)..."
    
    cd "$PROJECT_DIR"
    docker compose down
    docker compose up -d
    wait_for_services
    
    run_in_container "$BACKEND_SERVICE" npx prisma migrate dev
    run_in_container "$BACKEND_SERVICE" npx prisma generate
    
    log "SUCCESS" "✅ Reinício completo finalizado!"
}

cmd_watch() {
    log "INFO" "🔥 Iniciando modo desenvolvimento com hot reload..."
    log "INFO" "Arquivos serão sincronizados automaticamente!"
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                🔥 HOT RELOAD ATIVO 🔥                     ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}📁 Arquivos monitorados:${NC}"
    echo -e "   • ${CYAN}schema.prisma${NC} - Mudanças refletem automaticamente"
    echo -e "   • ${CYAN}*.ts, *.js${NC} - Hot reload no backend"
    echo -e "   • ${CYAN}Todos os arquivos${NC} - Sincronização instantânea"
    echo ""
    echo -e "${YELLOW}💡 Para testar:${NC}"
    echo -e "   1. Edite ${CYAN}backend/prisma/schema.prisma${NC}"
    echo -e "   2. Execute: ${CYAN}./scripts/dev.sh db:migrate${NC} (em outro terminal)"
    echo -e "   3. Veja a mágica acontecer! ✨"
    echo ""
    echo -e "${YELLOW}🔧 URLs úteis:${NC}"
    echo -e "   • Backend: ${CYAN}http://localhost:3000${NC}"
    echo -e "   • Prisma Studio: ${CYAN}./scripts/dev.sh db:studio${NC}"
    echo ""
    echo -e "${RED}⏹️  Pressione Ctrl+C para parar${NC}"
    echo ""
    
    check_containers
    
    # Follow logs para ver o hot reload em ação
    cd "$PROJECT_DIR"
    docker compose logs -f backend
}

# Main - processar argumentos
main() {
    case "${1:-help}" in
        # Docker commands
        "up") cmd_up ;;
        "down") cmd_down ;;
        "restart") cmd_restart ;;
        "rebuild") cmd_rebuild ;;
        "logs") cmd_logs "$2" ;;
        "status") cmd_status ;;
        
        # Database commands
        "db:setup") cmd_db_setup ;;
        "db:migrate") cmd_db_migrate "${2:-}" ;;
        "db:push") cmd_db_push ;;
        "db:list") cmd_db_list ;;
        "db:reset") cmd_db_reset ;;
        "db:seed") cmd_db_seed ;;
        "db:studio") cmd_db_studio ;;
        "db:backup") cmd_db_backup ;;
        "db:restore") cmd_db_restore "${2:-}" ;;
        "db:info") cmd_db_info ;;
        
        # Development commands
        "setup") cmd_setup ;;
        "dev") cmd_dev ;;
        "build") cmd_build ;;
        "test") cmd_test ;;
        "lint") cmd_lint ;;
        "format") cmd_format ;;
        
        # Frontend commands
        "frontend:dev") cmd_frontend_dev ;;
        "frontend:build") cmd_frontend_build ;;
        "frontend:ios") cmd_frontend_ios ;;
        "frontend:android") cmd_frontend_android ;;
        
        # Utility commands
        "fresh") cmd_fresh ;;
        "watch") cmd_watch ;;
        "shell") cmd_shell "${2:-}" ;;
        "clean") cmd_clean ;;
        "clean:images") cmd_clean_images ;;
        "clean:volumes") cmd_clean_volumes ;;
        "clean:all") cmd_clean_all ;;
        "health") cmd_health ;;
        "pgadmin") cmd_pgadmin ;;
        
        # Help
        "help"|*) show_help ;;
    esac
}

# Trap para cleanup
trap 'log "INFO" "Script interrompido"' INT TERM

# Executar main
main "$@"
