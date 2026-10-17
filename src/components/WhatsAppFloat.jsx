import { useCart } from "../context/CartContext.jsx";
export default function WhatsAppFloat() {
  const { settings } = useCart();
  return <a href={`https://wa.me/${settings.whatsapp}?text=Ol%C3%A1%20${encodeURIComponent(settings.nomeLoja)}!`} className="wa-float" target="_blank" rel="noreferrer">💬</a>;
}
