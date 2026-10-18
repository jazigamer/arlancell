import { supabase } from "./supabase.js";

export const auth = {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  async logout() {
    await supabase.auth.signOut();
  },
  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
  // Confere no banco se o usuário logado está na tabela "admins"
  async isAdmin() {
    const { data, error } = await supabase.rpc("is_admin");
    if (error) {
      console.error("Erro ao verificar admin:", error.message);
      return false;
    }
    return data === true;
  },
};
