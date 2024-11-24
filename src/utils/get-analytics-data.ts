import prisma from "./db";

export async function getAnalyticsData() {
  const totalUsers = await prisma.user.count();
  const totalProducts = await prisma.product.count();

  const totalSales = await prisma.order.count();

  const totalRevenueResult = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
  });

  const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
}

export async function getDailySalesData(startDate: Date, endDate: Date) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
    });

    const groupedData = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { sales: 0, revenue: 0 };
      }
      acc[date].sales += 1;
      acc[date].revenue += order.totalAmount;
      return acc;
    }, {} as Record<string, { sales: number; revenue: number }>);

    const dateArray = getDatesInRange(startDate, endDate);

    return dateArray.map((date) => ({
      date,
      sales: groupedData[date]?.sales || 0,
      revenue: groupedData[date]?.revenue || 0,
    }));
  } catch (error) {
    console.error("Error fetching daily sales data:", error);
    throw error;
  }
}

function getDatesInRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
