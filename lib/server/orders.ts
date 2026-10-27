import { randomInt } from "node:crypto";
import { ProductSize } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";

const checkoutSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(80),
  phone: z.string().trim().min(1, "Phone number is required.").max(40),
  address: z.string().trim().min(1, "Address is required.").max(200),
  cart: z.array(z.object({
    id: z.string().min(1).max(100),
    size: z.enum(["S", "M", "L", "XL"]),
    quantity: z.number().int().positive().max(99),
  })).min(1, "Cart is empty.").max(30, "Too many different products in the cart.")
    .superRefine((items, context) => {
      const seen = new Set<string>();

      items.forEach((item, index) => {
        const key = `${item.id}:${item.size}`;
        if (seen.has(key)) {
          context.addIssue({
            code: "custom",
            path: [index],
            message: "The cart contains a duplicate product size.",
          });
        }
        seen.add(key);
      });
    }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

function normalizeSize(size: string): ProductSize {
  return ProductSize[size as keyof typeof ProductSize];
}

function createOrderNumber() {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const random = randomInt(100000, 1000000);

  return `OIMO-${year}${month}${day}-${random}`;
}

export async function createOrder(rawInput: unknown) {
  const parsed = checkoutSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid checkout payload.",
    };
  }

  const input = parsed.data;
  const currentUser = await getCurrentUser();

  return prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: {
        id: { in: input.cart.map((item) => item.id) },
        isActive: true,
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        sizes: true,
      },
    });
    const productsById = new Map(products.map((product) => [product.id, product]));

    const orderItems = [];

    for (const item of input.cart) {
      const product = productsById.get(item.id);

      if (!product) {
        return {
          ok: false as const,
          status: 409,
          error: "A product in your cart is no longer available. Please refresh the page.",
        };
      }

      const variant = product.sizes.find((entry) => entry.size === normalizeSize(item.size));

      if (!variant || variant.stock < item.quantity) {
        return {
          ok: false as const,
          status: 409,
          error: `Not enough stock for ${product.name} (size ${item.size}). Please update your cart.`,
        };
      }

      orderItems.push({
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal: product.price * item.quantity,
        productName: product.name,
        productImageUrl: product.images[0]?.url ?? null,
        size: normalizeSize(item.size),
        productId: product.id,
        productVariantId: variant.id,
      });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const order = await tx.order.create({
      data: {
        orderNumber: createOrderNumber(),
        status: "PENDING",
        paymentStatus: "PENDING",
        currency: "KGS",
        subtotalAmount: subtotal,
        shippingAmount: 0,
        totalAmount: subtotal,
        email: null,
        firstName: input.firstName,
        lastName: null,
        phone: input.phone,
        address: input.address,
        city: null,
        postalCode: null,
        country: null,
        userId: currentUser?.id ?? null,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return {
      ok: true as const,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      items: order.items.map((item) => ({
        productName: item.productName,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      })),
    };
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}
