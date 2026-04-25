import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiResponse, requireAuth, requireAdmin, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await requireAuth();
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variationTypes: {
        include: { variationType: true },
        orderBy: { sortOrder: 'asc' }
      },
      variants: {
        include: {
          values: {
            include: {
              variationValue: true
            }
          }
        }
      }
    }
  });
  
  if (!product) throw new Error("Product not found");
  return apiResponse(product);
});

export const PUT = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json();
  const { name, categoryId, description } = body;
  
  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      categoryId,
      description
    }
  });
  
  return apiResponse(product);
});

export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await params;
  
  await prisma.product.delete({
    where: { id }
  });
  
  return apiResponse({ success: true });
});
