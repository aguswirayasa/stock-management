import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiResponse, requireAuth, withErrorHandler } from "@/lib/api-helpers";

export const GET = withErrorHandler(async (req: NextRequest) => {
  await requireAuth();
  
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
  
  return apiResponse(categories);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  await requireAuth(); 
  
  const body = await req.json();
  const { name } = body;
  
  if (!name) throw new Error("Name is required");
  
  const category = await prisma.category.create({
    data: { name }
  });
  
  return apiResponse(category, 201);
});
