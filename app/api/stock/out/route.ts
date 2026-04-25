import { NextRequest } from "next/server";
import {
  ApiError,
  apiResponse,
  requireAuth,
  withErrorHandler,
} from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

type StockItemInput = {
  variantId: string;
  quantity: number;
};

function parseStockItems(body: {
  items?: StockItemInput[];
  variantId?: string;
  quantity?: number;
}) {
  const items = Array.isArray(body.items)
    ? body.items
    : body.variantId && body.quantity
      ? [{ variantId: body.variantId, quantity: body.quantity }]
      : [];

  if (items.length === 0) {
    throw new ApiError("Tambahkan minimal satu SKU.", 400);
  }

  for (const item of items) {
    if (
      !item.variantId ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new ApiError(
        "Setiap SKU harus punya jumlah barang keluar yang valid.",
        400
      );
    }
  }

  return items;
}

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth();

  const body = await req.json();
  const { note } = body;
  const items = parseStockItems(body);

  const result = await prisma.$transaction(async (tx) => {
    const createdIds: string[] = [];

    for (const item of items) {
      const updated = await tx.productVariant.updateMany({
        where: {
          id: item.variantId,
          isActive: true,
          stock: { gte: item.quantity },
        },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      if (updated.count === 0) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          select: { id: true, isActive: true, sku: true, stock: true },
        });

        if (!variant) {
          throw new ApiError("SKU tidak ditemukan.", 404);
        }

        if (!variant.isActive) {
          throw new ApiError("SKU tidak aktif dan tidak bisa dikeluarkan.", 409);
        }

        throw new ApiError(
          `Stok ${variant.sku} tidak cukup. Tersedia ${variant.stock}, diminta ${item.quantity}.`,
          409
        );
      }

      const stockOut = await tx.stockOut.create({
        data: {
          variantId: item.variantId,
          quantity: item.quantity,
          note,
          userId: user.id,
        },
      });

      createdIds.push(stockOut.id);
    }

    return tx.stockOut.findMany({
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

  return apiResponse(result, 201, "Stok keluar berhasil dicatat.");
});
