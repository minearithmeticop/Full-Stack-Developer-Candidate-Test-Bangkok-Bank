import { PrismaClient } from '@prisma/client';

export async function seed(prismaClient?: PrismaClient): Promise<void> {
  const prisma = prismaClient || new PrismaClient();

  // User A Collections
  await prisma.collection.upsert({
    where: { id: 'col-user-a-1' },
    update: {
      name: 'Work Tools',
      description: 'Work related links',
      ownerId: 'auth0|userA',
    },
    create: {
      id: 'col-user-a-1',
      name: 'Work Tools',
      description: 'Work related links',
      ownerId: 'auth0|userA',
    },
  });

  await prisma.collection.upsert({
    where: { id: 'col-user-a-2' },
    update: {
      name: 'Reading List',
      description: 'Tech blogs and articles',
      ownerId: 'auth0|userA',
    },
    create: {
      id: 'col-user-a-2',
      name: 'Reading List',
      description: 'Tech blogs and articles',
      ownerId: 'auth0|userA',
    },
  });

  // User B Collection
  await prisma.collection.upsert({
    where: { id: 'col-user-b-1' },
    update: {
      name: 'Personal Links',
      description: 'Personal bookmarks',
      ownerId: 'auth0|userB',
    },
    create: {
      id: 'col-user-b-1',
      name: 'Personal Links',
      description: 'Personal bookmarks',
      ownerId: 'auth0|userB',
    },
  });

  // User A Bookmarks
  await prisma.bookmark.upsert({
    where: { id: 'bm-user-a-1' },
    update: {
      title: 'Bangkok Bank Portal',
      url: 'https://www.bangkokbank.com',
      notes: 'Official website',
      collectionId: 'col-user-a-1',
      ownerId: 'auth0|userA',
    },
    create: {
      id: 'bm-user-a-1',
      title: 'Bangkok Bank Portal',
      url: 'https://www.bangkokbank.com',
      notes: 'Official website',
      collectionId: 'col-user-a-1',
      ownerId: 'auth0|userA',
    },
  });

  await prisma.bookmark.upsert({
    where: { id: 'bm-user-a-2' },
    update: {
      title: 'NestJS Documentation',
      url: 'https://docs.nestjs.com',
      notes: 'NestJS framework docs',
      collectionId: 'col-user-a-2',
      ownerId: 'auth0|userA',
    },
    create: {
      id: 'bm-user-a-2',
      title: 'NestJS Documentation',
      url: 'https://docs.nestjs.com',
      notes: 'NestJS framework docs',
      collectionId: 'col-user-a-2',
      ownerId: 'auth0|userA',
    },
  });

  await prisma.bookmark.upsert({
    where: { id: 'bm-user-a-3' },
    update: {
      title: 'Hacker News',
      url: 'https://news.ycombinator.com',
      notes: 'Tech news',
      collectionId: null,
      ownerId: 'auth0|userA',
    },
    create: {
      id: 'bm-user-a-3',
      title: 'Hacker News',
      url: 'https://news.ycombinator.com',
      notes: 'Tech news',
      collectionId: null,
      ownerId: 'auth0|userA',
    },
  });

  // User B Bookmark
  await prisma.bookmark.upsert({
    where: { id: 'bm-user-b-1' },
    update: {
      title: 'Example Blog',
      url: 'https://example.com/blog',
      notes: 'Personal blog',
      collectionId: 'col-user-b-1',
      ownerId: 'auth0|userB',
    },
    create: {
      id: 'bm-user-b-1',
      title: 'Example Blog',
      url: 'https://example.com/blog',
      notes: 'Personal blog',
      collectionId: 'col-user-b-1',
      ownerId: 'auth0|userB',
    },
  });

  if (!prismaClient) {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seed completed successfully.');
    })
    .catch((error) => {
      console.error('Seed error:', error);
      process.exit(1);
    });
}
