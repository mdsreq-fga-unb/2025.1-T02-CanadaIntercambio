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
    echo "  db:setup        - Configuração inicial do banco"
    echo "  db:migrate      - Executar migrations"
    echo "  db:push         - Push schema para banco"
    echo "  db:list         - Listar migrations disponíveis"
    echo "  db:reset        - Reset completo do banco"
    echo "  db:seed         - Executar seed"
    echo "  db:studio       - Abrir Prisma Studio"
    echo "  db:backup       - Fazer backup do banco"
    echo "  db:restore      - Restaurar backup"
    echo "  db:info         - Informações de conexão"
    echo ""
    echo -e "${YELLOW}🔧 Comandos Desenvolvimento:${NC}"
    echo "  setup           - Configuração inicial completa"
    echo "  dev             - Modo desenvolvimento (watch)"
    echo "  build           - Build do projeto"
    echo "  test            - Executar testes"
    echo "  lint            - Executar linting"
    echo "  format          - Formatar código"
    echo ""
    echo -e "${YELLOW}📱 Comandos Frontend:${NC}"
    echo "  frontend:dev    - Iniciar frontend em desenvolvimento"
    echo "  frontend:build  - Build do frontend"
    echo "  frontend:ios    - Executar no iOS"
    echo "  frontend:android - Executar no Android"
    echo ""
    echo -e "${YELLOW}⚡ Comandos Rápidos (Quick):${NC}"
    echo "  g, gen          - Gerar Prisma Client"
    echo "  m, mig          - Migration rápida"
    echo "  l, list         - Listar migrations"
    echo "  p, push         - Push schema para DB"
    echo "  s, studio       - Abrir Prisma Studio"
    echo "  fresh, f        - Fresh start completo"
    echo "  watch, w        - Modo watch com hot reload"
    echo "  sh, shell       - Shell do container"
    echo ""
    echo -e "${YELLOW}🛠️  Comandos Utilitários:${NC}"
    echo "  clean           - Limpar cache e arquivos temporários"
    echo "  clean:images    - Limpar todas as imagens Docker"
    echo "  clean:volumes   - Limpar todos os volumes Docker"
    echo "  clean:all       - Limpeza completa (containers, imagens e volumes)"
    echo "  health          - Verificar saúde do sistema"
    echo "  pgadmin         - Informações do pgAdmin"
    echo "  help            - Mostrar esta ajuda"
    echo ""
    echo -e "${YELLOW}Exemplos:${NC}"
    echo "  ./scripts/dev.sh setup"
    echo "  ./scripts/dev.sh up"
    echo "  ./scripts/dev.sh w          # Hot reload mode"
    echo "  ./scripts/dev.sh db:migrate"
    echo "  ./scripts/dev.sh db:push"
    echo "  ./scripts/dev.sh db:list"
    echo "  ./scripts/dev.sh g"
    echo "  ./scripts/dev.sh l"
    echo "  ./scripts/dev.sh fresh"
    echo "  ./scripts/dev.sh clean:all"
    echo ""
}

# Função para verificar dependências
check_dependencies() {
    log "INFO" "Verificando dependências..."
    
    local missing_deps=()
    
    if ! command -v docker &> /dev/null; then
        missing_deps+=("docker")
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        missing_deps+=("docker-compose")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log "ERROR" "Dependências ausentes: ${missing_deps[*]}"
        echo "Por favor, instale as dependências antes de continuar."
        exit 1
    fi
    
    log "SUCCESS" "Todas as dependências estão instaladas"
}

