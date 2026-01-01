import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 1. Hash password 'admin123'
  // Angka 10 adalah salt rounds
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // 2. Buat user admin
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {}, // Jika sudah ada, jangan ubah apa-apa
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  })

  console.log('✅ Akun Admin berhasil dibuat!')
  console.log('👤 Username: admin')
  console.log('🔑 Password: admin123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })