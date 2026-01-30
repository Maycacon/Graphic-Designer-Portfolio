import React from "react";

export function FooterSection() {
  return (
    <section className="py-0 px-6" style={{ backgroundColor: '#2d085e' }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-white/70 text-sm">
          © {new Date().getFullYear()} Maycaco. Todos os direitos reservados.
        </p>
      </div>
    </section>
  );
}

export default FooterSection;
