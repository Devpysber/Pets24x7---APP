import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  // Create a user
  const user = await prisma.user.create({
    data: {
      id: 'u1',
      name: 'Antriksh Shah',
      email: 'shah.antriksh@gmail.com',
      avatar: 'https://picsum.photos/seed/user1/100/100',
      role: 'ADMIN',
    }
  });

  // Create a vendor
  const vendor = await prisma.vendor.create({
    data: {
      id: 'v1',
      userId: user.id,
      businessName: 'Pawsome Grooming',
      city: 'Mumbai',
      address: '123 Pet St, Mumbai',
      subscriptions: {
        create: {
          plan: 'PLATINUM',
          isActive: true,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }
      }
    }
  });

  // Create listings
  const listings = [
    {
      id: 's1',
      title: 'Premium Grooming Spa',
      category: 'GROOMING',
      location: 'Andheri West, Mumbai',
      city: 'Mumbai',
      priceRange: '₹1,200',
      rating: 4.8,
      totalReviews: 124,
      isVerified: true,
      isPremium: true,
      vendorId: vendor.id,
      petTypes: JSON.stringify(['Dogs', 'Cats']),
      tags: JSON.stringify(['Spa', 'Haircut', 'Bath']),
      images: JSON.stringify(['https://picsum.photos/seed/grooming1/400/300', 'https://picsum.photos/seed/grooming2/400/300'])
    },
    {
      id: 's2',
      title: 'City Vet Clinic',
      category: 'VET_CLINIC',
      location: 'Bandra, Mumbai',
      city: 'Mumbai',
      priceRange: '₹500',
      rating: 4.9,
      totalReviews: 89,
      isVerified: true,
      isPremium: false,
      vendorId: vendor.id,
      petTypes: JSON.stringify(['Dogs', 'Cats', 'Birds']),
      tags: JSON.stringify(['Emergency', 'Vaccination', 'Surgery']),
      images: JSON.stringify(['https://picsum.photos/seed/vet1/400/300'])
    }
  ];

  for (const l of listings) {
    await prisma.listing.create({ data: l as any });
  }

  // Create banners
  await prisma.banner.createMany({
    data: [
      {
        id: 'b1',
        title: 'Summer Pet Care Sale!',
        image: 'https://picsum.photos/seed/banner1/800/400',
        link: '/explore',
        isActive: true
      },
      {
        id: 'b2',
        title: 'Free Vet Consultation',
        image: 'https://picsum.photos/seed/banner2/800/400',
        link: '/explore',
        isActive: true
      }
    ]
  });

  // Create community posts
  const post = await prisma.communityPost.create({
    data: {
      id: 'p1',
      userId: user.id,
      content: 'Just got my dog groomed at Pawsome Grooming! They did an amazing job.',
      category: 'STORIES',
      image: 'https://picsum.photos/seed/post1/600/400',
      likes: {
        create: { userId: user.id }
      },
      comments: {
        create: {
          userId: user.id,
          content: 'Looks great!'
        }
      }
    }
  });

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: user.id,
      type: 'system',
      title: 'Welcome to Pets24x7!',
      message: 'Explore the best services for your furry friends.',
      link: '/'
    }
  });

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
