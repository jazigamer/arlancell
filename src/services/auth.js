const KEY = "arlancell_admin_auth";
import { storage } from "./storage.js";

export const auth = {
  isLogged() { return sessionStorage.getItem(KEY) === "1"; },
  login(password) {
    const { senhaAdmin } = storage.getSettings();
    if (password === senhaAdmin) { sessionStorage.setItem(KEY, "1"); return true; }
    return false;
  },
  logout() { sessionStorage.removeItem(KEY); },
};
