import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Toolkit } from "@/components/sections/Toolkit";
import { Credentials } from "@/components/sections/Credentials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/common/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Toolkit />
      <Credentials />
      <Contact />
      <Footer />
    </>
  );
}