# Função para verificar se os containers estão rodando
check_containers() {
    cd "$PROJECT_DIR"
    
    # Verificar se os containers estão realmente rodando
    local containers_status
    if containers_status=$(docker compose ps --format json 2>/dev/null); then
        if [ -n "$containers_status" ] && [ "$containers_status" != "null" ]; then
            # Verificar se pelo menos um container está rodando
            if echo "$containers_status" | jq -e '.[] | select(.State == "running")' &> /dev/null; then
                log "INFO" "Containers estão rodando"
                return 0
            fi
        fi
    fi
    
    # Se chegou aqui, containers não estão rodando
    log "WARNING" "Containers não estão rodando. Iniciando..."
    docker compose up -d
    wait_for_services
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
    echo -e "   • 🔥 Hot Reload: ${CYAN}./scripts/dev.sh w${NC} (recomendado!)"
    echo -e "   • Frontend: ${CYAN}./scripts/dev.sh frontend:dev${NC}"
    echo -e "   • Prisma Studio: ${CYAN}./scripts/dev.sh s${NC}"
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
    log "INFO" "Status dos containers:"
    cd "$PROJECT_DIR"
    docker compose ps
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
    echo -e "• ${CYAN}./scripts/dev.sh g${NC} - Gerar Prisma Client"
    echo -e "• ${CYAN}./scripts/dev.sh m${NC} - Migration rápida"
    echo -e "• ${CYAN}./scripts/dev.sh l${NC} - Listar migrations"
    echo -e "• ${CYAN}./scripts/dev.sh fresh${NC} - Fresh start"
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
    log "INFO" "Verificando saúde do sistema..."
    
    cd "$PROJECT_DIR"
    
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                 🏥 DIAGNÓSTICO DO SISTEMA 🏥               ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Check if docker compose file exists
    if [ ! -f "docker-compose.yml" ]; then
        log "ERROR" "❌ Arquivo docker-compose.yml não encontrado"
        return 1
    fi
    
    # Check containers status
    log "INFO" "1. Verificando status dos containers..."
    local containers_running=false
    local postgres_running=false
    local backend_running=false
    
    # Get containers status
    local containers_status
    if containers_status=$(docker compose ps --format json 2>/dev/null); then
        if [ -n "$containers_status" ] && [ "$containers_status" != "null" ]; then
            # Check each service
            if echo "$containers_status" | jq -e '.[] | select(.Service == "postgres" and .State == "running")' &> /dev/null; then
                postgres_running=true
            fi
            
            if echo "$containers_status" | jq -e '.[] | select(.Service == "backend" and .State == "running")' &> /dev/null; then
                backend_running=true
            fi
            
            # Check if any container is running
            if echo "$containers_status" | jq -e '.[] | select(.State == "running")' &> /dev/null; then
                containers_running=true
            fi
        fi
    fi
    
    # Display containers status
    if [ "$containers_running" = true ]; then
        log "SUCCESS" "✅ Alguns containers estão rodando"
        
        if [ "$postgres_running" = true ]; then
            log "SUCCESS" "  ✅ PostgreSQL: Rodando"
        else
            log "ERROR" "  ❌ PostgreSQL: Parado"
        fi
        
        if [ "$backend_running" = true ]; then
            log "SUCCESS" "  ✅ Backend: Rodando"
        else
            log "ERROR" "  ❌ Backend: Parado"
        fi
    else
        log "ERROR" "❌ Nenhum container está rodando"
        echo ""
        echo -e "${YELLOW}💡 Para iniciar os serviços: ${CYAN}./scripts/dev.sh up${NC}"
        echo -e "${YELLOW}💡 Para setup inicial: ${CYAN}./scripts/dev.sh setup${NC}"
        echo ""
        return 1
    fi
    
    echo ""
    log "INFO" "2. Verificando conectividade do banco de dados..."
    
    # Check database connection
    if [ "$postgres_running" = true ]; then
        if docker compose exec postgres pg_isready -q 2>/dev/null; then
            log "SUCCESS" "✅ Banco de dados está acessível"
        else
            log "ERROR" "❌ Banco de dados não está acessível"
        fi
    else
        log "ERROR" "❌ Container PostgreSQL não está rodando"
    fi
    
    echo ""
    log "INFO" "3. Verificando backend API..."
    
    # Check backend health
    if [ "$backend_running" = true ]; then
        local backend_status
        if backend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health 2>/dev/null); then
            if [ "$backend_status" = "200" ]; then
                log "SUCCESS" "✅ Backend está respondendo (HTTP $backend_status)"
            else
                log "WARNING" "⚠️  Backend respondeu com HTTP $backend_status"
            fi
        else
            log "WARNING" "⚠️  Backend não está respondendo"
        fi
    else
        log "ERROR" "❌ Container Backend não está rodando"
    fi
    
    echo ""
    log "INFO" "4. Verificando portas..."
    
    # Check ports
    local ports_info=""
    if command -v netstat &> /dev/null; then
        if netstat -ln 2>/dev/null | grep -q ":3000 "; then
            ports_info+="✅ Porta 3000 (Backend) em uso\n"
        else
            ports_info+="❌ Porta 3000 (Backend) livre\n"
        fi
        
        if netstat -ln 2>/dev/null | grep -q ":5432 "; then
            ports_info+="✅ Porta 5432 (PostgreSQL) em uso\n"
        else
            ports_info+="❌ Porta 5432 (PostgreSQL) livre\n"
        fi
        
        if netstat -ln 2>/dev/null | grep -q ":8080 "; then
            ports_info+="✅ Porta 8080 (pgAdmin) em uso\n"
        else
            ports_info+="❌ Porta 8080 (pgAdmin) livre\n"
        fi
    else
        ports_info="⚠️  netstat não disponível - não é possível verificar portas"
    fi
    
    echo -e "$ports_info"
    
    echo ""
    log "INFO" "5. Resumo do diagnóstico:"
    
    if [ "$containers_running" = true ] && [ "$postgres_running" = true ] && [ "$backend_running" = true ]; then
        echo -e "${GREEN}🎉 Sistema está funcionando corretamente!${NC}"
        echo ""
        echo -e "${YELLOW}🔗 Links úteis:${NC}"
        echo -e "   • Backend: ${CYAN}http://localhost:3000${NC}"
        echo -e "   • Backend Health: ${CYAN}http://localhost:3000/health${NC}"
        echo -e "   • pgAdmin: ${CYAN}http://localhost:8080${NC}"
        echo -e "   • Prisma Studio: ${CYAN}./scripts/dev.sh db:studio${NC}"
    else
        echo -e "${RED}❌ Sistema não está funcionando corretamente${NC}"
        echo ""
        echo -e "${YELLOW}🔧 Ações recomendadas:${NC}"
        if [ "$containers_running" = false ]; then
            echo -e "   1. ${CYAN}./scripts/dev.sh up${NC} - Iniciar containers"
        fi
        if [ "$postgres_running" = false ]; then
            echo -e "   2. ${CYAN}./scripts/dev.sh logs postgres${NC} - Ver logs do PostgreSQL"
        fi
        if [ "$backend_running" = false ]; then
            echo -e "   3. ${CYAN}./scripts/dev.sh logs backend${NC} - Ver logs do Backend"
        fi
        echo -e "   • ${CYAN}./scripts/dev.sh status${NC} - Ver status detalhado"
        echo -e "   • ${CYAN}./scripts/dev.sh setup${NC} - Setup completo"
    fi
    
    echo ""
}

