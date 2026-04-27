import { NextRequest } from "next/server";
import {
  ApiError,
  apiResponse,
  requireAdmin,
  withErrorHandler,
} from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import { parseStockItems } from "@/lib/stock-validation";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAdmin();

  const body = await req.json();
  const { note } = body;
  const items = parseStockItems(body, "barang masuk");
  const variantIds = [...new Set(items.map((item) => item.variantId))];

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    select: { id: true, isActive: true },
  });

  if (variants.length !== variantIds.length) {
    throw new ApiError("SKU tidak ditemukan.", 404);
  }

  if (variants.some((variant) => !variant.isActive)) {
    throw new ApiError("SKU tidak aktif dan tidak bisa menerima stok.", 409);
  }

  const result = await prisma.$transaction(async (tx) => {
    const createdIds: string[] = [];

    for (const item of items) {
      const stockIn = await tx.stockIn.create({
        data: {
          variantId: item.variantId,
          quantity: item.quantity,
          note,
          userId: user.id,
        },
      });

      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      });

      createdIds.push(stockIn.id);
    }

    return tx.stockIn.findMany({
      where: { id: { in: createdIds } },
      orderBy: { createdAt: "desc" },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
        user: {
          select: { id: true, name: true, username: true },
        },
      },
    });
  });

  return apiResponse(result, 201, "Stok masuk berhasil dicatat.");
});
