import { db } from '../src/server/db';

async function main() {
  // Seed Sports
  const sports = [
    { id: '1', name: 'Football' },
    { id: '2', name: 'Basketball' },
    { id: '3', name: 'Tennis' },
    { id: '4', name: 'Golf' },
    { id: '5', name: 'Baseball' },
    { id: '6', name: 'Soccer' },
    { id: '7', name: 'Volleyball' },
    { id: '8', name: 'Rugby' },
    { id: '9', name: 'Cricket' },
    { id: '10', name: 'Hockey' },
  ];

  await Promise.all(
    sports.map(async (sport) => {
      await db.sport.upsert({
        where: { id: sport.id },
        update: sport,
        create: sport,
      });
    })
  );

  // Seed Categories
  const categories = [
    { id: '1', name: 'Jerseys', sportId: '1' },
    { id: '2', name: 'Shoes', sportId: '1' },
    { id: '3', name: 'Hats', sportId: '1' },
    { id: '4', name: 'Jerseys', sportId: '2' },
    { id: '5', name: 'Shoes', sportId: '2' },
    { id: '6', name: 'Racquets', sportId: '3' }, 
    { id: '7', name: 'Clubs', sportId: '4' },
    { id: '8', name: 'Bats', sportId: '5' },
    { id: '9', name: 'Gloves', sportId: '6' },
    { id: '10', name: 'Kits', sportId: '7' },
    { id: '11', name: 'Protective Gear', sportId: '8' },
    { id: '12', name: 'Sticks', sportId: '9' },
    { id: '13', name: 'Pads', sportId: '10' },
  ];


  await Promise.all(
    categories.map(async (category) => {
      await db.category.upsert({
        where: { id: category.id },
        update: category,
        create: category,
      });
    })
  );

  // Seed Subcategories
   const subcategories = [
    { id: '1', name: 'NFL Jerseys', categoryId: '1' },
    { id: '2', name: 'NBA Jerseys', categoryId: '4' },
    { id: '3', name: 'Football Shoes', categoryId: '2' },
    { id: '4', name: 'Basketball Shoes', categoryId: '5' },
    { id: '5', name: 'Tennis Racquets', categoryId: '6' },
    { id: '6', name: 'Golf Clubs', categoryId: '7' },
    { id: '7', name: 'Baseball Bats', categoryId: '8' },
    { id: '8', name: 'Soccer Cleats', categoryId: '9' },
    { id: '9', name: 'Volleyball Kits', categoryId: '10' },
    { id: '10', name: 'Rugby Protective Gear', categoryId: '11' },
    { id: '11', name: 'Cricket Sticks', categoryId: '12' },
    { id: '12', name: 'Hockey Pads', categoryId: '13' },
    { id: '13', name: 'MLB Jerseys', categoryId: '1' },
    { id: '14', name: 'NHL Jerseys', categoryId: '1' },
    { id: '15', name: 'Soccer Jerseys', categoryId: '4' },
    { id: '16', name: 'Tennis Shoes', categoryId: '5' },
    { id: '17', name: 'Golf Balls', categoryId: '7' },
    { id: '18', name: 'Baseball Gloves', categoryId: '8' },
    { id: '19', name: 'Volleyball Shoes', categoryId: '10' },
    { id: '20', name: 'Rugby Balls', categoryId: '11' },
  ];

  await Promise.all(
    subcategories.map(async (subcategory) => {
      await db.subcategory.upsert({
        where: { id: subcategory.id },
        update: subcategory,
        create: subcategory,
      });
    })
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });