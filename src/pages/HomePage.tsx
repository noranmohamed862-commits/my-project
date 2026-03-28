import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { type User } from "../types";
import { useTheme } from "../context/ThemeContext";
import { useStore, type Product, type Order } from "../context/StoreContext";

interface Props { user: User; onLogout: () => void; }


function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return vis;
}

function SectionTitle({ label, title, light = false }: { label: string; title: string; light?: boolean }) {
  const { c } = useTheme();
  return (
    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "0.8rem" }}>
        <div style={{ width: 36, height: 1, background: "#c9a84c", opacity: 0.5 }} />
        <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.57rem", letterSpacing: "0.4em", color: "#c9a84c", textTransform: "uppercase" as const }}>{label}</span>
        <div style={{ width: 36, height: 1, background: "#c9a84c", opacity: 0.5 }} />
      </div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: "clamp(1.9rem,3.8vw,3rem)", letterSpacing: "0.08em", color: light ? c.text : "#c9a84c", transition: "color 0.4s" }}>{title}</h2>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 0" }}>
      <div style={{ display: "inline-block", width: 36, height: 36, border: "2px solid rgba(201,168,76,0.2)", borderTop: "2px solid #c9a84c", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", color: "#c9a84c", letterSpacing: "0.3em", marginTop: "1rem" }}>LOADING...</p>
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  const { c } = useTheme();
  return (
    <div style={{ textAlign: "center", padding: "3rem 0" }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", color: "#c0392b", marginBottom: "0.5rem" }}>Could not load products</p>
      <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.68rem", color: c.textMuted }}>{msg}</p>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  const { c } = useTheme();
  return (
    <div style={{ textAlign: "center", padding: "4rem 0" }}>
      <div style={{ fontSize: "2.5rem", color: "rgba(201,168,76,0.25)", marginBottom: "1rem" }}>{icon}</div>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 300, color: c.textMuted }}>{text}</p>
    </div>
  );
}

function GoldOutlineBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const { c } = useTheme();
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onClick}
      style={{ padding: "0.6rem 1.4rem", background: "transparent", border: `1px solid ${h ? "#c9a84c" : c.border}`, color: h ? "#c9a84c" : c.textMuted, fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: "1px", transition: "all 0.25s" }}>
      {children}
    </button>
  );
}

function ToggleSwitch({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div onClick={() => setOn(!on)} style={{ width: 40, height: 22, borderRadius: 11, background: on ? "linear-gradient(135deg,#8b6914,#c9a84c)" : "rgba(106,98,88,0.3)", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 21 : 3, transition: "left 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
    </div>
  );
}


const HERO_IMGS = [
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=85",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=85",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=85",
];
const SLOGANS = [
  { top: "Define Your",     bottom: "Elegance"      },
  { top: "Wear Your",       bottom: "Story"         },
  { top: "Curated for the", bottom: "Extraordinary" },
];

function HeroSection({ onShopNow }: { onShopNow: () => void }) {
  const [idx, setIdx]       = useState(0);
  const [fading, setFading] = useState(false);
  const [textIn, setTextIn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setFading(true); setTextIn(false);
      setTimeout(() => { setIdx((i) => (i + 1) % HERO_IMGS.length); setFading(false); setTimeout(() => setTextIn(true), 100); }, 800);
    }, 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden", background: "#0a0a0f" }}>
      {HERO_IMGS.map((src, i) => (
        <img key={i} src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: i === idx ? (fading ? 0 : 1) : 0, transition: "opacity 0.8s ease", filter: "brightness(0.38) saturate(0.7)" }} />
      ))}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(10,10,15,0.88) 38%,transparent)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 180, background: "linear-gradient(to top,#0a0a0f,transparent)" }} />
      <div style={{ position: "absolute", left: "6%", top: "50%", transform: "translateY(-52%)", maxWidth: 580, opacity: textIn ? 1 : 0, transition: "opacity 0.6s ease" }}>
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.57rem", letterSpacing: "0.5em", color: "#c9a84c", textTransform: "uppercase", marginBottom: "1.5rem" }}>New Collection 2025</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, lineHeight: 1.04, color: "#f0ece0" }}>
          <span style={{ display: "block", fontSize: "clamp(2.8rem,5.5vw,5.2rem)", letterSpacing: "0.04em" }}>{SLOGANS[idx].top}</span>
          <span style={{ display: "block", fontSize: "clamp(3.2rem,7.5vw,6.8rem)", letterSpacing: "0.06em", color: "#c9a84c", textShadow: "0 0 60px rgba(201,168,76,0.22)" }}>{SLOGANS[idx].bottom}</span>
        </h1>
        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 200, fontSize: "0.77rem", letterSpacing: "0.1em", color: "rgba(240,236,224,0.5)", marginTop: "1.4rem", lineHeight: 1.9, maxWidth: 360 }}>
          Discover pieces that transcend trends — crafted for those who understand that true luxury is timeless.
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "2.4rem", flexWrap: "wrap" }}>
          <HBtn primary onClick={onShopNow}>Shop Now</HBtn>
          <HBtn onClick={() => {}}>Explore Collections</HBtn>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 36, left: "6%", display: "flex", gap: 8 }}>
        {HERO_IMGS.map((_, i) => <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 28 : 8, height: 2, background: i === idx ? "#c9a84c" : "rgba(201,168,76,0.28)", border: "none", cursor: "pointer", transition: "all 0.4s", padding: 0 }} />)}
      </div>
    </div>
  );
}

