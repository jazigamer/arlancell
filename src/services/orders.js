import { supabase } from "./supabase.js";

const mapOrder = (o) => ({ ...o, createdAt: o.created_at });

// Chamado pelo cliente no checkout (usa a função create_order do banco)
export async function createOrder({ cliente, items, subtotal, discount, coupon, total }) {
  const { data, error } = await supabase.rpc("create_order", {
    p_cliente: cliente,
    p_items: items,
    p_subtotal: subtotal,
    p_discount: discount,
    p_coupon: coupon || "",
    p_total: total,
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return { id: row.order_id, numero: row.order_numero };
}

export async function listOrders() {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapOrder);
}

export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select();
  if (error) throw error;
  if (!data?.length) throw new Error("Nada foi alterado. Confira as permissões (admin) no Supabase.");
}

export async function removeOrder(id) {
  const { data, error } = await supabase.from("orders").delete().eq("id", id).select();
  if (error) throw error;
  if (!data?.length) throw new Error("Nada foi excluído. Confira as permissões (admin) no Supabase.");
}
