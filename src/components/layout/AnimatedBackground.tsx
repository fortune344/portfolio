/**
 * Fond « fumée » monochrome : nappes grises floutées qui dérivent lentement
 * sur fond noir, recouvertes d'un grain photographique.
 * 100 % CSS (transform uniquement) — aucun JavaScript, aucun re-render.
 * Sur mobile les nappes restent immobiles : le flou animé coûte cher en GPU.
 */
export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Nappes de fumée */}
      <div className="absolute -top-40 left-[5%] h-[36rem] w-[36rem] md:animate-drift rounded-full bg-[#3c3e46]/35 blur-[110px]" />
      <div className="absolute top-[15%] right-[-10%] h-[30rem] w-[30rem] md:animate-float-slower rounded-full bg-[#33353d]/40 blur-[100px]" />
      <div className="absolute top-[45%] left-[-8%] h-[28rem] w-[28rem] md:animate-float-slow rounded-full bg-[#2c2e36]/45 blur-[90px]" />
      <div className="absolute bottom-[-15%] left-[35%] h-[34rem] w-[34rem] md:animate-drift rounded-full bg-[#383a42]/35 blur-[110px]" />

      {/* Vignettage : assombrit les bords */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(6,6,8,0.7)_100%)]" />

      {/* Grain photographique */}
      <div className="grain absolute inset-0" />
    </div>
  );
}
