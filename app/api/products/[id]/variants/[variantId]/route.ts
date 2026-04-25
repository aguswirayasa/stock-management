import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiResponse, requireAdmin, withErrorHandler } from "@/lib/api-helpers";

export const PUT = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string, variantId: string }> }) => {
  await requireAdmin();
  const { variantId } = await params;
  
  const body = await req.json();
  const { price, stock, minStock, isActive } = body;
  
  const dataToUpdate: any = {};
  if (price !== undefined) dataToUpdate.price = price;
  if (stock !== undefined) dataToUpdate.stock = stock;
  if (minStock !== undefined) dataToUpdate.minStock = minStock;
  if (isActive !== undefined) dataToUpdate.isActive = isActive;
  
  const variant = await prisma.productVariant.update({
    where: { id: variantId },
    data: dataToUpdate
  });
  
  return apiResponse(variant);
});

export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string, variantId: string }> }) => {
  await requireAdmin();
  const { variantId } = await params;
  
  await prisma.productVariant.delete({
    where: { id: variantId }
  });
  
  return apiResponse({ success: true });
});
