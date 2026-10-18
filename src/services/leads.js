import { supabase } from "./supabase.js";

const mapLead = (l) => ({ ...l, createdAt: l.created_at });

// Use esta função em qualquer formulário de newsletter do site
export async function addLead({ nome = "", email = "", telefone = "", origem = "newsletter" }) {
  const { error } = await supabase.from("leads").insert([{ nome, email, telefone, origem }]);
  if (error) throw error;
}

export async function listLeads() {
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapLead);
}

export async function removeLead(id) {
  const { data, error } = await supabase.from("leads").delete().eq("id", id).select();
  if (error) throw error;
  if (!data?.length) throw new Error("Nada foi excluído. Confira as permissões (admin) no Supabase.");
}

export async function clearLeads() {
  const { error } = await supabase.from("leads").delete().not("id", "is", null);
  if (error) throw error;
}
