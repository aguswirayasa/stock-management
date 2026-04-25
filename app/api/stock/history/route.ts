import { NextRequest } from "next/server";
import {
  ApiError,
  apiResponse,
  requireAdmin,
  withErrorHandler,
} from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

export const GET = withErrorHandler(async (req: NextRequest) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const rawLimit = Number(searchParams.get("limit") || "50");

  if (!Number.isInteger(rawLimit)) {
    throw new ApiError("Limit harus berupa angka.", 400);
  }

  const limit = Math.min(Math.max(rawLimit, 1), 200);
  const include = {
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

  const [stockIns, stockOuts] = await Promise.all([
    prisma.stockIn.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include,
    }),
    prisma.stockOut.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include,
    }),
  ]);

  const history = [
    ...stockIns.map((item) => ({ ...item, type: "IN" as const })),
    ...stockOuts.map((item) => ({ ...item, type: "OUT" as const })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);

  return apiResponse(history);
});
