import Link from "next/link";
import { Edit2, AlertCircle } from "lucide-react";

export function ProductCard({ product }: { product: any }) {
  const totalVariants = product.variants.length;
  const totalStock = product.variants.reduce((acc: number, v: any) => acc + v.stock, 0);
  const hasLowStock = product.variants.some((v: any) => v.stock <= v.minStock);

  return (
    <div className="border border-[#c5c0b1] rounded-[8px] bg-[#fffefb] p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-[18px] font-semibold text-[#201515] leading-tight mb-1">{product.name}</h3>
          <p className="text-[14px] text-[#939084]">{product.category.name} • {totalVariants} SKUs</p>
        </div>
        {hasLowStock && (
          <span className="shrink-0 text-[#ff4f00] bg-[#ff4f00]/10 p-1.5 rounded-full">
            <AlertCircle className="w-5 h-5" />
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between border-t border-[#eceae3] pt-3 mt-1">
        <div className="text-[14px]">
          <span className="text-[#939084]">Total Stock:</span>{" "}
          <span className="font-bold text-[#201515]">{totalStock}</span>
        </div>
        <Link href={`/products/${product.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#c5c0b1] rounded-[4px] text-[14px] font-semibold text-[#201515] hover:bg-[#eceae3] transition-colors">
          <Edit2 className="w-4 h-4" /> Edit
        </Link>
      </div>
    </div>
  );
}
