import { PrismaClient, ProductSize } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "unit-hoodie-grey",
    name: "UNIT HOODIE GREY",
    price: 4990,
    description: "Heavyweight hoodie. Oversized fit.",
    images: ["/images/p1.jpg", "/images/p1.2.jpg", "/images/p1.3.jpg"],
    sizes: [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL],
  },
  {
    slug: "basic-tee",
    name: "BASIC TEE",
    price: 3900,
    description: "Premium cotton t-shirt.",
    images: ["/images/p2.1.jpg", "/images/p2.2.jpg", "/images/p2.jpg"],
    sizes: [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL],
  },
  {
    slug: "oimo-pants",
    name: "OIMO Pants",
    price: 2900,
    description: "Oversized fit.",
    images: ["/images/p3.jpg", "/images/p3.3.jpg"],
    sizes: [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL],
  },
];

async function main() {
  for (const [index, product] of products.entries()) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        isActive: true,
        images: {
          deleteMany: {},
          create: product.images.map((url, imageIndex) => ({
            url,
            sortOrder: imageIndex,
          })),
        },
        sizes: {
          deleteMany: {},
          create: product.sizes.map((size) => ({
            size,
            stock: 10 + index,
          })),
        },
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        images: {
          create: product.images.map((url, imageIndex) => ({
            url,
            sortOrder: imageIndex,
          })),
        },
        sizes: {
          create: product.sizes.map((size) => ({
            size,
            stock: 10 + index,
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
