import AuthCard from "../components/AuthCard";
import type { User } from "../types";

interface Props {
  visible: boolean;
  onSuccess: (user: User) => void;
}

export default function AuthPage({ visible, onSuccess }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "stretch",
        opacity: visible ? 1 : 0,
        transition: "opacity 1s ease",
        overflow: "hidden",
      }}
    >
      
      <div
        style={{
          flex: "0 0 50%",
          maxWidth: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          borderRight: "1px solid rgba(201,168,76,0.07)",
          position: "relative",
          overflow: "hidden",
        }}
      >
       
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,10,15,0.6)",
            backdropFilter: "blur(3px)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        >
          <div
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: "0.52rem",
              letterSpacing: "0.5em",
              color: "rgba(201,168,76,0.65)",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Est. 2025
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontWeight: 300,
              fontSize: "clamp(3rem,7vw,6.5rem)",
              letterSpacing: "0.45em",
              color: "#c9a84c",
              lineHeight: 1,
              textShadow: "0 0 50px rgba(201,168,76,0.2)",
            }}
          >
            NEWRAN
          </h1>

          <div
            style={{
              width: "65%",
              height: 1,
              margin: "1.2rem auto",
              background:
                "linear-gradient(90deg,transparent,rgba(201,168,76,0.5),transparent)",
            }}
          />

          <p
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 200,
              fontSize: "0.6rem",
              letterSpacing: "0.4em",
              color: "#6a6258",
              textTransform: "uppercase",
              lineHeight: 2.2,
            }}
          >
            Curated Luxury
            <br />
            <span style={{ color: "rgba(201,168,76,0.35)" }}>◆</span> Premium
            Selection <span style={{ color: "rgba(201,168,76,0.35)" }}>◆</span>
          </p>


          <div
            style={{ position: "relative", marginTop: "2.5rem", height: 80 }}
          >
            <style>{`@keyframes rp{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.2}50%{transform:translate(-50%,-50%) scale(1.08);opacity:.65}}`}</style>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 44 + i * 28,
                  height: 44 + i * 28,
                  border: "1px solid rgba(201,168,76,0.15)",
                  borderRadius: "50%",
                  top: "50%",
                  left: "50%",
                  animation: `rp ${3 + i * 0.8}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: 7,
                height: 7,
                background: "#c9a84c",
                borderRadius: "50%",
                boxShadow: "0 0 18px rgba(201,168,76,0.9)",
              }}
            />
          </div>
        </div>
      </div>


      <div
        style={{
          flex: "0 0 50%",
          maxWidth: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,10,15,0.6)",
            backdropFilter: "blur(3px)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(40px)",
            transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s",
          }}
        >
          <AuthCard onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}
