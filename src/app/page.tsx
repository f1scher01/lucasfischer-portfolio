import { Hero } from "@/components/hero/Hero";
import { Marquee } from "@/components/common/Marquee";
import { Physics } from "@/components/sections/Physics";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Disciplines } from "@/components/sections/Disciplines";
import { Dyno } from "@/components/sections/Dyno";
import { Toolkit } from "@/components/sections/Toolkit";
import { Credentials } from "@/components/sections/Credentials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/common/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Physics />
      <About />
      <Work />
      <Disciplines />
      <Dyno />
      <Toolkit />
      <Credentials />
      <Contact />
      <Footer />
    </>
  );
}
