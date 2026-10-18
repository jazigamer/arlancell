import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase.js";
import { defaultCategories } from "../data/products.js";

const ProductsContext = createContext();

function slugify(t) {
  return (
    t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "categoria"
  );
}

function mapProduct(p) {
  return {
    ...p,
    oldPrice: p.old_price,
    freeShipping: p.free_shipping,
    priceGuarantee: p.price_guarantee,
    images: p.images?.length ? p.images : p.image ? [p.image] : [],
  };
}

function toPayload(p) {
  return {
    name: p.name,
    category: p.category,
    brand: p.brand,
    price: Number(p.price),
    old_price: p.oldPrice ? Number(p.oldPrice) : null,
    image: p.images[0],
    images: p.images,
    stock: Number(p.stock),
    free_shipping: !!p.freeShipping,
    featured: !!p.featured,
    price_guarantee: !!p.priceGuarantee,
    badge: p.badge || null,
    description: p.description,
    specs: p.specs,
  };
}

const MSG_PERMISSAO =
  "Nada foi alterado no banco.\n\nCausas comuns: o produto não existe no Supabase ou o seu e-mail não está na tabela admins (RLS).";

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function fetchProducts() {
    const { data, error } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (error) {
      console.error("Erro ao buscar produtos:", error.message);
      setLoadError("Não foi possível carregar os produtos: " + error.message);
      setProducts([]);
    } else {
      setLoadError("");
      setProducts((data || []).map(mapProduct));
    }
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories").select("*").order("created_at", { ascending: true }).order("id", { ascending: true });
    if (error) {
      console.error("Erro ao buscar categorias:", error.message);
      setCategories(defaultCategories);
    } else {
      setCategories(data || []);
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    })();
  }, []);

  // ---------- PRODUTOS ----------
  async function add(p) {
    const { data, error } = await supabase.from("products").insert([toPayload(p)]).select();
    if (error) { alert("Erro ao salvar no banco:\n" + error.message); return false; }
    if (!data?.length) { alert(MSG_PERMISSAO); return false; }
    await fetchProducts();
    return true;
  }

  async function update(id, patch) {
    const { data, error } = await supabase.from("products").update(toPayload(patch)).eq("id", id).select();
    if (error) { alert("Erro ao atualizar no banco:\n" + error.message); return false; }
    if (!data?.length) { alert(MSG_PERMISSAO); return false; }
    await fetchProducts();
    return true;
  }

  async function remove(id) {
    const { data, error } = await supabase.from("products").delete().eq("id", id).select();
    if (error) { alert("Erro ao excluir:\n" + error.message); return false; }
    if (!data?.length) { alert(MSG_PERMISSAO); return false; }
    await fetchProducts();
    return true;
  }

  async function removeMany(ids) {
    const { data, error } = await supabase.from("products").delete().in("id", ids).select();
    if (error) { alert("Erro ao excluir:\n" + error.message); return false; }
    if (!data?.length) { alert(MSG_PERMISSAO); return false; }
    await fetchProducts();
    return true;
  }

  // ---------- CATEGORIAS ----------
  async function addCategory({ label, icon }) {
    const nome = (label || "").trim();
    if (!nome) return false;
    const usados = new Set(categories.map((c) => c.id));
    const base = slugify(nome);
    let id = base, n = 2;
    while (usados.has(id)) id = `${base}-${n++}`;
    const { error } = await supabase.from("categories").insert([{ id, label: nome, icon: icon || "🏷️" }]);
    if (error) { alert("Erro ao criar categoria:\n" + error.message); return false; }
    await fetchCategories();
    return true;
  }

  async function updateCategory(id, patch) {
    const nome = (patch.label || "").trim();
    if (!nome) return false;
    const { data, error } = await supabase.from("categories").update({ label: nome }).eq("id", id).select();
    if (error) { alert("Erro ao atualizar categoria:\n" + error.message); return false; }
    if (!data?.length) { alert(MSG_PERMISSAO); return false; }
    await fetchCategories();
    return true;
  }

  async function removeCategory(id) {
    const emUso = products.filter((p) => p.category === id).length;
    if (emUso > 0) {
      alert(`Não dá para excluir: ${emUso} produto(s) usam esta categoria. Mude a categoria deles primeiro.`);
      return false;
    }
    const { data, error } = await supabase.from("categories").delete().eq("id", id).select();
    if (error) { alert("Erro ao excluir categoria:\n" + error.message); return false; }
    if (!data?.length) { alert(MSG_PERMISSAO); return false; }
    await fetchCategories();
    return true;
  }

  return (
    <ProductsContext.Provider
      value={{
        products, loading, loadError, categories,
        add, update, remove, removeMany,
        addCategory, updateCategory, removeCategory,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
export const useProducts = () => useContext(ProductsContext);
