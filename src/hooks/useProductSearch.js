import { useState, useEffect } from "react";
import Fuse from "fuse.js";

const useProductSearch = (products, searchTerm) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const fuse = new Fuse(products, {
      keys: ["nombre", "descripcion", "categoria", "marca"],
      includeScore: true,
      threshold: 0.3,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
    const results = fuse.search(searchTerm);
    setFilteredProducts(results.map((r) => r.item));
  }, [products, searchTerm]);

  return { filteredProducts, isSearching };
};

export default useProductSearch;
