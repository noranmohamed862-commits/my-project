import { useState } from "react";

interface Props {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}

export default function GoldInput({ label, type, value, onChange, placeholder, error }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label style={{
        display: "block",
        fontFamily: "'Montserrat',sans-serif",
        fontSize: "0.58rem",
        letterSpacing: "0.18em",
        color: focused ? "#c9a84c" : "#6a6258",
        marginBottom: "0.35rem",
        textTransform: "uppercase",
        transition: "color 0.3s",
      }}>
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${error ? "#c0392b" : focused ? "rgba(201,168,76,0.65)" : "rgba(201,168,76,0.18)"}`,
            borderRadius: "1px",
            padding: "0.72rem 0.9rem",
            color: "#f0ece0",
            fontFamily: "'Montserrat',sans-serif",
            fontSize: "0.82rem",
            fontWeight: 300,
            outline: "none",
            transition: "border-color 0.3s",
            boxSizing: "border-box",
          }}
        />
        {/* animated bottom line */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: "translateX(-50%)", height: 1,
          background: "linear-gradient(90deg,transparent,#c9a84c,transparent)",
          width: focused ? "100%" : "0%",
          transition: "width 0.4s ease",
        }} />
      </div>

      {error && (
        <p style={{
          color: "#c0392b", fontSize: "0.67rem",
          marginTop: "0.22rem",
          fontFamily: "'Montserrat',sans-serif",
        }}>
          {error}
        </p>
      )}
    </div>
  );
}