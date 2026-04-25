import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiResponse, requireAuth, requireAdmin, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async (req: NextRequest) => {
  await requireAuth();
  
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: {
        include: {
          values: {
            include: {
              variationValue: {
                include: { variationType: true }
              }
            }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  });
  
  return apiResponse(products);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  await requireAdmin();
  
  const body = await req.json();
  const { name, categoryId, description, variationTypeIds } = body;
  
  if (!name || !categoryId) throw new Error("Name and categoryId are required");
  
  const product = await prisma.product.create({
    data: {
      name,
      categoryId,
      description,
      variationTypes: {
        create: (variationTypeIds || []).map((id: string, index: number) => ({
          variationTypeId: id,
          sortOrder: index + 1
        }))
      }
    },
    include: {
      variationTypes: true
    }
  });
  
  return apiResponse(product, 201);
});
