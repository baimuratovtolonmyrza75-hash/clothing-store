import { prisma } from "@/lib/prisma";
import type { CatalogProduct } from "@/lib/types";

function mapProduct(product: {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
}) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    images: [],
    sizes: [],
  };
}

export async function getActiveProducts(): Promise<StoreProduct[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      sizes: {
        orderBy: { size: "asc" },
      },
    },
  });

  return products.map((product) => ({
    ...mapProduct(product),
    images: product.images.map((image) => image.url),
    sizes: product.sizes
      .filter((variant) => variant.stock > 0)
      .map((variant) => variant.size),
  }));
}

export async function getProductBySlug(slug: string): Promise<StoreProduct | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      sizes: {
        orderBy: { size: "asc" },
      },
    },
  });

  if (!product || !product.isActive) {
    return null;
  }

  return {
    ...mapProduct(product),
    images: product.images.map((image) => image.url),
    sizes: product.sizes
      .filter((variant) => variant.stock > 0)
      .map((variant) => variant.size),
  };
}

export type StoreProduct = CatalogProduct;

export async function getProductById(id: string): Promise<StoreProduct | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      sizes: {
        orderBy: { size: "asc" },
      },
    },
  });

  if (!product || !product.isActive) {
    return null;
  }

  return {
    ...mapProduct(product),
    images: product.images.map((image) => image.url),
    sizes: product.sizes
      .filter((variant) => variant.stock > 0)
      .map((variant) => variant.size),
  };
}
