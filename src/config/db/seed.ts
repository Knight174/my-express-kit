import prisma from './prisma';

async function seed() {
  try {
    // 创建用户
    const user1 = await prisma.user.create({
      data: {
        email: 'user1@example.com',
        username: 'User 1',
        password: '123456',
        posts: {
          create: [
            {
              title: 'Post 1',
              content: 'Content of Post 1',
              published: true,
            },
            {
              title: 'Post 2',
              content: 'Content of Post 2',
              published: false,
            },
          ],
        },
      },
      include: {
        posts: true,
      },
    });

    const user2 = await prisma.user.create({
      data: {
        email: 'user2@example.com',
        username: 'User 2',
        password: '654321',
        posts: {
          create: [
            {
              title: 'Post 3',
              content: 'Content of Post 3',
              published: true,
            },
            {
              title: 'Post 4',
              content: 'Content of Post 4',
              published: true,
            },
          ],
        },
      },
      include: {
        posts: true,
      },
    });

    console.log('Seeding completed successfully.');
    console.log('Created users:');
    console.log(user1);
    console.log(user2);

    // 关闭 Prisma 客户端连接
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error seeding the database:', error);
    // 关闭 Prisma 客户端连接
    await prisma.$disconnect();
  }
}

seed();
