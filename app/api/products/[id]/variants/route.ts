import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiResponse, requireAdmin, withErrorHandler } from "@/lib/api-helpers";
import { cartesianProduct, generateSkuString } from "@/lib/sku-generator";

export const POST = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id: productId } = await params;
  
  const body = await req.json();
  const { combinations, defaultPrice } = body;
  
  if (!combinations || typeof combinations !== 'object') {
    throw new Error("Invalid combinations format");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });
  if (!product) throw new Error("Product not found");

  const allValueIds = Object.values(combinations).flat() as string[];
  const valuesData = await prisma.variationValue.findMany({
    where: { id: { in: allValueIds } }
  });
  const valueMap = new Map(valuesData.map(v => [v.id, v.value]));

  const cartesian = cartesianProduct(combinations as Record<string, string[]>);
  
  const createdVariants = [];
  
  for (let i = 0; i < cartesian.length; i++) {
    const combo = cartesian[i];
    const valueIds = Object.values(combo);
    const valueNames = valueIds.map(id => valueMap.get(id) || "");
    
    let sku = generateSkuString(product.name, valueNames);
    
    // Ensure uniqueness manually or append index if it already exists
    const existing = await prisma.productVariant.findUnique({ where: { sku } });
    if (existing) {
      sku = `${sku}-${Math.floor(Math.random() * 1000)}`;
    }
    
    const variant = await prisma.productVariant.create({
      data: {
        productId,
        sku,
        price: defaultPrice || 0,
        values: {
          create: valueIds.map(valId => ({
            variationValueId: valId
          }))
        }
      }
    });
    createdVariants.push(variant);
  }

  return apiResponse(createdVariants, 201);
});
