import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase.js";
import { defaultProducts, defaultCategories } from "../data/products.js";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(true);

  // Buscar produtos do Supabase assim que o site abre
  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (error) {
      console.error("Erro ao buscar produtos:", error);
      setProducts(defaultProducts); // Se der erro, usa os de exemplo
    } else if (data.length === 0) {
      setProducts(defaultProducts); // Se o banco estiver vazio, usa os de exemplo
    } else {
      // Mapeando os dados do banco para o formato do site
      const formatted = data.map(p => ({
        ...p,
        oldPrice: p.old_price,
        freeShipping: p.free_shipping,
        priceGuarantee: p.price_guarantee,
        images: p.images || [p.image]
      }));
      setProducts(formatted);
    }
    setLoading(false);
  }

  useEffect(() => { fetchProducts(); }, []);

  // ADICIONAR PRODUTO NO SUPABASE
  async function add(p) {
    const payload = {
      name: p.name, category: p.category, brand: p.brand, price: Number(p.price),
      old_price: p.oldPrice ? Number(p.oldPrice) : null, image: p.images[0], images: p.images,
      stock: Number(p.stock), free_shipping: p.freeShipping, featured: p.featured,
      price_guarantee: p.priceGuarantee || false, badge: p.badge, description: p.description, specs: p.specs
    };
    const { data, error } = await supabase.from('products').insert([payload]).select();
    if (!error) {
      fetchProducts(); // Recarrega a lista
      return data[0];
    } else {
      alert("Erro ao salvar: " + error.message);
    }
  }

  // EDITAR PRODUTO NO SUPABASE
  async function update(id, patch) {
    const payload = {
      name: patch.name, category: patch.category, brand: patch.brand, price: Number(patch.price),
      old_price: patch.oldPrice ? Number(patch.oldPrice) : null, image: patch.images[0], images: patch.images,
      stock: Number(patch.stock), free_shipping: patch.freeShipping, featured: patch.featured,
      price_guarantee: patch.priceGuarantee || false, badge: patch.badge, description: patch.description, specs: patch.specs
    };
    const { error } = await supabase.from('products').update(payload).eq('id', id);
    if (!error) fetchProducts();
    else alert("Erro ao atualizar: " + error.message);
  }

  // DELETAR PRODUTO
  async function remove(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchProducts();
  }

  return (
    <ProductsContext.Provider value={{ products, loading, add, update, remove, categories }}>
      {children}
    </ProductsContext.Provider>
  );
}
export const useProducts = () => useContext(ProductsContext);