function HBtn({ children, primary, onClick }: { children: React.ReactNode; primary?: boolean; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onClick}
      style={{ padding: "0.85rem 2.2rem", background: primary ? (h ? "linear-gradient(135deg,#e8d5a3,#c9a84c)" : "linear-gradient(135deg,#8b6914,#c9a84c)") : "transparent", border: primary ? "none" : `1px solid ${h ? "#c9a84c" : "rgba(201,168,76,0.38)"}`, color: primary ? "#0a0a0f" : (h ? "#c9a84c" : "rgba(240,236,224,0.65)"), fontFamily: "'Montserrat',sans-serif", fontSize: "0.63rem", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase" as const, cursor: "pointer", transition: "all 0.3s", borderRadius: "1px", transform: h ? "translateY(-2px)" : "translateY(0)", boxShadow: h && primary ? "0 10px 40px rgba(201,168,76,0.35)" : "none" }}>
      {children}
    </button>
  );
}


const CATS = [
  { label: "Women",       img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80", api: "women's clothing" },
  { label: "Men",         img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", api: "men's clothing"   },
  { label: "Jewelry",     img: "https://images.unsplash.com/photo-1600950207944-0d63e8edbc3f?w=600&q=80", api: "jewelery"         },
  { label: "Electronics", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", api: "electronics"      },
  { label: "Bags",        img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",    api: ""                 },
  { label: "Shoes",       img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",    api: ""                 },
];

function CategoriesSection({ onCategoryClick }: { onCategoryClick: (cat: string) => void }) {
  const { c, isDark } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const vis = useInView(ref);
  return (
    <section style={{ background: isDark ? "#0e0c18" : "#ede8dc", padding: "5rem 2.5rem", transition: "background 0.4s" }}>
      <SectionTitle label="Shop by Category" title="Explore Our World" light />
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "1rem", maxWidth: 1100, margin: "0 auto" }}>
        {CATS.map((cat, i) => (
          <div key={cat.label} onClick={() => onCategoryClick(cat.api || cat.label)}
            style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", cursor: "pointer", borderRadius: "2px", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)", transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s` }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; (e.currentTarget.querySelector("img") as HTMLImageElement).style.transform = "scale(1.07)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget.querySelector("img") as HTMLImageElement).style.transform = "scale(1)"; }}
          >
            <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease", filter: "brightness(0.5) saturate(0.8)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,10,15,0.9) 0%,transparent 55%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.1rem 1rem" }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.25rem", fontWeight: 300, color: "#f0ece0", letterSpacing: "0.06em" }}>{cat.label}</p>
              <div style={{ width: 28, height: 1, background: "#c9a84c", marginTop: 5, opacity: 0.7 }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


function ProductCard({ p, delay, onOpen }: { p: Product; delay: number; onOpen: (p: Product) => void }) {
  const { c, isDark } = useTheme();
  const { wishlist, toggleWish, addToCart } = useStore();
  const [hov, setHov] = useState(false);
  const wished = wishlist.includes(p.id);
  const ref = useRef<HTMLDivElement>(null);
  const vis = useInView(ref);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(50px)", transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ background: c.card, border: `1px solid ${hov ? c.borderHover : c.border}`, borderRadius: "2px", overflow: "hidden", cursor: "pointer", transition: "all 0.35s ease", transform: hov ? "translateY(-6px)" : "translateY(0)", boxShadow: hov ? `0 20px 60px rgba(0,0,0,${isDark ? 0.5 : 0.15})` : "none" }}>
        <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", background: isDark ? "#13111f" : "#f0ebe0" }} onClick={() => onOpen(p)}>
          <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "1rem", transition: "transform 0.6s ease", transform: hov ? "scale(1.08)" : "scale(1)" }} />
          <button onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
            style={{ position: "absolute", top: 8, right: 8, background: isDark ? "rgba(8,7,14,0.75)" : "rgba(245,240,232,0.85)", border: `1px solid ${wished ? "#c9a84c" : c.border}`, borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s", opacity: hov ? 1 : 0.6, color: wished ? "#c9a84c" : c.textMuted }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.7rem", background: `linear-gradient(to top,${isDark ? "rgba(8,7,14,0.95)" : "rgba(245,240,232,0.95)"},transparent)`, opacity: hov ? 1 : 0, transform: hov ? "translateY(0)" : "translateY(8px)", transition: "all 0.3s ease" }}>
            <button onClick={(e) => { e.stopPropagation(); addToCart(p); }}
              style={{ width: "100%", padding: "0.55rem", background: "rgba(201,168,76,0.14)", border: "1px solid rgba(201,168,76,0.4)", color: "#c9a84c", fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: "1px" }}>
              Add to Cart
            </button>
          </div>
        </div>
        <div style={{ padding: "0.9rem 1rem 1.1rem" }} onClick={() => onOpen(p)}>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", color: c.textMuted, textTransform: "capitalize", marginBottom: "0.3rem", letterSpacing: "0.06em" }}>{p.category}</p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", fontWeight: 300, color: c.text, marginBottom: "0.4rem", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.title}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.85rem", color: "#c9a84c" }}>${p.price.toFixed(2)}</span>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", color: c.textMuted }}>★ {p.rating.rate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


function CategoryPage({ onOpen, onBack }: { onOpen: (p: Product) => void; onBack: () => void }) {
  const { c } = useTheme();
  const { categoryProducts, activeCategory, loading } = useStore();
  const catLabel = CATS.find((x) => x.api === activeCategory)?.label || activeCategory;
  const catImg = CATS.find((x) => x.api === activeCategory)?.img || "";
  const [vis, setVis] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 50); }, []);
  return (
    <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)", paddingTop: 64 }}>
      <div style={{ padding: "0.9rem 2rem", borderBottom: `1px solid ${c.border}`, background: c.navBg, backdropFilter: "blur(16px)", display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={onBack} onMouseEnter={() => setBtnHov(true)} onMouseLeave={() => setBtnHov(false)}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={btnHov ? "#c9a84c" : c.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: btnHov ? "#c9a84c" : c.textMuted, transition: "color 0.2s" }}>Home</span>
        </button>
        <div style={{ width: 1, height: 14, background: c.border }} />
        <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#c9a84c" }}>{catLabel}</span>
        <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem", color: c.textMuted, marginLeft: "auto" }}>{categoryProducts.length} products</span>
      </div>
      <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
        {catImg && <img src={catImg} alt={catLabel} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.35) saturate(0.7)" }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,#0a0a0f 0%,transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.8rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: 40, height: 1, background: "rgba(201,168,76,0.5)" }} />
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem", letterSpacing: "0.4em", color: "#c9a84c", textTransform: "uppercase" as const }}>Collection</span>
            <div style={{ width: 40, height: 1, background: "rgba(201,168,76,0.5)" }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: "clamp(2.5rem,6vw,4.5rem)", color: "#f0ece0", letterSpacing: "0.12em" }}>{catLabel}</h1>
        </div>
      </div>
      <section style={{ background: c.bg, padding: "3rem 2.5rem", transition: "background 0.4s" }}>
        {loading ? <Spinner /> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1.4rem", maxWidth: 1100, margin: "0 auto" }}>
            {categoryProducts.map((p, i) => <ProductCard key={p.id} p={p} delay={i * 0.05} onOpen={onOpen} />)}
          </div>
        )}
      </section>
    </div>
  );
}


function FeaturedSection({ onOpen }: { onOpen: (p: Product) => void }) {
  const { c } = useTheme();
  const { products, loading, error, visibleCount, loadMore, hasMore } = useStore();
  const visible = products.slice(0, visibleCount);
  return (
    <section style={{ background: c.bg, padding: "5rem 2.5rem", transition: "background 0.4s" }}>
      <SectionTitle label="Handpicked for You" title="Featured Products" light />
      {loading && <Spinner />}
      {error && <ErrorMsg msg={error} />}
      {!loading && !error && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1.4rem", maxWidth: 1100, margin: "0 auto" }}>
            {visible.map((p, i) => <ProductCard key={p.id} p={p} delay={i * 0.04} onOpen={onOpen} />)}
          </div>
          {hasMore && <div style={{ textAlign: "center", marginTop: "2.5rem" }}><GoldOutlineBtn onClick={loadMore}>See More Products</GoldOutlineBtn></div>}
          {!hasMore && products.length > 0 && <p style={{ textAlign: "center", marginTop: "2rem", fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", color: c.textMuted, letterSpacing: "0.2em" }}>✦ All products loaded</p>}
        </>
      )}
    </section>
  );
}


const OFFER_CATS = [
  { title: "Summer Edit",  sub: "Up to 40% off",               img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80", badge: "40% OFF", cat: "women's clothing" },
  { title: "New Arrivals", sub: "Fresh drops every week",      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",   badge: "NEW",     cat: "men's clothing"   },
  { title: "Members Only", sub: "Exclusive pieces for members",img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80", badge: "VIP",     cat: "jewelery"         },
];

function OffersSection({ onCategoryClick }: { onOpen: (p: Product) => void; onCategoryClick: (cat: string) => void }) {
  const { isDark } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const vis = useInView(ref);
  return (
    <section style={{ background: isDark ? "#0d0b1a" : "#e4ddd0", padding: "5rem 2.5rem", transition: "background 0.4s" }}>
      <SectionTitle label="Limited Time" title="Special Offers" light />
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
        {OFFER_CATS.map((o, i) => (
          <div key={o.title} style={{ position: "relative", height: 400, overflow: "hidden", cursor: "pointer", borderRadius: "2px", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(50px)", transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s` }}
            onMouseEnter={(e) => { (e.currentTarget.querySelector("img") as HTMLImageElement).style.transform = "scale(1.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget.querySelector("img") as HTMLImageElement).style.transform = "scale(1)"; }}
          >
            <img src={o.img} alt={o.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease", filter: "brightness(0.42) saturate(0.7)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,10,15,0.92) 0%,rgba(10,10,15,0.15) 60%)" }} />
            <div style={{ position: "absolute", top: 18, right: 18, padding: "5px 14px", background: "rgba(201,168,76,0.9)", color: "#0a0a0f", fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.2em", borderRadius: "1px" }}>{o.badge}</div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.8rem" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.75rem", fontWeight: 300, color: "#f0ece0", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>{o.title}</h3>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.66rem", color: "rgba(240,236,224,0.5)", letterSpacing: "0.08em", marginBottom: "1.2rem" }}>{o.sub}</p>
              <button onClick={() => onCategoryClick(o.cat)}
                style={{ padding: "0.6rem 1.6rem", background: "transparent", border: "1px solid rgba(201,168,76,0.45)", color: "#c9a84c", fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: "1px" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(201,168,76,0.14)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; }}
              >Shop Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


function NewsletterSection() {
  const { c, isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const vis = useInView(ref);
  return (
    <section style={{ background: isDark ? "#080710" : "#ede8dc", padding: "6rem 2.5rem", transition: "background 0.4s" }}>
      <div ref={ref} style={{ maxWidth: 540, margin: "0 auto", textAlign: "center", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom,transparent,rgba(201,168,76,0.45))", margin: "0 auto 2rem" }} />
        <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.57rem", letterSpacing: "0.45em", color: "#c9a84c", textTransform: "uppercase" as const, marginBottom: "1rem" }}>Stay in the Know</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 300, color: c.text, letterSpacing: "0.06em", marginBottom: "0.8rem", transition: "color 0.4s" }}>Join the NEWRAN Circle</h2>
        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 200, fontSize: "0.73rem", color: c.textMuted, letterSpacing: "0.06em", lineHeight: 1.9, marginBottom: "2.5rem" }}>
          Be first to know about new arrivals,<br />exclusive offers, and members-only events.
        </p>
        {done ? (
          <div style={{ padding: "1.1rem 2rem", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "2px", color: "#c9a84c", fontFamily: "'Montserrat',sans-serif", fontSize: "0.7rem", letterSpacing: "0.15em" }}>✦ Welcome to the NEWRAN Circle</div>
        ) : (
          <div style={{ display: "flex", gap: "0.8rem", maxWidth: 400, margin: "0 auto" }}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address"
              style={{ flex: 1, background: c.inputBg, border: `1px solid ${c.border}`, borderRadius: "1px", padding: "0.82rem 1rem", color: c.text, fontFamily: "'Montserrat',sans-serif", fontSize: "0.76rem", fontWeight: 300, outline: "none", transition: "border-color 0.3s" }}
              onFocus={(e) => { e.target.style.borderColor = c.borderHover; }}
              onBlur={(e) => { e.target.style.borderColor = c.border; }}
            />
            <button onClick={() => { if (email.includes("@")) setDone(true); }}
              style={{ padding: "0.82rem 1.5rem", background: "linear-gradient(135deg,#8b6914,#c9a84c)", border: "none", color: "#0a0a0f", fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: "1px", flexShrink: 0 }}>
              Subscribe
            </button>
          </div>
        )}
        <div style={{ width: 1, height: 48, background: "linear-gradient(to top,transparent,rgba(201,168,76,0.3))", margin: "2rem auto 0" }} />
      </div>
    </section>
  );
}


function Footer() {
  const { c, isDark } = useTheme();
  return (
    <footer style={{ background: isDark ? "#060509" : "#ddd8cc", padding: "3.5rem 2.5rem 2rem", borderTop: `1px solid ${c.border}`, transition: "background 0.4s" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "2.5rem", marginBottom: "2.5rem" }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.55rem", letterSpacing: "0.35em", color: "#c9a84c", marginBottom: "0.8rem" }}>NEWRAN</div>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 200, fontSize: "0.68rem", color: c.textMuted, lineHeight: 1.95 }}>Curated luxury for those<br />who define their own style.</p>
        </div>
        {[
          { title: "Shop",    links: ["Women", "Men", "Accessories", "New Arrivals", "Sale"] },
          { title: "Company", links: ["About Us", "Careers", "Press", "Sustainability"]      },
          { title: "Help",    links: ["FAQ", "Shipping", "Returns", "Contact Us"]            },
        ].map((col) => (
          <div key={col.title}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.57rem", letterSpacing: "0.3em", color: "#c9a84c", textTransform: "uppercase", marginBottom: "1.2rem" }}>{col.title}</p>
            {col.links.map((l) => (
              <p key={l} style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 200, fontSize: "0.68rem", color: c.textMuted, letterSpacing: "0.06em", marginBottom: "0.6rem", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#c9a84c"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = c.textMuted; }}
              >{l}</p>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 200, fontSize: "0.6rem", color: c.textMuted }}>© 2025 NEWRAN. All rights reserved.</p>
        <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 200, fontSize: "0.6rem", color: c.textMuted }}>Privacy Policy · Terms of Service</p>
      </div>
    </footer>
  );
}


function ProductModal({ p, onClose }: { p: Product; onClose: () => void }) {
  const { c, isDark } = useTheme();
  const { addToCart, toggleWish, wishlist } = useStore();
  const wished = wishlist.includes(p.id);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const handleAdd = () => { for (let i = 0; i < qty; i++) addToCart(p); setAdded(true); setTimeout(() => setAdded(false), 1500); };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: isDark ? "rgba(14,12,22,0.98)" : "rgba(248,244,236,0.98)", border: `1px solid ${c.border}`, borderRadius: "3px", width: "100%", maxWidth: 720, maxHeight: "90vh", overflow: "auto", display: "flex", flexDirection: "column", boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}>
        <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)", flexShrink: 0 }} />
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          <div style={{ flex: "0 0 45%", background: isDark ? "#13111f" : "#f0ebe0", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <img src={p.image} alt={p.title} style={{ maxWidth: "100%", maxHeight: 300, objectFit: "contain" }} />
          </div>
          <div style={{ flex: 1, padding: "2rem", display: "flex", flexDirection: "column", gap: "0.9rem", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", color: "#c9a84c", textTransform: "capitalize", letterSpacing: "0.15em" }}>{p.category}</p>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: c.textMuted, fontSize: "1.2rem", lineHeight: 1, padding: 0 }}>✕</button>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 300, color: c.text, lineHeight: 1.3 }}>{p.title}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: "#c9a84c" }}>{"★".repeat(Math.round(p.rating.rate))}{"☆".repeat(5 - Math.round(p.rating.rate))}</span>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: c.textMuted }}>{p.rating.rate} ({p.rating.count} reviews)</span>
            </div>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "1.4rem", color: "#c9a84c" }}>${p.price.toFixed(2)}</p>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 200, fontSize: "0.74rem", color: c.textMuted, lineHeight: 1.85 }}>{p.description}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", color: c.textMuted, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>Qty</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 28, height: 28, background: "none", border: `1px solid ${c.border}`, color: c.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "1px" }}>−</button>
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.85rem", color: c.text, minWidth: 20, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} style={{ width: 28, height: 28, background: "none", border: `1px solid ${c.border}`, color: c.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "1px" }}>+</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.8rem", marginTop: "auto" }}>
              <button onClick={handleAdd}
                style={{ flex: 1, padding: "0.88rem", background: added ? "linear-gradient(135deg,#3a7a3a,#5ab05a)" : "linear-gradient(135deg,#8b6914,#c9a84c)", border: "none", color: "#0a0a0f", fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: "1px", transition: "all 0.3s" }}>
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
              <button onClick={() => toggleWish(p.id)}
                style={{ width: 44, height: 44, background: "none", border: `1px solid ${wished ? "#c9a84c" : c.border}`, borderRadius: "1px", cursor: "pointer", color: wished ? "#c9a84c" : c.textMuted, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function SlidePanel({ title, count, onClose, children }: { title: string; count: number; onClose: () => void; children: React.ReactNode }) {
  const { c, isDark } = useTheme();
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 20); }, []);
  const close = () => { setVis(false); setTimeout(onClose, 380); };
  return (
    <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", opacity: vis ? 1 : 0, transition: "opacity 0.35s" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "min(430px,100vw)", background: isDark ? "rgba(12,10,20,0.98)" : "rgba(248,244,236,0.98)", backdropFilter: "blur(20px)", borderLeft: `1px solid ${c.border}`, display: "flex", flexDirection: "column", transform: vis ? "translateX(0)" : "translateX(100%)", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)", boxShadow: "-20px 0 60px rgba(0,0,0,0.4)" }}>
        <div style={{ padding: "1.5rem 1.5rem 1rem", borderBottom: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 300, color: c.text }}>{title}</h3>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", color: c.textMuted, letterSpacing: "0.15em" }}>{count} item{count !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={close} style={{ background: "none", border: `1px solid ${c.border}`, width: 32, height: 32, borderRadius: "1px", cursor: "pointer", color: c.textMuted, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 1.5rem 1.5rem" }}>{children}</div>
      </div>
    </div>
  );
}


function WishlistPanel({ onClose, onOpen }: { onClose: () => void; onOpen: (p: Product) => void }) {
  const { c, isDark } = useTheme();
  const { products, wishlist, toggleWish, addToCart } = useStore();
  const wished = products.filter((p) => wishlist.includes(p.id));
  return (
    <SlidePanel title="My Wishlist" count={wished.length} onClose={onClose}>
      {wished.length === 0 ? <EmptyState icon="♡" text="Your wishlist is empty" /> : (
        wished.map((p) => (
          <div key={p.id} style={{ display: "flex", gap: "1rem", padding: "1rem 0", borderBottom: `1px solid ${c.border}`, alignItems: "center" }}>
            <div style={{ width: 60, height: 60, background: isDark ? "#13111f" : "#f0ebe0", borderRadius: "1px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
              onClick={() => { onOpen(p); onClose(); }}>
              <img src={p.image} alt={p.title} style={{ width: 50, height: 50, objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.95rem", color: c.text, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.title}</p>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.78rem", color: "#c9a84c", marginTop: 3 }}>${p.price.toFixed(2)}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <button onClick={() => addToCart(p)} style={{ padding: "0.4rem 0.8rem", background: "linear-gradient(135deg,#8b6914,#c9a84c)", border: "none", color: "#0a0a0f", fontFamily: "'Montserrat',sans-serif", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: "1px" }}>Add</button>
              <button onClick={() => toggleWish(p.id)} style={{ padding: "0.4rem 0.8rem", background: "none", border: `1px solid ${c.border}`, color: c.textMuted, fontFamily: "'Montserrat',sans-serif", fontSize: "0.55rem", letterSpacing: "0.1em", cursor: "pointer", borderRadius: "1px" }}>Remove</button>
            </div>
          </div>
        ))
      )}
    </SlidePanel>
  );
}


function CartPanel({ onClose, onCheckout }: { onClose: () => void; onCheckout: () => void }) {
  const { c } = useTheme();
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useStore();
  return (
    <SlidePanel title="Shopping Cart" count={cart.length} onClose={onClose}>
      {cart.length === 0 ? <EmptyState icon="◻" text="Your cart is empty" /> : (
        <>
          {cart.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: "1rem", padding: "1rem 0", borderBottom: `1px solid ${c.border}`, alignItems: "center" }}>
              <div style={{ width: 56, height: 56, background: "rgba(201,168,76,0.06)", borderRadius: "1px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src={item.image} alt={item.title} style={{ width: 46, height: 46, objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.92rem", color: c.text, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</p>
                <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.75rem", color: "#c9a84c", marginTop: 3 }}>${(item.price * item.qty).toFixed(2)}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 22, height: 22, background: "none", border: `1px solid ${c.border}`, color: c.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "1px" }}>−</button>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.75rem", color: c.text, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 22, height: 22, background: "none", border: `1px solid ${c.border}`, color: c.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "1px" }}>+</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: c.textMuted, fontSize: "1.1rem", padding: 4 }}>✕</button>
            </div>
          ))}
          <div style={{ marginTop: "1.5rem", paddingTop: "1.2rem", borderTop: `1px solid ${c.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: c.textMuted, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Subtotal</span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", color: "#c9a84c", fontWeight: 300 }}>${cartTotal.toFixed(2)}</span>
            </div>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", color: c.textMuted, marginBottom: "1.5rem" }}>Shipping & taxes calculated at checkout</p>
            <button onClick={() => { onClose(); onCheckout(); }}
              style={{ width: "100%", padding: "0.92rem", background: "linear-gradient(135deg,#8b6914,#c9a84c)", border: "none", color: "#0a0a0f", fontFamily: "'Montserrat',sans-serif", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: "1px", marginBottom: "0.7rem" }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.boxShadow = "0 8px 30px rgba(201,168,76,0.4)"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.boxShadow = "none"; }}
            >Proceed to Checkout</button>
            <button onClick={clearCart} style={{ width: "100%", padding: "0.7rem", background: "none", border: `1px solid ${c.border}`, color: c.textMuted, fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: "1px" }}>Clear Cart</button>
          </div>
        </>
      )}
    </SlidePanel>
  );
}


function OrdersList() {
  const { c, isDark } = useTheme();
  const { orders }    = useStore();
  if (orders.length === 0) return <EmptyState icon="📦" text="No orders yet — start shopping!" />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {orders.map((order: Order) => (
        <div key={order.id} style={{ padding: "1rem", background: isDark ? "rgba(201,168,76,0.04)" : "rgba(201,168,76,0.06)", border: `1px solid ${c.border}`, borderRadius: "2px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
            <div>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.7rem", color: "#c9a84c", letterSpacing: "0.15em", fontWeight: 500 }}>{order.id}</p>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", color: c.textMuted, marginTop: 2 }}>{order.date}</p>
            </div>
            <span style={{ padding: "3px 10px", background: order.status === "Delivered" ? "rgba(90,176,90,0.15)" : "rgba(201,168,76,0.08)", border: `1px solid ${order.status === "Delivered" ? "rgba(90,176,90,0.4)" : "rgba(201,168,76,0.3)"}`, borderRadius: "1px", fontFamily: "'Montserrat',sans-serif", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: order.status === "Delivered" ? "#5ab05a" : "#c9a84c" }}>
              {order.status}
            </span>
          </div>
          {order.items.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: "0.7rem", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ width: 36, height: 36, background: isDark ? "#13111f" : "#f0ebe0", borderRadius: "1px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src={item.image} alt="" style={{ width: 28, height: 28, objectFit: "contain" as const }} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.88rem", color: c.text, flex: 1, lineHeight: 1.2 }}>{item.title}</p>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.7rem", color: c.textMuted, flexShrink: 0 }}>×{item.qty}</p>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${c.border}`, marginTop: "0.7rem", paddingTop: "0.7rem", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", color: c.textMuted, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Total</span>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", color: "#c9a84c" }}>${order.total.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}


type ProfileTab = "profile" | "orders" | "wishlist" | "settings";

function ProfilePanel({ user, onClose, onLogout, onOpenWishlist, onOpenCart }: { user: User; onClose: () => void; onLogout: () => void; onOpenWishlist: () => void; onOpenCart: () => void }) {
  const { c, isDark, toggle, theme } = useTheme();
  const { cart, wishlist, orders }   = useStore();
  const [tab, setTab] = useState<ProfileTab>("profile");
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 20); }, []);
  const close = () => { setVis(false); setTimeout(onClose, 380); };
  const tabs: { key: ProfileTab; label: string }[] = [
    { key: "profile", label: "Profile" }, { key: "orders", label: "Orders" },
    { key: "wishlist", label: "Wishlist" }, { key: "settings", label: "Settings" },
  ];
  return (
    <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", opacity: vis ? 1 : 0, transition: "opacity 0.35s" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "min(480px,100vw)", background: isDark ? "rgba(12,10,20,0.98)" : "rgba(248,244,236,0.98)", backdropFilter: "blur(20px)", borderLeft: `1px solid ${c.border}`, display: "flex", flexDirection: "column", transform: vis ? "translateX(0)" : "translateX(100%)", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)", boxShadow: "-20px 0 60px rgba(0,0,0,0.4)" }}>
        <div style={{ padding: "2rem 1.5rem 1.2rem", borderBottom: `1px solid ${c.border}`, background: isDark ? "rgba(201,168,76,0.04)" : "rgba(201,168,76,0.06)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 300, color: c.text }}>My Account</h3>
            <button onClick={close} style={{ background: "none", border: `1px solid ${c.border}`, width: 30, height: 30, borderRadius: "1px", cursor: "pointer", color: c.textMuted, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#8b6914,#c9a84c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 600, color: "#0a0a0f", boxShadow: "0 0 20px rgba(201,168,76,0.3)" }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", fontWeight: 300, color: c.text }}>{user.name}</p>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", color: c.textMuted, marginTop: 2 }}>{user.email}</p>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.55rem", color: "rgba(201,168,76,0.7)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}>✦ NEWRAN Member</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.2rem" }}>
            {[
              { label: "Wishlist", val: wishlist.length, action: () => { close(); onOpenWishlist(); } },
              { label: "Cart",     val: cart.length,     action: () => { close(); onOpenCart(); }     },
              { label: "Orders",   val: orders.length,   action: () => setTab("orders")               },
            ].map((s) => (
              <button key={s.label} onClick={s.action}
                style={{ flex: 1, padding: "0.6rem", background: isDark ? "rgba(201,168,76,0.06)" : "rgba(201,168,76,0.1)", border: `1px solid ${c.border}`, borderRadius: "1px", cursor: "pointer", textAlign: "center" as const, transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#c9a84c"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = c.border; }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", color: "#c9a84c" }}>{s.val}</p>
                <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.55rem", color: c.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>{s.label}</p>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", borderBottom: `1px solid ${c.border}`, flexShrink: 0 }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ flex: 1, padding: "0.75rem 0.5rem", background: "none", border: "none", borderBottom: tab === t.key ? "2px solid #c9a84c" : "2px solid transparent", fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: tab === t.key ? "#c9a84c" : c.textMuted, cursor: "pointer", transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {tab === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[{ label: "Full Name", val: user.name }, { label: "Email", val: user.email }, { label: "Member Since", val: "2025" }, { label: "Tier", val: "✦ Gold Member" }].map((row) => (
                <div key={row.label} style={{ padding: "0.9rem 1rem", background: isDark ? "rgba(201,168,76,0.04)" : "rgba(201,168,76,0.06)", border: `1px solid ${c.border}`, borderRadius: "1px" }}>
                  <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.57rem", color: c.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.35rem" }}>{row.label}</p>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.05rem", color: c.text }}>{row.val}</p>
                </div>
              ))}
            </div>
          )}
          {tab === "orders"   && <OrdersList />}
          {tab === "wishlist" && (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 300, color: c.text, marginBottom: "1rem" }}>{wishlist.length} saved items</p>
              <button onClick={() => { close(); onOpenWishlist(); }}
                style={{ padding: "0.8rem 2rem", background: "linear-gradient(135deg,#8b6914,#c9a84c)", border: "none", color: "#0a0a0f", fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: "1px" }}>
                View Wishlist
              </button>
            </div>
          )}
          {tab === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "Appearance", sub: theme === "dark" ? "Dark Mode" : "Light Mode", action: <button onClick={toggle} style={{ padding: "0.45rem 1rem", background: "linear-gradient(135deg,#8b6914,#c9a84c)", border: "none", color: "#0a0a0f", fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: "1px" }}>{theme === "dark" ? "Light" : "Dark"}</button> },
                { label: "Notifications", sub: "Email & push",   action: <ToggleSwitch /> },
                { label: "Newsletter",    sub: "Weekly updates", action: <ToggleSwitch defaultOn /> },
              ].map((row) => (
                <div key={row.label} style={{ padding: "0.9rem 1rem", background: isDark ? "rgba(201,168,76,0.04)" : "rgba(201,168,76,0.06)", border: `1px solid ${c.border}`, borderRadius: "1px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.62rem", color: c.text, letterSpacing: "0.1em" }}>{row.label}</p>
                    <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.57rem", color: c.textMuted, marginTop: 2 }}>{row.sub}</p>
                  </div>
                  {row.action}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "1rem 1.5rem", borderTop: `1px solid ${c.border}`, flexShrink: 0 }}>
          <button onClick={() => { close(); setTimeout(onLogout, 400); }}
            style={{ width: "100%", padding: "0.8rem", background: "none", border: "1px solid rgba(192,57,43,0.35)", color: "#c0392b", fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: "1px", transition: "all 0.3s" }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(192,57,43,0.08)"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "none"; }}
          >Sign Out</button>
        </div>
      </div>
    </div>
  );
}


function SearchResults({ onClear, onOpen }: { onClear: () => void; onOpen: (p: Product) => void }) {
  const { c } = useTheme();
  const { filtered, searchQuery } = useStore();
  return (
    <section style={{ background: c.bg, padding: "3rem 2.5rem", minHeight: "60vh", transition: "background 0.4s" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem" }}>
          <div>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#c9a84c", textTransform: "uppercase", marginBottom: "0.4rem" }}>Search Results</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.9rem", fontWeight: 300, color: c.text }}>
              "{searchQuery}" <span style={{ color: c.textMuted, fontSize: "1.2rem" }}>— {filtered.length} items</span>
            </h2>
          </div>
          <GoldOutlineBtn onClick={onClear}>✕ Clear</GoldOutlineBtn>
        </div>
        {filtered.length === 0 ? <EmptyState icon="🔍" text="No results found" /> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1.4rem" }}>
            {filtered.map((p, i) => <ProductCard key={p.id} p={p} delay={i * 0.04} onOpen={onOpen} />)}
          </div>
        )}
      </div>
    </section>
  );
}


type CheckoutStep = "cart" | "shipping" | "payment" | "review" | "done";

interface ShippingData { firstName:string; lastName:string; email:string; phone:string; address:string; city:string; country:string; zip:string; }
interface PaymentData  { cardName:string; cardNumber:string; expiry:string; cvv:string; }

const EMPTY_S: ShippingData = { firstName:"",lastName:"",email:"",phone:"",address:"",city:"",country:"",zip:"" };
const EMPTY_P: PaymentData  = { cardName:"",cardNumber:"",expiry:"",cvv:"" };

const fmtCard   = (v:string) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
const fmtExpiry = (v:string) => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>=3?`${d.slice(0,2)}/${d.slice(2)}`:d; };

const CO_STEPS = ["Cart","Shipping","Payment","Review"];

function CoStepBar({ step }: { step: CheckoutStep }) {
  const { c } = useTheme();
  const idx = ["cart","shipping","payment","review"].indexOf(step);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, marginBottom:"3rem" }}>
      {CO_STEPS.map((label, i) => {
        const done=i<idx, active=i===idx;
        return (
          <div key={label} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.4rem" }}>
              <div style={{ width:32,height:32,borderRadius:"50%",background:done?"linear-gradient(135deg,#8b6914,#c9a84c)":"transparent",border:done?"none":`2px solid ${active?"#c9a84c":c.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:done?"#0a0a0f":active?"#c9a84c":c.textMuted,fontFamily:"'Montserrat',sans-serif",fontSize:done?"0.7rem":"0.75rem",fontWeight:600,transition:"all 0.4s" }}>
                {done?"✓":i+1}
              </div>
              <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.55rem",letterSpacing:"0.18em",textTransform:"uppercase" as const,color:active?"#c9a84c":done?"rgba(201,168,76,0.6)":c.textMuted }}>{label}</span>
            </div>
            {i<CO_STEPS.length-1 && <div style={{ width:60,height:1,margin:"0 0.5rem 1.4rem",background:done?"#c9a84c":c.border,transition:"background 0.4s" }} />}
          </div>
        );
      })}
    </div>
  );
}

function CoField({ label,value,onChange,placeholder,type="text",half=false,error }: { label:string;value:string;onChange:(v:string)=>void;placeholder?:string;type?:string;half?:boolean;error?:string }) {
  const { c } = useTheme();
  const [focused,setFocused] = useState(false);
  return (
    <div style={{ width:half?"calc(50% - 0.4rem)":"100%" }}>
      <label style={{ display:"block",fontFamily:"'Montserrat',sans-serif",fontSize:"0.57rem",letterSpacing:"0.18em",color:focused?"#c9a84c":c.textMuted,marginBottom:"0.35rem",textTransform:"uppercase" as const,transition:"color 0.3s" }}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder={placeholder}
        style={{ width:"100%",background:c.inputBg,border:`1px solid ${error?"#c0392b":focused?"rgba(201,168,76,0.65)":c.border}`,borderRadius:"1px",padding:"0.75rem 0.9rem",color:c.text,fontFamily:"'Montserrat',sans-serif",fontSize:"0.82rem",fontWeight:300,outline:"none",transition:"border-color 0.3s",boxSizing:"border-box" as const }} />
      {error && <p style={{ color:"#c0392b",fontSize:"0.62rem",marginTop:"0.2rem",fontFamily:"'Montserrat',sans-serif" }}>{error}</p>}
    </div>
  );
}

function CoGoldBtn({ children,onClick,disabled=false,loading=false }: { children:React.ReactNode;onClick:()=>void;disabled?:boolean;loading?:boolean }) {
  const [h,setH] = useState(false);
  return (
    <button onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick} disabled={disabled||loading}
      style={{ padding:"0.82rem 2rem",background:h?"linear-gradient(135deg,#e8d5a3,#c9a84c)":"linear-gradient(135deg,#8b6914,#c9a84c)",border:"none",color:"#0a0a0f",fontFamily:"'Montserrat',sans-serif",fontSize:"0.65rem",fontWeight:500,letterSpacing:"0.2em",textTransform:"uppercase" as const,cursor:disabled||loading?"not-allowed":"pointer",borderRadius:"1px",transition:"all 0.3s",transform:h?"translateY(-1px)":"translateY(0)",boxShadow:h?"0 8px 30px rgba(201,168,76,0.35)":"none",opacity:disabled?0.5:1 }}>
      {loading?"Processing...":children}
    </button>
  );
}

function CoOutlineBtn({ children,onClick }: { children:React.ReactNode;onClick:()=>void }) {
  const { c } = useTheme();
  const [h,setH] = useState(false);
  return (
    <button onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick}
      style={{ padding:"0.82rem 1.6rem",background:"transparent",border:`1px solid ${h?"#c9a84c":c.border}`,color:h?"#c9a84c":c.textMuted,fontFamily:"'Montserrat',sans-serif",fontSize:"0.63rem",letterSpacing:"0.18em",textTransform:"uppercase" as const,cursor:"pointer",borderRadius:"1px",transition:"all 0.25s" }}>
      {children}
    </button>
  );
}

function CoOrderSummary({ localCart, localTotal }: { localCart:any[]; localTotal:number }) {
  const { c, isDark } = useTheme();
  const shipping = localTotal > 200 ? 0 : 12.99;
  const tax = localTotal * 0.08;
  const total = localTotal + shipping + tax;
  return (
    <div style={{ background:isDark?"rgba(201,168,76,0.04)":"rgba(201,168,76,0.06)",border:`1px solid ${c.border}`,borderRadius:"2px",padding:"1.5rem",position:"sticky" as const,top:84 }}>
      <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.58rem",letterSpacing:"0.3em",color:"#c9a84c",textTransform:"uppercase" as const,marginBottom:"1.2rem" }}>Order Summary</p>
      <div style={{ maxHeight:260,overflowY:"auto" as const,marginBottom:"1.2rem" }}>
        {localCart.map((item:any) => (
          <div key={item.id} style={{ display:"flex",gap:"0.8rem",marginBottom:"1rem",alignItems:"center" }}>
            <div style={{ width:48,height:48,background:isDark?"#13111f":"#f0ebe0",borderRadius:"1px",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" as const }}>
              <img src={item.image} alt="" style={{ width:38,height:38,objectFit:"contain" as const }} />
              <span style={{ position:"absolute" as const,top:-6,right:-6,width:18,height:18,borderRadius:"50%",background:"#c9a84c",color:"#0a0a0f",fontFamily:"'Montserrat',sans-serif",fontSize:"0.55rem",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center" }}>{item.qty}</span>
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"0.88rem",color:c.text,lineHeight:1.2,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as const }}>{item.title}</p>
            </div>
            <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.75rem",color:"#c9a84c",flexShrink:0 }}>${(item.price*item.qty).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div style={{ height:1,background:c.border,marginBottom:"1rem" }} />
      {[
        { label:"Subtotal", val:`$${localTotal.toFixed(2)}`,  color:c.text },
        { label:"Shipping", val:shipping===0?"Free":`$${shipping.toFixed(2)}`, color:shipping===0?"#5ab05a":c.text },
        { label:"Tax (8%)", val:`$${tax.toFixed(2)}`,         color:c.textMuted },
      ].map(row => (
        <div key={row.label} style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.6rem" }}>
          <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.65rem",color:c.textMuted }}>{row.label}</span>
          <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.75rem",color:row.color }}>{row.val}</span>
        </div>
      ))}
      {shipping===0 && <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.58rem",color:"#5ab05a",marginBottom:"0.8rem" }}>✓ Free shipping on orders over $200</p>}
      <div style={{ display:"flex",justifyContent:"space-between",marginTop:"1rem",paddingTop:"1rem",borderTop:`1px solid ${c.border}` }}>
        <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.68rem",color:c.text,letterSpacing:"0.12em",textTransform:"uppercase" as const }}>Total</span>
        <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",color:"#c9a84c" }}>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

function CheckoutPage({ onBackHome }: { onBackHome: () => void }) {
  const { c, isDark }  = useTheme();
  const { cart, placeOrder } = useStore();
  const [step,      setStep]      = useState<CheckoutStep>("cart");
  const [shipping,  setShipping]  = useState<ShippingData>(EMPTY_S);
  const [payment,   setPayment]   = useState<PaymentData>(EMPTY_P);
  const [loading,   setLoading]   = useState(false);
  const [orderId,   setOrderId]   = useState("");
  const [localCart, setLocalCart] = useState(cart);

  useEffect(() => { setLocalCart(cart); }, [cart]);

  const updateQty  = (id:number,qty:number) => setLocalCart(c=>qty<=0?c.filter(x=>x.id!==id):c.map(x=>x.id===id?{...x,qty}:x));
  const removeItem = (id:number) => setLocalCart(c=>c.filter(x=>x.id!==id));
  const localTotal = localCart.reduce((s:number,i:any)=>s+i.price*i.qty,0);


  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      const id = placeOrder({
        firstName: shipping.firstName,
        lastName:  shipping.lastName,
        address:   shipping.address,
        city:      shipping.city,
        country:   shipping.country,
      });
      setOrderId(id);
      setLoading(false);
      setStep("done");
    }, 2000);
  };

  const validateShipping = () => {
    const req = ["firstName","lastName","email","phone","address","city","country","zip"] as (keyof ShippingData)[];
    return req.every(k => k==="email" ? shipping[k].includes("@") : shipping[k].trim());
  };
  const validatePayment = () =>
    payment.cardName.trim() && payment.cardNumber.replace(/\s/g,"").length===16 && payment.expiry.length===5 && payment.cvv.length>=3;

  return (
    <div style={{ minHeight:"100vh", background:c.bg, transition:"background 0.4s" }}>
      <div style={{ height:64,borderBottom:`1px solid ${c.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 2.5rem",background:c.navBg,backdropFilter:"blur(20px)",position:"sticky" as const,top:0,zIndex:20 }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:"1.4rem",letterSpacing:"0.35em",color:"#c9a84c" }}>NEWRAN</div>
        {step!=="done" && (
          <button onClick={onBackHome} style={{ background:"none",border:"none",fontFamily:"'Montserrat',sans-serif",fontSize:"0.6rem",letterSpacing:"0.2em",color:c.textMuted,cursor:"pointer",textTransform:"uppercase" as const,transition:"color 0.2s" }}
            onMouseEnter={e=>{(e.target as HTMLElement).style.color="#c9a84c"}}
            onMouseLeave={e=>{(e.target as HTMLElement).style.color=c.textMuted}}>
            ← Continue Shopping
          </button>
        )}
      </div>

      <div style={{ maxWidth:step==="done"?600:1100,margin:"0 auto",padding:"3rem 2rem" }}>
        {step!=="done" && <CoStepBar step={step} />}

        {step==="done" ? (
          <div style={{ textAlign:"center",padding:"4rem 1rem" }}>
            <style>{`@keyframes popIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
            <div style={{ width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#3a7a3a,#5ab05a)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 2rem",fontSize:"2.2rem",boxShadow:"0 0 40px rgba(90,176,90,0.4)",animation:"popIn 0.6s cubic-bezier(0.16,1,0.3,1)" }}>✓</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,5vw,3rem)",fontWeight:300,color:"#c9a84c",marginBottom:"0.8rem" }}>Order Confirmed!</h2>
            <p style={{ fontFamily:"'Montserrat',sans-serif",fontWeight:200,fontSize:"0.75rem",color:c.textMuted,letterSpacing:"0.1em",marginBottom:"0.5rem" }}>
              Thank you, <span style={{ color:c.text }}>{shipping.firstName||"Customer"}</span>! A confirmation email has been sent.
            </p>
            <div style={{ display:"inline-block",padding:"0.6rem 1.5rem",border:"1px solid rgba(201,168,76,0.3)",borderRadius:"1px",margin:"1.5rem 0" }}>
              <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.58rem",color:c.textMuted,letterSpacing:"0.2em",textTransform:"uppercase" as const,marginBottom:"0.2rem" }}>Order ID</p>
              <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.9rem",color:"#c9a84c",letterSpacing:"0.2em" }}>{orderId}</p>
            </div>
            <div style={{ width:180,height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)",margin:"0 auto 2rem" }} />
            <p style={{ fontFamily:"'Montserrat',sans-serif",fontWeight:200,fontSize:"0.7rem",color:c.textMuted,marginBottom:"1.5rem" }}>
              Estimated delivery: <span style={{ color:c.text }}>5-7 business days</span>
            </p>
            <button onClick={onBackHome}
              style={{ padding:"0.9rem 2.8rem",background:"linear-gradient(135deg,#8b6914,#c9a84c)",border:"none",color:"#0a0a0f",fontFamily:"'Montserrat',sans-serif",fontSize:"0.65rem",fontWeight:500,letterSpacing:"0.25em",textTransform:"uppercase" as const,cursor:"pointer",borderRadius:"1px",transition:"box-shadow 0.3s" }}
              onMouseEnter={e=>{(e.target as HTMLElement).style.boxShadow="0 10px 40px rgba(201,168,76,0.4)"}}
              onMouseLeave={e=>{(e.target as HTMLElement).style.boxShadow="none"}}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div style={{ display:"grid",gridTemplateColumns:"1fr 340px",gap:"2rem",alignItems:"start" }}>
            <div>
              {step==="cart" && (
                <div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:300,color:c.text,marginBottom:"2rem" }}>
                    Your Cart <span style={{ color:c.textMuted,fontSize:"1.2rem" }}>({localCart.length} items)</span>
                  </h2>
                  {localCart.length===0 ? <EmptyState icon="◻" text="Your cart is empty" /> : (
                    <>
                      {localCart.map((item:any) => (
                        <div key={item.id} style={{ display:"flex",gap:"1.2rem",padding:"1.2rem 0",borderBottom:`1px solid ${c.border}`,alignItems:"center" }}>
                          <div style={{ width:80,height:80,background:isDark?"#13111f":"#f0ebe0",borderRadius:"2px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                            <img src={item.image} alt="" style={{ width:65,height:65,objectFit:"contain" as const }} />
                          </div>
                          <div style={{ flex:1,minWidth:0 }}>
                            <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.6rem",color:c.textMuted,textTransform:"capitalize",marginBottom:"0.3rem" }}>{item.category}</p>
                            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.05rem",color:c.text,lineHeight:1.3 }}>{item.title}</p>
                            <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.75rem",color:"#c9a84c",marginTop:"0.3rem" }}>${item.price.toFixed(2)} each</p>
                          </div>
                          <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
                            <button onClick={()=>updateQty(item.id,item.qty-1)} style={{ width:28,height:28,background:"none",border:`1px solid ${c.border}`,color:c.text,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"1px" }}>−</button>
                            <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.85rem",color:c.text,minWidth:20,textAlign:"center" as const }}>{item.qty}</span>
                            <button onClick={()=>updateQty(item.id,item.qty+1)} style={{ width:28,height:28,background:"none",border:`1px solid ${c.border}`,color:c.text,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"1px" }}>+</button>
                          </div>
                          <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.9rem",color:"#c9a84c",minWidth:64,textAlign:"right" as const,flexShrink:0 }}>${(item.price*item.qty).toFixed(2)}</p>
                          <button onClick={()=>removeItem(item.id)} style={{ background:"none",border:"none",cursor:"pointer",color:c.textMuted,fontSize:"1.1rem",padding:"4px" }}
                            onMouseEnter={e=>{(e.target as HTMLElement).style.color="#c0392b"}}
                            onMouseLeave={e=>{(e.target as HTMLElement).style.color=c.textMuted}}>✕</button>
                        </div>
                      ))}
                      <div style={{ display:"flex",justifyContent:"flex-end",marginTop:"2rem" }}>
                        <CoGoldBtn onClick={()=>setStep("shipping")}>Continue to Shipping →</CoGoldBtn>
                      </div>
                    </>
                  )}
                </div>
              )}

              {step==="shipping" && (
                <div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:300,color:c.text,marginBottom:"2rem" }}>Shipping Details</h2>
                  <div style={{ display:"flex",flexWrap:"wrap" as const,gap:"0.8rem" }}>
                    <CoField label="First Name" value={shipping.firstName} onChange={v=>setShipping({...shipping,firstName:v})} placeholder="John"              half />
                    <CoField label="Last Name"  value={shipping.lastName}  onChange={v=>setShipping({...shipping,lastName:v})}  placeholder="Doe"               half />
                    <CoField label="Email"      value={shipping.email}     onChange={v=>setShipping({...shipping,email:v})}     placeholder="you@example.com" type="email" />
                    <CoField label="Phone"      value={shipping.phone}     onChange={v=>setShipping({...shipping,phone:v})}     placeholder="+1 234 567 8900" type="tel" />
                    <CoField label="Address"    value={shipping.address}   onChange={v=>setShipping({...shipping,address:v})}   placeholder="123 Main Street" />
                    <CoField label="City"       value={shipping.city}      onChange={v=>setShipping({...shipping,city:v})}      placeholder="New York"        half />
                    <CoField label="ZIP Code"   value={shipping.zip}       onChange={v=>setShipping({...shipping,zip:v})}       placeholder="10001"           half />
                    <CoField label="Country"    value={shipping.country}   onChange={v=>setShipping({...shipping,country:v})}   placeholder="United States" />
                  </div>
                  <div style={{ marginTop:"1.8rem" }}>
                    <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.6rem",letterSpacing:"0.25em",color:"#c9a84c",textTransform:"uppercase" as const,marginBottom:"1rem" }}>Shipping Method</p>
                    {[
                      { label:"Standard Shipping",sub:"5-7 business days",price:"Free",   active:true  },
                      { label:"Express Shipping", sub:"2-3 business days",price:"$12.99",active:false },
                      { label:"Overnight",        sub:"Next business day",price:"$24.99",active:false },
                    ].map(opt=>(
                      <div key={opt.label} style={{ display:"flex",alignItems:"center",gap:"1rem",padding:"0.9rem 1rem",border:`1px solid ${opt.active?"#c9a84c":c.border}`,borderRadius:"1px",marginBottom:"0.6rem",cursor:"pointer" }}>
                        <div style={{ width:16,height:16,borderRadius:"50%",border:opt.active?"5px solid #c9a84c":`2px solid ${c.border}`,flexShrink:0 }} />
                        <div style={{ flex:1 }}>
                          <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.72rem",color:c.text }}>{opt.label}</p>
                          <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.62rem",color:c.textMuted,marginTop:2 }}>{opt.sub}</p>
                        </div>
                        <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.75rem",color:opt.price==="Free"?"#5ab05a":"#c9a84c" }}>{opt.price}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between",marginTop:"2rem" }}>
                    <CoOutlineBtn onClick={()=>setStep("cart")}>← Back to Cart</CoOutlineBtn>
                    <CoGoldBtn onClick={()=>{ if(validateShipping()) setStep("payment"); }}>Continue to Payment →</CoGoldBtn>
                  </div>
                </div>
              )}

              {step==="payment" && (
                <div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:300,color:c.text,marginBottom:"2rem" }}>Payment Details</h2>
                  <div style={{ width:"100%",maxWidth:360,height:200,borderRadius:"12px",background:"linear-gradient(135deg,#1a1520 0%,#2d2438 50%,#1a1520 100%)",border:"1px solid rgba(201,168,76,0.35)",padding:"1.5rem 1.8rem",marginBottom:"2rem",position:"relative" as const,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.4)" }}>
                    <div style={{ position:"absolute" as const,top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(201,168,76,0.06)" }} />
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.5rem" }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",letterSpacing:"0.2em",color:"#c9a84c" }}>NEWRAN</div>
                      <div style={{ display:"flex" }}>
                        <div style={{ width:28,height:18,borderRadius:"50%",background:"rgba(201,168,76,0.6)" }} />
                        <div style={{ width:28,height:18,borderRadius:"50%",background:"rgba(201,168,76,0.35)",marginLeft:-10 }} />
                      </div>
                    </div>
                    <div style={{ width:36,height:26,borderRadius:"4px",background:"linear-gradient(135deg,#c9a84c,#e8d5a3)",marginBottom:"1.2rem" }} />
                    <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.85rem",letterSpacing:"0.25em",color:"rgba(240,236,224,0.9)",marginBottom:"0.8rem" }}>{payment.cardNumber||"•••• •••• •••• ••••"}</p>
                    <div style={{ display:"flex",justifyContent:"space-between" }}>
                      <div>
                        <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.5rem",color:"rgba(240,236,224,0.4)",letterSpacing:"0.15em",textTransform:"uppercase" as const,marginBottom:"0.15rem" }}>Card Holder</p>
                        <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.7rem",color:"rgba(240,236,224,0.85)",textTransform:"uppercase" as const }}>{payment.cardName||"YOUR NAME"}</p>
                      </div>
                      <div style={{ textAlign:"right" as const }}>
                        <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.5rem",color:"rgba(240,236,224,0.4)",letterSpacing:"0.15em",textTransform:"uppercase" as const,marginBottom:"0.15rem" }}>Expires</p>
                        <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.7rem",color:"rgba(240,236,224,0.85)" }}>{payment.expiry||"MM/YY"}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex",flexWrap:"wrap" as const,gap:"0.8rem" }}>
                    <CoField label="Cardholder Name" value={payment.cardName}   onChange={v=>setPayment({...payment,cardName:v})}                      placeholder="John Doe" />
                    <CoField label="Card Number"     value={payment.cardNumber} onChange={v=>setPayment({...payment,cardNumber:fmtCard(v)})}            placeholder="1234 5678 9012 3456" />
                    <CoField label="Expiry Date"     value={payment.expiry}     onChange={v=>setPayment({...payment,expiry:fmtExpiry(v)})}              placeholder="MM/YY" half />
                    <CoField label="CVV"             value={payment.cvv}        onChange={v=>setPayment({...payment,cvv:v.replace(/\D/g,"").slice(0,4)})} placeholder="•••" half />
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",marginTop:"1.2rem",padding:"0.7rem 1rem",background:isDark?"rgba(90,176,90,0.06)":"rgba(90,176,90,0.1)",border:"1px solid rgba(90,176,90,0.2)",borderRadius:"1px" }}>
                    <span style={{ color:"#5ab05a" }}>🔒</span>
                    <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.62rem",color:"#5ab05a" }}>Your payment information is encrypted and secure</p>
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between",marginTop:"2rem" }}>
                    <CoOutlineBtn onClick={()=>setStep("shipping")}>← Back</CoOutlineBtn>
                    <CoGoldBtn onClick={()=>{ if(validatePayment()) setStep("review"); }}>Review Order →</CoGoldBtn>
                  </div>
                </div>
              )}

              {step==="review" && (
                <div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:300,color:c.text,marginBottom:"2rem" }}>Review Your Order</h2>
                  {[
                    { title:"Shipping To", rows:[
                      { label:"Name",    val:`${shipping.firstName} ${shipping.lastName}` },
                      { label:"Email",   val:shipping.email   },
                      { label:"Address", val:`${shipping.address}, ${shipping.city}, ${shipping.country} ${shipping.zip}` },
                      { label:"Phone",   val:shipping.phone   },
                    ]},
                    { title:"Payment", rows:[
                      { label:"Card",    val:`**** **** **** ${payment.cardNumber.replace(/\s/g,"").slice(-4)}` },
                      { label:"Name",    val:payment.cardName },
                      { label:"Expires", val:payment.expiry   },
                    ]},
                  ].map(section=>(
                    <div key={section.title} style={{ marginBottom:"1.5rem",padding:"1.2rem",background:isDark?"rgba(201,168,76,0.03)":"rgba(201,168,76,0.05)",border:`1px solid ${c.border}`,borderRadius:"2px" }}>
                      <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.58rem",letterSpacing:"0.25em",color:"#c9a84c",textTransform:"uppercase" as const,marginBottom:"1rem" }}>{section.title}</p>
                      {section.rows.map(r=>(
                        <div key={r.label} style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.5rem" }}>
                          <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.65rem",color:c.textMuted }}>{r.label}</span>
                          <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.68rem",color:c.text }}>{r.val}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div style={{ marginBottom:"1.5rem",padding:"1.2rem",background:isDark?"rgba(201,168,76,0.03)":"rgba(201,168,76,0.05)",border:`1px solid ${c.border}`,borderRadius:"2px" }}>
                    <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.58rem",letterSpacing:"0.25em",color:"#c9a84c",textTransform:"uppercase" as const,marginBottom:"1rem" }}>Items</p>
                    {localCart.map((item:any)=>(
                      <div key={item.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.6rem" }}>
                        <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"0.95rem",color:c.text,flex:1,marginRight:"1rem" }}>{item.title} <span style={{ color:c.textMuted,fontSize:"0.8rem" }}>×{item.qty}</span></p>
                        <p style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.75rem",color:"#c9a84c",flexShrink:0 }}>${(item.price*item.qty).toFixed(2)}</p>
                      </div>
                    ))}
                    <div style={{ borderTop:`1px solid ${c.border}`,marginTop:"0.8rem",paddingTop:"0.8rem" }}>
                      <div style={{ display:"flex",justifyContent:"space-between",marginTop:"0.6rem",paddingTop:"0.6rem",borderTop:`1px solid ${c.border}` }}>
                        <span style={{ fontFamily:"'Montserrat',sans-serif",fontSize:"0.7rem",color:c.text,letterSpacing:"0.12em",textTransform:"uppercase" as const }}>Total</span>
                        <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",color:"#c9a84c" }}>${(localTotal+(localTotal>200?0:12.99)+(localTotal*0.08)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between" }}>
                    <CoOutlineBtn onClick={()=>setStep("payment")}>← Edit</CoOutlineBtn>
                    <CoGoldBtn onClick={handleConfirm} loading={loading}>Confirm & Pay ✓</CoGoldBtn>
                  </div>
                </div>
              )}
            </div>
            <CoOrderSummary localCart={localCart} localTotal={localTotal} />
          </div>
        )}
      </div>
    </div>
  );
}



type View = "home" | "category" | "checkout";

export default function HomePage({ user, onLogout }: Props) {
  const { c }                                   = useTheme();
  const { searchQuery, setSearch, setCategory } = useStore();
  const [productModal, setProductModal]         = useState<Product | null>(null);
  const [wishlistOpen, setWishlistOpen]         = useState(false);
  const [cartOpen,     setCartOpen]             = useState(false);
  const [profileOpen,  setProfileOpen]          = useState(false);
  const [view,         setView]                 = useState<View>("home");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (cat: string) => { setCategory(cat); setView("category"); scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleBackHome      = () => { setView("home"); setCategory(""); scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleCheckout      = () => { setView("checkout"); scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }); };
  const scrollToProducts    = () => { document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div ref={scrollRef} style={{ position: "fixed", inset: 0, overflowY: "auto", overflowX: "hidden", background: c.bg, transition: "background 0.4s" }}>
      {view !== "checkout" && (
        <Navbar user={user} onLogout={onLogout} onWishlistOpen={() => setWishlistOpen(true)} onCartOpen={() => setCartOpen(true)} onProfileOpen={() => setProfileOpen(true)} onCategoryClick={handleCategoryClick} />
      )}

      {view === "checkout" && <CheckoutPage onBackHome={handleBackHome} />}

      {view !== "checkout" && (
        <div>
          {searchQuery ? (
            <SearchResults onClear={() => setSearch("")} onOpen={setProductModal} />
          ) : view === "category" ? (
            <CategoryPage onOpen={setProductModal} onBack={handleBackHome} />
          ) : (
            <>
              <HeroSection onShopNow={scrollToProducts} />
              <CategoriesSection onCategoryClick={handleCategoryClick} />
              <div id="featured"><FeaturedSection onOpen={setProductModal} /></div>
              <OffersSection onOpen={setProductModal} onCategoryClick={handleCategoryClick} />
              <NewsletterSection />
              <Footer />
            </>
          )}
        </div>
      )}

      {productModal && <ProductModal p={productModal} onClose={() => setProductModal(null)} />}
      {wishlistOpen && <WishlistPanel onClose={() => setWishlistOpen(false)} onOpen={(p) => { setWishlistOpen(false); setProductModal(p); }} />}
      {cartOpen     && <CartPanel onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />}
      {profileOpen  && <ProfilePanel user={user} onClose={() => setProfileOpen(false)} onLogout={onLogout} onOpenWishlist={() => { setProfileOpen(false); setWishlistOpen(true); }} onOpenCart={() => { setProfileOpen(false); setCartOpen(true); }} />}
    </div>
  );
}