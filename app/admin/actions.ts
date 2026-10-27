"use server";

import { OrderStatus, PaymentStatus, ProductSize } from "@prisma/client";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/auth";

const productSchema = z.object({
  id: z.string().trim().optional(),
  slug: z.string().trim().min(2, "Slug is required."),
  name: z.string().trim().min(2, "Name is required."),
  description: z.string().trim().min(2, "Description is required."),
  price: z.coerce.number().int().positive("Price must be greater than zero."),
  images: z
    .string()
    .trim()
    .min(1, "At least one image is required.")
    .transform((value) =>
      value
        .split("\n")
        .map((entry) => entry.trim())
        .filter(Boolean)
    ),
  sizes: z
    .array(z.enum(["S", "M", "L", "XL"]))
    .min(1, "Select at least one size."),
  isActive: z.boolean(),
});

function normalizeAdminProduct(formData: FormData) {
  return {
    id: (formData.get("id") as string | null) ?? undefined,
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    images: formData.get("images"),
    sizes: formData.getAll("sizes"),
    isActive: formData.get("isActive") === "on",
  };
}

async function persistUploadedImages(formData: FormData) {
  const files = formData
    .getAll("imageFiles")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length === 0) {
    return [];
  }

  const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const uploadedPaths: string[] = [];

  for (const file of files) {
    const extension = path.extname(file.name) || ".jpg";
    const safeBase = path
      .basename(file.name, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);
    const filename = `${Date.now()}-${safeBase || "product"}${extension.toLowerCase()}`;
    const fullPath = path.join(uploadDir, filename);
    const bytes = await file.arrayBuffer();

    await writeFile(fullPath, Buffer.from(bytes));
    uploadedPaths.push(`/images/uploads/${filename}`);
  }

  return uploadedPaths;
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();

  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");
  const paymentStatus = String(formData.get("paymentStatus") ?? "");

  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
    throw new Error("Invalid order status.");
  }

  if (!Object.values(PaymentStatus).includes(paymentStatus as PaymentStatus)) {
    throw new Error("Invalid payment status.");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: status as OrderStatus,
      paymentStatus: paymentStatus as PaymentStatus,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/account");
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();

  const uploadedImages = await persistUploadedImages(formData);
  const rawProduct = normalizeAdminProduct(formData);

  if (uploadedImages.length > 0) {
    const existingImages =
      typeof rawProduct.images === "string" && rawProduct.images.trim().length > 0
        ? `${rawProduct.images.trim()}\n${uploadedImages.join("\n")}`
        : uploadedImages.join("\n");

    rawProduct.images = existingImages;
  }

  const parsed = productSchema.safeParse(rawProduct);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid product data.");
  }

  const data = parsed.data;
  const productId = data.id;

  if (productId) {
    await prisma.$transaction(async (tx) => {
      const existingSizes = await tx.productVariant.findMany({
        where: { productId },
        select: { size: true },
      });
      const selectedSizes = data.sizes.map((size) => ProductSize[size]);

      await tx.product.update({
        where: { id: productId },
        data: {
          slug: data.slug,
          name: data.name,
          description: data.description,
          price: data.price,
          isActive: data.isActive,
          images: {
            deleteMany: {},
            create: data.images.map((url, index) => ({
              url,
              sortOrder: index,
            })),
          },
        },
      });

      await tx.productVariant.deleteMany({
        where: {
          productId,
          size: { notIn: selectedSizes },
        },
      });

      for (const size of selectedSizes) {
        if (!existingSizes.some((variant) => variant.size === size)) {
          await tx.productVariant.create({
            data: {
              productId,
              size,
              stock: 10,
            },
          });
        }
      }
    });
  } else {
    await prisma.product.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        price: data.price,
        isActive: data.isActive,
        images: {
          create: data.images.map((url, index) => ({
            url,
            sortOrder: index,
          })),
        },
        sizes: {
          create: data.sizes.map((size) => ({
            size: ProductSize[size],
            stock: 10,
          })),
        },
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();

  const productId = String(formData.get("productId") ?? "");

  if (!productId) {
    throw new Error("Product ID is required.");
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}
