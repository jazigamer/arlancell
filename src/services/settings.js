import { supabase } from "./supabase.js";

export const defaultSettings = {
  nomeLoja: "Arlancell",
  whatsapp: "5585982163973",
  email: "contato@arlancell.com.br",
  cupons: { ARLAN10: 0.1, BEMVINDO15: 0.15 },
  freteGratisAcima: 299,
  instagram: "",
  endereco: "",
  horario: "",
  bannerTitle: "iPhone 15 Pro Max",
  bannerSubtitle: "Mais potência. Mais possibilidades.",
  bannerPrice: "R$ 6.999,00",
  bannerImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  videoTitulo: "Testando a nova Película 3D da Arlancell",
  videoSubtitulo: "Veja a resistência e o toque premium na prática.",
};

export async function fetchSettings() {
  const { data, error } = await supabase.from("settings").select("data").eq("id", 1).maybeSingle();
  if (error) {
    console.error("Erro ao buscar configurações:", error.message);
    return { ...defaultSettings };
  }
  return { ...defaultSettings, ...(data?.data || {}) };
}

export async function saveSettings(s) {
  const { senhaAdmin, ...clean } = s; // senha no site não existe mais (o login é pelo Supabase)
  const { data, error } = await supabase
    .from("settings")
    .upsert({ id: 1, data: clean, updated_at: new Date().toISOString() })
    .select();
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error("Nada foi salvo. Confira se o seu e-mail está na tabela admins do Supabase.");
  }
  return { ...defaultSettings, ...clean };
}
