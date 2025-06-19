import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes (opcional, comentar se não quiser)
  console.log('🗑️  Limpando dados existentes...')
  await prisma.user.deleteMany()

  // Inserir dados de teste para Users
  console.log('👥 Criando usuários de teste...')
  
  const users = await prisma.user.createMany({
    data: [
      {
        name: 'Admin Canada',
        email: 'admin@canadaintercambio.com',
      },
      {
        name: 'João Silva',
        email: 'joao.silva@email.com',
      },
      {
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
      },
      {
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
      },
      {
        name: 'Ana Costa',
        email: 'ana.costa@email.com',
      },
      {
        name: 'Carlos Souza',
        email: 'carlos.souza@email.com',
      },
      {
        name: 'Isabella Rodriguez',
        email: 'isabella.rodriguez@email.com',
      },
      {
        name: 'Lucas Ferreira',
        email: 'lucas.ferreira@email.com',
      },
      {
        name: 'Camila Lima',
        email: 'camila.lima@email.com',
      },
      {
        name: 'Rafael Almeida',
        email: 'rafael.almeida@email.com',
      }
    ],
  })

  console.log(`✅ ${users.count} usuários criados com sucesso!`)

  // Buscar e exibir alguns usuários criados
  const createdUsers = await prisma.user.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    }
  })

  console.log('📋 Alguns usuários criados:')
  createdUsers.forEach(user => {
    console.log(`   • ${user.name} (${user.email}) - ID: ${user.id}`)
  })

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro durante o seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
