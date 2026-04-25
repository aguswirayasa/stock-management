import prisma from "@/lib/prisma";
import { apiResponse, apiError, withErrorHandler, requireAdmin } from "@/lib/api-helpers";

// GET /api/variations/types/[id]
export const GET = withErrorHandler(async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const type = await prisma.variationType.findUnique({
    where: { id },
    include: {
      values: { orderBy: { value: "asc" } },
      _count: { select: { productVariationTypes: true } },
    },
  });

  if (!type) return apiError("Variation type not found", 404);

  return apiResponse(type);
});

// PUT /api/variations/types/[id] — rename
export const PUT = withErrorHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json();
  const { name } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return apiError("Name is required", 400);
  }

  const trimmed = name.trim();

  // Check duplicate (excluding self)
  const existing = await prisma.variationType.findFirst({
    where: { name: trimmed, NOT: { id } },
  });
  if (existing) return apiError(`Variation type "${trimmed}" already exists`, 409);

  const updated = await prisma.variationType.update({
    where: { id },
    data: { name: trimmed },
    include: { values: true },
  });

  return apiResponse(updated, 200, `Tipe variasi diperbarui menjadi "${trimmed}"`);
});

// DELETE /api/variations/types/[id] — validate not in use
export const DELETE = withErrorHandler(async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  await requireAdmin();
  const { id } = await params;

  // Check if any product uses this variation type
  const usageCount = await prisma.productVariationType.count({
    where: { variationTypeId: id },
  });

  if (usageCount > 0) {
    return apiError(
      `Tidak bisa dihapus: tipe variasi ini digunakan oleh ${usageCount} produk`,
      409
    );
  }

  await prisma.variationType.delete({ where: { id } });

  return apiResponse(null, 200, "Tipe variasi berhasil dihapus");
});
