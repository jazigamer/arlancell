import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";
import Toast from "./components/Toast.jsx";
import VideoWidget from "./components/VideoWidget.jsx";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import Checkout from "./pages/Checkout.jsx";
import Assistencia from "./pages/Assistencia.jsx"; // <-- IMPORTANDO A ASSISTÊNCIA
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminProductForm from "./pages/admin/AdminProductForm.jsx";
import AdminLeads from "./pages/admin/AdminLeads.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";

const PublicLayout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
    <WhatsAppFloat />
    <VideoWidget />
    <Toast />
  </>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/catalogo" element={<PublicLayout><Catalog /></PublicLayout>} />
      <Route path="/produto/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
      <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
      
      {/* ROTA DA ASSISTÊNCIA TÉCNICA */}
      <Route path="/assistencia" element={<PublicLayout><Assistencia /></PublicLayout>} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="produtos" element={<AdminProducts />} />
        <Route path="produtos/novo" element={<AdminProductForm />} />
        <Route path="produtos/editar/:id" element={<AdminProductForm />} />
        <Route path="pedidos" element={<AdminOrders />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="categorias" element={<AdminCategories />} />
        <Route path="config" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
}
