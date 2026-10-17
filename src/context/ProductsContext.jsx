import { createContext, useContext, useState, useEffect } from "react";
import { defaultProducts, defaultCategories } from "../data/products.js";
import { storage } from "../services/storage.js";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => storage.getProducts() || defaultProducts);
  const [categories, setCategories] = useState(() => storage.getCategories() || defaultCategories);

  useEffect(() => { storage.setProducts(products); }, [products]);
  useEffect(() => { storage.setCategories(categories); }, [categories]);

  function add(p) {
    const novo = { ...p, id: Date.now() };
    setProducts((prev) => [...prev, novo]);
    return novo;
  }
  function update(id, patch) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
  function remove(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }
  function removeMany(ids) {
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
  }

  function addCategory(c) {
    const novo = { ...c, id: c.id || c.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") };
    setCategories((prev) => [...prev, novo]);
  }
  function updateCategory(id, patch) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function removeCategory(id) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <ProductsContext.Provider value={{ products, add, update, remove, removeMany, categories, addCategory, updateCategory, removeCategory }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);
