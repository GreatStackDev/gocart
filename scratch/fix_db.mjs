import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.order.updateMany({
    where: { paymentMethod: 'STRIPE' },
    data: { paymentMethod: 'COD' }
  });
  console.log(`Updated ${updated.count} orders from STRIPE to COD.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
