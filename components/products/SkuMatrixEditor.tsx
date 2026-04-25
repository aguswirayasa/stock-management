"use client";

import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";

export function SkuMatrixEditor({ product }: { product: any }) {
  const [variants, setVariants] = useState(product.variants);
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdate = async (variantId: string, field: string, value: any) => {
    // Optimistic update
    setVariants((prev: any) => prev.map((v: any) => v.id === variantId ? { ...v, [field]: value } : v));
    
    setLoading(variantId);
    try {
      const res = await fetch(`/api/products/${product.id}/variants/${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch (err) {
      console.error(err);
      alert("Error saving " + field);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[8px] overflow-hidden">
      <div className="p-4 bg-[#eceae3]/50 border-b border-[#c5c0b1] flex justify-between items-center">
        <h2 className="text-[18px] font-semibold text-[#201515]">SKU Matrix</h2>
        <span className="text-[14px] text-[#939084] font-medium">{variants.length} Variants</span>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#c5c0b1]">
              <th className="p-4 font-semibold text-[#201515]">SKU / Variation</th>
              <th className="p-4 font-semibold text-[#201515]">Price (Rp)</th>
              <th className="p-4 font-semibold text-[#201515]">Stock</th>
              <th className="p-4 font-semibold text-[#201515]">Min. Stock</th>
              <th className="p-4 font-semibold text-[#201515] text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant: any) => {
              const variationTags = variant.values.map((v: any) => v.variationValue.value).join(' • ');
              const isLowStock = variant.stock <= variant.minStock;
              
              return (
                <tr key={variant.id} className={`border-b border-[#c5c0b1] last:border-0 hover:bg-[#eceae3]/20 ${!variant.isActive ? 'opacity-50 bg-[#eceae3]/50' : ''}`}>
                  <td className="p-4">
                    <div className="font-bold text-[#201515]">{variant.sku}</div>
                    <div className="text-[13px] text-[#939084] mt-0.5">{variationTags}</div>
                  </td>
                  <td className="p-4">
                    <input 
                      type="number"
                      value={variant.price}
                      onChange={e => handleUpdate(variant.id, 'price', parseInt(e.target.value) || 0)}
                      className="w-[120px] border border-[#c5c0b1] rounded-[4px] px-2 py-1.5 text-[14px] bg-[#fffefb] focus:border-[#ff4f00] focus:outline-none"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        value={variant.stock}
                        onChange={e => handleUpdate(variant.id, 'stock', parseInt(e.target.value) || 0)}
                        className={`w-[80px] border ${isLowStock ? 'border-[#ff4f00] text-[#ff4f00] font-bold bg-[#ff4f00]/5' : 'border-[#c5c0b1]'} rounded-[4px] px-2 py-1.5 text-[14px] focus:outline-none bg-[#fffefb]`}
                      />
                      {isLowStock && <AlertCircle className="w-4 h-4 text-[#ff4f00]" />}
                    </div>
                  </td>
                  <td className="p-4">
                    <input 
                      type="number"
                      value={variant.minStock}
                      onChange={e => handleUpdate(variant.id, 'minStock', parseInt(e.target.value) || 0)}
                      className="w-[80px] border border-[#c5c0b1] rounded-[4px] px-2 py-1.5 text-[14px] bg-[#fffefb] focus:border-[#ff4f00] focus:outline-none"
                    />
                  </td>
                  <td className="p-4 flex justify-center">
                    <label className="flex items-center cursor-pointer mt-1">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={variant.isActive}
                          onChange={e => handleUpdate(variant.id, 'isActive', e.target.checked)}
                        />
                        <div className={`block w-10 h-6 rounded-[20px] transition-colors ${variant.isActive ? 'bg-[#ff4f00]' : 'bg-[#c5c0b1]'}`}></div>
                        <div className={`absolute left-1 top-1 bg-[#fffefb] w-4 h-4 rounded-full transition-transform ${variant.isActive ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                    </label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {variants.map((variant: any) => {
           const variationTags = variant.values.map((v: any) => v.variationValue.value).join(' • ');
           const isLowStock = variant.stock <= variant.minStock;
           
           return (
             <div key={variant.id} className={`p-4 border-b border-[#c5c0b1] last:border-0 ${!variant.isActive ? 'opacity-50 bg-[#eceae3]/50' : ''}`}>
               <div className="flex justify-between items-start mb-3">
                 <div>
                   <div className="font-bold text-[#201515] text-[16px]">{variant.sku}</div>
                   <div className="text-[13px] text-[#939084]">{variationTags}</div>
                 </div>
                 <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={variant.isActive}
                        onChange={e => handleUpdate(variant.id, 'isActive', e.target.checked)}
                      />
                      <div className={`block w-10 h-6 rounded-[20px] transition-colors ${variant.isActive ? 'bg-[#ff4f00]' : 'bg-[#c5c0b1]'}`}></div>
                      <div className={`absolute left-1 top-1 bg-[#fffefb] w-4 h-4 rounded-full transition-transform ${variant.isActive ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[12px] font-semibold text-[#939084] uppercase tracking-wider mb-1">Price</label>
                   <input 
                      type="number"
                      value={variant.price}
                      onChange={e => handleUpdate(variant.id, 'price', parseInt(e.target.value) || 0)}
                      className="w-full border border-[#c5c0b1] rounded-[4px] px-2 py-1.5 text-[14px] bg-[#fffefb] focus:border-[#ff4f00] focus:outline-none"
                    />
                 </div>
                 <div>
                   <label className="block text-[12px] font-semibold text-[#939084] uppercase tracking-wider mb-1">Stock</label>
                   <div className="flex items-center gap-2">
                    <input 
                        type="number"
                        value={variant.stock}
                        onChange={e => handleUpdate(variant.id, 'stock', parseInt(e.target.value) || 0)}
                        className={`w-full border ${isLowStock ? 'border-[#ff4f00] text-[#ff4f00] font-bold bg-[#ff4f00]/5' : 'border-[#c5c0b1]'} rounded-[4px] px-2 py-1.5 text-[14px] bg-[#fffefb] focus:outline-none`}
                      />
                      {isLowStock && <AlertCircle className="w-5 h-5 text-[#ff4f00] shrink-0" />}
                   </div>
                 </div>
                 <div>
                   <label className="block text-[12px] font-semibold text-[#939084] uppercase tracking-wider mb-1">Min Stock</label>
                   <input 
                      type="number"
                      value={variant.minStock}
                      onChange={e => handleUpdate(variant.id, 'minStock', parseInt(e.target.value) || 0)}
                      className="w-full border border-[#c5c0b1] rounded-[4px] px-2 py-1.5 text-[14px] bg-[#fffefb] focus:border-[#ff4f00] focus:outline-none"
                    />
                 </div>
               </div>
             </div>
           );
        })}
      </div>
    </div>
  );
}
