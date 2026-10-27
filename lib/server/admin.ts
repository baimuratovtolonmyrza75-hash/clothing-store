import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/auth";

export async function getAdminOverview() {
  await requireAdmin();

  const [ordersCount, pendingOrdersCount, productsCount, usersCount] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: {
          OR: [
            { status: "PENDING" },
            { paymentStatus: "PENDING" },
          ],
        },
      }),
      prisma.product.count(),
      prisma.user.count(),
    ]);

  return {
    ordersCount,
    pendingOrdersCount,
    productsCount,
    usersCount,
  };
}

export async function getAdminOrders() {
  await requireAdmin();

  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}

export async function getAdminProducts() {
  await requireAdmin();

  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      sizes: {
        orderBy: { size: "asc" },
      },
    },
  });
}
