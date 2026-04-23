import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';


const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const pegawaiPassword = await bcrypt.hash('pegawai123', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: adminPassword },
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const pegawai = await prisma.user.upsert({
    where: { username: 'pegawai' },
    update: { password: pegawaiPassword },
    create: {
      username: 'pegawai',
      password: pegawaiPassword,
      role: 'PEGAWAI',
    },
  });

  console.log({ admin, pegawai });
}

main()
  .then(async () => {
    await prisma.$disconnect();
 
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();

 
  });
