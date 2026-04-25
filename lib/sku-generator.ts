export function generateSkuString(productName: string, variationValues: string[]): string {
  const abbreviate = (str: string) => {
    // Remove vowels and special characters, uppercase
    const noVowels = str.replace(/[AEIOUaeiou\s-]/g, '').toUpperCase();
    if (noVowels.length >= 3) return noVowels.substring(0, 3);
    
    // Fallback if very short: just uppercase and remove spaces
    return str.replace(/[\s-]/g, '').substring(0, 3).toUpperCase();
  };

  const prodAbbr = abbreviate(productName);
  const valAbbrs = variationValues.map(abbreviate);
  
  return [prodAbbr, ...valAbbrs].join('-');
}

/**
 * Generate cartesian product of an object of arrays
 * e.g., { "typeId_ukuran": ["valueId_besar", "valueId_kecil"], "typeId_warna": ["valueId_merah", "valueId_biru"] }
 * => [ 
 *      { typeId_ukuran: "valueId_besar", typeId_warna: "valueId_merah" }, 
 *      { typeId_ukuran: "valueId_besar", typeId_warna: "valueId_biru" }, ... 
 *    ]
 */
export function cartesianProduct<T>(options: Record<string, T[]>): Record<string, T>[] {
  const keys = Object.keys(options);
  if (keys.length === 0) return [];
  
  const result: Record<string, T>[] = [];
  
  const helper = (keyIndex: number, current: Record<string, T>) => {
    if (keyIndex === keys.length) {
      result.push({ ...current });
      return;
    }
    
    const key = keys[keyIndex];
    const values = options[key];
    
    if (!values || values.length === 0) {
      helper(keyIndex + 1, current);
      return;
    }
    
    for (const val of values) {
      current[key] = val;
      helper(keyIndex + 1, current);
    }
  };
  
  helper(0, {});
  return result;
}
