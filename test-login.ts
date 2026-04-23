import 'dotenv/config';
import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

async function testLogin() {
  const user = await prisma.user.findUnique({
    where: { username: 'admin' },
  });
  
  if (!user) {
    console.log("User not found!");
    return;
  }
  console.log("User found:", user);

  const isMatch = await bcrypt.compare('admin123', user.password);
  console.log("Password match?", isMatch);

  console.log("DB password length:", user.password.length);
  
  const testHash = await bcrypt.hash('admin123', 10);
  console.log("Test Hash:", testHash);
  console.log("Test match?", await bcrypt.compare('admin123', testHash));
}

testLogin().catch(console.error).finally(() => process.exit());
