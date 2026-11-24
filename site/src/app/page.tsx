import { MotionProvider } from "@/components/motion/MotionProvider";
import { CartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartFab } from "@/components/cart/CartFab";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Story } from "@/components/Story";
import { Menu } from "@/components/Menu";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { Visit } from "@/components/Visit";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <MotionProvider>
      <CartProvider>
        <Nav />
        <main id="conteudo">
          <Hero />
          <Story />
          <Menu />
          <Gallery />
          <Testimonials />
          <Visit />
        </main>
        <Footer />
        <CartDrawer />
        <CartFab />
      </CartProvider>
    </MotionProvider>
  );
}
