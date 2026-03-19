import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      firstName: 'Администратор',
      lastName: 'Системы',
      department: 'IT',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Created admin user:', admin.email);

  // Create test user
  const testPasswordHash = await bcrypt.hash('test123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash: testPasswordHash,
      firstName: 'Тестовый',
      lastName: 'Пользователь',
      department: 'AML',
      role: 'AML_OFFICER',
      isActive: true,
    },
  });

  console.log('Created test user:', testUser.email);

  // Create sample legal entity
  const legalEntity = await prisma.legalEntity.upsert({
    where: { inn: '7707083893' },
    update: {},
    create: {
      inn: '7707083893',
      name: 'ООО "Тестовая компания"',
      fullName: 'Общество с ограниченной ответственностью "Тестовая компания"',
      address: 'г. Москва, ул. Тестовая, д. 1',
      director: 'Иванов Иван Иванович',
      activity: 'Тестовая деятельность',
      status: 'IN_PROGRESS',
      checkedById: admin.id,
    },
  });

  console.log('Created legal entity:', legalEntity.name);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });