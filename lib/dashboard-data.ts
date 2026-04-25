import prisma from "@/lib/prisma";

const transactionInclude = {
  variant: {
    include: {
      product: true,
      values: {
        include: {
          variationValue: {
            include: {
              variationType: true,
            },
          },
        },
      },
    },
  },
  user: {
    select: { name: true, username: true },
  },
};

export async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalProducts,
    totalVariants,
    totalStock,
    lowStockCount,
    lowStockVariants,
    stockInsToday,
    stockOutsToday,
    stockIns,
    stockOuts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.productVariant.count({ where: { isActive: true } }),
    prisma.productVariant.aggregate({
      where: { isActive: true },
      _sum: { stock: true },
    }),
    prisma.productVariant.count({
      where: {
        isActive: true,
        stock: { lte: prisma.productVariant.fields.minStock },
      },
    }),
    prisma.productVariant.findMany({
      where: {
        isActive: true,
        stock: { lte: prisma.productVariant.fields.minStock },
      },
      include: {
        product: true,
        values: {
          include: {
            variationValue: {
              include: {
                variationType: true,
              },
            },
          },
        },
      },
      orderBy: [{ stock: "asc" }, { sku: "asc" }],
      take: 10,
    }),
    prisma.stockIn.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { quantity: true },
    }),
    prisma.stockOut.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { quantity: true },
    }),
    prisma.stockIn.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: transactionInclude,
    }),
    prisma.stockOut.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: transactionInclude,
    }),
  ]);

  const recentTransactions = [
    ...stockIns.map((item) => ({ ...item, type: "IN" as const })),
    ...stockOuts.map((item) => ({ ...item, type: "OUT" as const })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return {
    totals: {
      products: totalProducts,
      activeSkus: totalVariants,
      totalStock: totalStock._sum.stock || 0,
      lowStock: lowStockCount,
    },
    today: {
      stockIn: stockInsToday._sum.quantity || 0,
      stockOut: stockOutsToday._sum.quantity || 0,
    },
    lowStockVariants,
    recentTransactions,
  };
}
