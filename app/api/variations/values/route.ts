import prisma from "@/lib/prisma";
import { apiResponse, apiError, withErrorHandler, requireAdmin } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

// GET /api/variations/values?typeId=xxx — list values for a type
export const GET = withErrorHandler(async (req: NextRequest) => {
  const typeId = req.nextUrl.searchParams.get("typeId");

  const values = await prisma.variationValue.findMany({
    where: typeId ? { variationTypeId: typeId } : undefined,
    include: {
      variationType: { select: { name: true } },
      _count: { select: { productVariantValues: true } },
    },
    orderBy: { value: "asc" },
  });

  return apiResponse(values);
});

// POST /api/variations/values — create a new VariationValue
export const POST = withErrorHandler(async (req: Request) => {
  await requireAdmin();

  const body = await req.json();
  const { value, variationTypeId } = body;

  if (!value || typeof value !== "string" || value.trim().length === 0) {
    return apiError("Value is required", 400);
  }
  if (!variationTypeId) {
    return apiError("variationTypeId is required", 400);
  }

  const trimmed = value.trim();

  // Ensure type exists
  const type = await prisma.variationType.findUnique({ where: { id: variationTypeId } });
  if (!type) return apiError("Variation type not found", 404);

  // Check duplicate within the same type
  const existing = await prisma.variationValue.findUnique({
    where: { variationTypeId_value: { variationTypeId, value: trimmed } },
  });
  if (existing) {
    return apiError(`Nilai "${trimmed}" sudah ada di tipe "${type.name}"`, 409);
  }

  const variationValue = await prisma.variationValue.create({
    data: { value: trimmed, variationTypeId },
    include: { variationType: { select: { name: true } } },
  });

  return apiResponse(variationValue, 201, `Nilai "${trimmed}" berhasil ditambahkan`);
});
