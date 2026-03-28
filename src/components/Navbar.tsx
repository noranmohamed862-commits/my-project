import { useState } from "react";
import { type User } from "../types";
import { useTheme } from "../context/ThemeContext";
import { useStore } from "../context/StoreContext";

interface Props {
  user: User;
  onLogout: () => void;
  onWishlistOpen: () => void;
  onCartOpen: () => void;
  onProfileOpen: () => void;
  onCategoryClick: (cat: string) => void;
}

const NAV_LINKS = [
  { label: "Women",        cat: "women's clothing"},
  { label: "Men",          cat: "men's clothing"  },
  { label: "Accessories",  cat: "jewelery"        },
  { label: "Electronics",  cat: "electronics"     },
];

export default function Navbar({ user, onLogout, onWishlistOpen, onCartOpen, onProfileOpen, onCategoryClick }: Props) {
  const { c, isDark, toggle } = useTheme();
  const { cartCount, wishCount, searchQuery, setSearch } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const txtColor = isDark ? "rgba(240,236,224,0.6)" : "rgba(26,22,16,0.6)";
  const iconColor = isDark ? "rgba(240,236,224,0.7)" : "rgba(26,22,16,0.65)";

  return (
    <>
      <style>{`
        @keyframes navSlide{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}
        .nl{font-family:'Montserrat',sans-serif;font-size:0.59rem;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;transition:color 0.25s;background:none;border:none;padding:2px 0;position:relative;}
        .nl::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:#c9a84c;transition:width 0.3s ease;}
        .nl:hover{color:#c9a84c !important;}
        .nl:hover::after{width:100%;}
        .ib{background:none;border:none;cursor:pointer;padding:6px;transition:color 0.25s;position:relative;display:flex;align-items:center;justify-content:center;}
        .ib:hover{color:#c9a84c !important;}
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 64,
        background: c.navBg, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${c.border}`,
        display: "flex", alignItems: "center", padding: "0 2.5rem", gap: "1rem",
        animation: "navSlide 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both",
        transition: "background 0.4s, border-color 0.4s",
      }}>

        
        <div onClick={() => onCategoryClick("")}
          style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: "1.55rem", letterSpacing: "0.35em", color: "#c9a84c", cursor: "pointer", flexShrink: 0 }}>
          NEWRAN
        </div>

        
        <div style={{ display: "flex", gap: "1.6rem", marginLeft: "1rem", flex: 1 }}>
          {NAV_LINKS.map((l) => (
            <button key={l.label} className="nl" style={{ color: txtColor }}
              onClick={() => { if (l.cat) onCategoryClick(l.cat); }}>
              {l.label}
            </button>
          ))}
        </div>

        
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {searchOpen && (
            <input autoFocus value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
              placeholder="Search products..."
              style={{ background: c.inputBg, border: `1px solid ${c.borderHover}`, borderRadius: "1px", padding: "0.38rem 0.8rem", color: c.text, fontFamily: "'Montserrat',sans-serif", fontSize: "0.74rem", outline: "none", width: 200, transition: "all 0.3s" }}
            />
          )}
          <button className="ib" style={{ color: iconColor }}
            onClick={() => { setSearchOpen(!searchOpen); if (searchOpen) setSearch(""); }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </button>
        </div>

        
        <button className="ib" style={{ color: iconColor }} onClick={toggle} title="Toggle theme">
          {isDark ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

       
        <button className="ib" style={{ color: iconColor }} onClick={onWishlistOpen}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {wishCount > 0 && <Badge count={wishCount} />}
        </button>

        
        <button className="ib" style={{ color: iconColor }} onClick={onCartOpen}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartCount > 0 && <Badge count={cartCount} />}
        </button>

        
        <button className="ib" onClick={onProfileOpen}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#8b6914,#c9a84c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", fontWeight: 600, color: "#0a0a0f", boxShadow: "0 0 14px rgba(201,168,76,0.3)", transition: "box-shadow 0.3s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 22px rgba(201,168,76,0.6)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 14px rgba(201,168,76,0.3)"; }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        </button>
      </nav>
    </>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <span style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "#c9a84c", color: "#0a0a0f", fontFamily: "'Montserrat',sans-serif", fontSize: "0.52rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {count > 9 ? "9+" : count}
    </span>
  );
}