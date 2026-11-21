import CheckoutForm from "./CheckoutForm";

export const metadata = { title: "Checkout" };

export default function Checkout() {
  // No login required – anyone can check out as a guest.
  return <CheckoutForm email="" name="" />;
}
