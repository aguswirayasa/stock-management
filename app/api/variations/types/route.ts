import prisma from "@/lib/prisma";
import { apiResponse, apiError, withErrorHandler, requireAdmin } from "@/lib/api-helpers";

// GET /api/variations/types — list all variation types with value count
export const GET = withErrorHandler(async () => {
  const types = await prisma.variationType.findMany({
    include: {
      _count: { select: { values: true, productVariationTypes: true } },
      values: { orderBy: { value: "asc" } },
    },
    orderBy: { name: "asc" },
  });

  return apiResponse(types);
});

// POST /api/variations/types — create a new VariationType
export const POST = withErrorHandler(async (req: Request) => {
  await requireAdmin();

  const body = await req.json();
  const { name } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return apiError("Name is required", 400);
  }

  const trimmed = name.trim();

  // Check duplicate
  const existing = await prisma.variationType.findUnique({ where: { name: trimmed } });
  if (existing) {
    return apiError(`Variation type "${trimmed}" already exists`, 409);
  }

  const variationType = await prisma.variationType.create({
    data: { name: trimmed },
    include: { _count: { select: { values: true } } },
  });

  return apiResponse(variationType, 201, `Tipe variasi "${trimmed}" berhasil dibuat`);
});
