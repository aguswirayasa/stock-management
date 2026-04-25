import prisma from "@/lib/prisma";
import { apiResponse, apiError, withErrorHandler, requireAdmin } from "@/lib/api-helpers";

// GET /api/variations/values/[id]
export const GET = withErrorHandler(async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const value = await prisma.variationValue.findUnique({
    where: { id },
    include: {
      variationType: true,
      _count: { select: { productVariantValues: true } },
    },
  });

  if (!value) return apiError("Variation value not found", 404);

  return apiResponse(value);
});

// PUT /api/variations/values/[id] — rename value
export const PUT = withErrorHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json();
  const { value } = body;

  if (!value || typeof value !== "string" || value.trim().length === 0) {
    return apiError("Value is required", 400);
  }

  const trimmed = value.trim();

  const existing = await prisma.variationValue.findUnique({ where: { id } });
  if (!existing) return apiError("Variation value not found", 404);

  // Check duplicate within the same type (excluding self)
  const duplicate = await prisma.variationValue.findFirst({
    where: {
      variationTypeId: existing.variationTypeId,
      value: trimmed,
      NOT: { id },
    },
  });
  if (duplicate) {
    return apiError(`Nilai "${trimmed}" sudah ada di tipe ini`, 409);
  }

  const updated = await prisma.variationValue.update({
    where: { id },
    data: { value: trimmed },
    include: { variationType: { select: { name: true } } },
  });

  return apiResponse(updated, 200, `Nilai diperbarui menjadi "${trimmed}"`);
});

// DELETE /api/variations/values/[id] — validate not in use by any SKU
export const DELETE = withErrorHandler(async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  await requireAdmin();
  const { id } = await params;

  // Check if any product variant uses this value
  const usageCount = await prisma.productVariantValue.count({
    where: { variationValueId: id },
  });

  if (usageCount > 0) {
    return apiError(
      `Tidak bisa dihapus: nilai ini digunakan oleh ${usageCount} SKU produk`,
      409
    );
  }

  await prisma.variationValue.delete({ where: { id } });

  return apiResponse(null, 200, "Nilai variasi berhasil dihapus");
});
