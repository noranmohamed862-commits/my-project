import { useState, useEffect } from "react";

interface Props {
  onDone: () => void;
}

export default function IntroScreen({ onDone }: Props) {
  const [show, setShow] = useState(false);
  const [tag,  setTag]  = useState(false);
  const [out,  setOut]  = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 200);
    const t2 = setTimeout(() => setTag(true),  1400);
    const t3 = setTimeout(() => setOut(true),  2800);
    const t4 = setTimeout(() => onDone(),      3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  const corners: React.CSSProperties[] = [
    { top:28, left:28,  borderTop:"1px solid rgba(201,168,76,0.35)", borderLeft:"1px solid rgba(201,168,76,0.35)"  },
    { top:28, right:28, borderTop:"1px solid rgba(201,168,76,0.35)", borderRight:"1px solid rgba(201,168,76,0.35)" },
    { bottom:28, left:28,  borderBottom:"1px solid rgba(201,168,76,0.35)", borderLeft:"1px solid rgba(201,168,76,0.35)"  },
    { bottom:28, right:28, borderBottom:"1px solid rgba(201,168,76,0.35)", borderRight:"1px solid rgba(201,168,76,0.35)" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "#0a0a0f",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: out ? 0 : 1,
      transition: "opacity 0.8s ease",
      pointerEvents: out ? "none" : "auto",
    }}>
      {/* Corner brackets */}
      {corners.map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: 36, height: 36, ...s,
          opacity: show ? 1 : 0,
          transition: `opacity 0.8s ease ${0.7 + i * 0.1}s`,
        }} />
      ))}

      
      <div style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontWeight: 300,
        fontSize: "clamp(4rem,13vw,9.5rem)",
        letterSpacing: "0.45em",
        color: "#c9a84c",
        textShadow: "0 0 80px rgba(201,168,76,0.35), 0 0 160px rgba(201,168,76,0.12)",
        opacity: show ? 1 : 0,
        transform: show ? "scale(1)" : "scale(0.72)",
        transition: "opacity 1.6s cubic-bezier(0.16,1,0.3,1), transform 1.6s cubic-bezier(0.16,1,0.3,1)",
        position: "relative",
      }}>
        NEWRAN
        <div style={{
          position: "absolute", bottom: -10, left: "50%",
          transform: "translateX(-50%)", height: 1,
          background: "linear-gradient(90deg,transparent,#c9a84c,transparent)",
          width: show ? "80%" : "0%",
          transition: "width 1.2s ease 0.9s",
        }} />
      </div>


      <p style={{
        fontFamily: "'Montserrat',sans-serif",
        fontWeight: 200, fontSize: "0.65rem",
        letterSpacing: "0.55em", color: "#6a6258",
        marginTop: "2rem", textTransform: "uppercase",
        opacity: tag ? 1 : 0,
        transform: tag ? "translateY(0)" : "translateY(10px)",
        transition: "all 1s ease",
      }}>
        Premium Experience Awaits
      </p>
    </div>
  );
}