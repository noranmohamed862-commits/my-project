import { useState } from "react";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
}

export default function GoldButton({ children, onClick, loading = false }: Props) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: "100%",
        padding: "0.88rem",
        background: h
          ? "linear-gradient(135deg,#e8d5a3,#c9a84c)"
          : "linear-gradient(135deg,#8b6914,#c9a84c)",
        border: "none",
        borderRadius: "1px",
        color: "#0a0a0f",
        fontFamily: "'Montserrat',sans-serif",
        fontSize: "0.67rem",
        fontWeight: 500,
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        transform: h ? "translateY(-1px)" : "translateY(0)",
        boxShadow: h
          ? "0 10px 40px rgba(201,168,76,0.4)"
          : "0 4px 20px rgba(201,168,76,0.15)",
        opacity: loading ? 0.7 : 1,
        boxSizing: "border-box",
      }}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}