cmd_pgadmin() {
    cmd_db_info
}

# ===== COMANDOS RÁPIDOS (QUICK) =====
# Integração dos comandos do quick.sh

cmd_quick_generate() {
    log "INFO" "🔧 Gerando Prisma Client..."
    check_containers
    run_in_container "$BACKEND_SERVICE" npx prisma generate
    log "SUCCESS" "✅ Prisma Client gerado!"
}

cmd_quick_migrate() {
    local name="${1:-}"
    log "INFO" "🔄 Executando migration..."
    check_containers
    
    if [ -n "$name" ]; then
        run_in_container "$BACKEND_SERVICE" npx prisma migrate dev --name "$name"
    else
        run_in_container "$BACKEND_SERVICE" npx prisma migrate dev
    fi
    log "SUCCESS" "✅ Migration executada!"
}

cmd_quick_push() {
    log "INFO" "⬆️ Push para banco..."
    check_containers
    run_in_container "$BACKEND_SERVICE" npx prisma db push
    log "SUCCESS" "✅ Schema enviado!"
}

cmd_quick_studio() {
    log "INFO" "🎨 Abrindo Prisma Studio..."
    check_containers
    echo -e "${YELLOW}Prisma Studio: http://localhost:5555${NC}"
    run_in_container "$BACKEND_SERVICE" npx prisma studio
}

cmd_quick_list() {
    log "INFO" "📋 Listando migrations..."
    cmd_db_list
}

cmd_quick_fresh() {
    log "INFO" "🆕 Fresh start (down + up + migrate)..."
    
    cd "$PROJECT_DIR"
    docker compose down
    docker compose up -d
    wait_for_services
    
    run_in_container "$BACKEND_SERVICE" npx prisma migrate dev
    run_in_container "$BACKEND_SERVICE" npx prisma generate
    
    log "SUCCESS" "✅ Fresh start completo!"
}

cmd_quick_shell() {
    local service="${1:-$BACKEND_SERVICE}"
    log "INFO" "🐚 Shell do $service..."
    check_containers
    run_in_container "$service" bash
}

cmd_quick_watch() {
    log "INFO" "🔥 Iniciando modo watch com hot reload..."
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
    echo -e "${YELLOW}💡 Testando:${NC}"
    echo -e "   1. Edite ${CYAN}backend/prisma/schema.prisma${NC}"
    echo -e "   2. Execute: ${CYAN}./scripts/dev.sh m${NC} (em outro terminal)"
    echo -e "   3. Veja a magic acontecer! ✨"
    echo ""
    echo -e "${YELLOW}🔧 URLs:${NC}"
    echo -e "   • Backend: ${CYAN}http://localhost:3000${NC}"
    echo -e "   • Prisma Studio: ${CYAN}./scripts/dev.sh s${NC}"
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
        
        # Quick commands (atalhos rápidos)
        "g"|"gen"|"generate") cmd_quick_generate ;;
        "m"|"mig"|"migrate") cmd_quick_migrate "${2:-}" ;;
        "l"|"list") cmd_quick_list ;;
        "p"|"push") cmd_quick_push ;;
        "s"|"studio") cmd_quick_studio ;;
        "f"|"fresh") cmd_quick_fresh ;;
        "w"|"watch") cmd_quick_watch ;;
        "sh"|"shell") cmd_quick_shell "${2:-}" ;;
        
        # Utility commands
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
