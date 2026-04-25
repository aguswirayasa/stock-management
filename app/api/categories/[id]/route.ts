import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiResponse, requireAuth, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await requireAuth();
  const { id } = await params;
  
  const category = await prisma.category.findUnique({
    where: { id }
  });
  
  if (!category) throw new Error("Category not found");
  return apiResponse(category);
});

export const PUT = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await requireAuth();
  const { id } = await params;
  const body = await req.json();
  const { name } = body;
  
  if (!name) throw new Error("Name is required");
  
  const category = await prisma.category.update({
    where: { id },
    data: { name }
  });
  
  return apiResponse(category);
});

export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await requireAuth();
  const { id } = await params;
  
  // Check if category is used
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
  
  if (category?._count.products && category._count.products > 0) {
    throw new Error("Cannot delete category that is used by products");
  }
  
  await prisma.category.delete({
    where: { id }
  });
  
  return apiResponse({ success: true });
});
