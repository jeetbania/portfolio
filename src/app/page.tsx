import Hero       from "@/components/Hero";
import WorkGrid   from "@/components/WorkGrid";
import Services   from "@/components/Services";
import Playground from "@/components/Playground";
import Footer     from "@/components/Footer";
import RoundedCap from "@/components/RoundedCap";

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkGrid />
      <Services />
      <Playground />

      {/* Rounded-corner "cap" — a small decorative sliver, not a wrapper
          around any interactive content. It sits on top of the footer's
          top edge (negative margin pulls it down) so the footer's black
          shows through the rounded corners. This achieves the reference's
          visual without putting overflow:hidden around every hover/Motion
          animation on the page, which was causing the flicker. */}
      <RoundedCap />

      <Footer />
    </main>
  );
}
