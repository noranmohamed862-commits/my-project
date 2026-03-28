import { useState, useEffect, useCallback } from "react";
import GoldInput from "./GoldInput";
import GoldButton from "./GoldButton";
import type { User, CardSide } from "../types";
import { getUsers, saveUsers } from "../types";

interface Props {
  onSuccess: (user: User) => void;
}

function LinkBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        fontFamily: "'Montserrat',sans-serif",
        fontSize: "0.72rem",
        color: "#c9a84c",
        cursor: "pointer",
        fontWeight: 400,
        letterSpacing: "0.05em",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

function CardHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: "1.5rem", flexShrink: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
          marginBottom: "0.5rem",
        }}
      >
        <div
          style={{ width: 24, height: 1, background: "#c9a84c", opacity: 0.6 }}
        />
        <span
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontSize: "0.57rem",
            letterSpacing: "0.32em",
            color: "#c9a84c",
            textTransform: "uppercase" as const,
          }}
        >
          {sub}
        </span>
      </div>
      <h2
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "2.1rem",
          fontWeight: 300,
          color: "#f0ece0",
          letterSpacing: "0.06em",
          lineHeight: 1.1,
        }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
    </div>
  );
}

export default function AuthCard({ onSuccess }: Props) {
  const [side, setSide] = useState<CardSide>("login");
  const [flipped, setFlipped] = useState(false);


  const [lEmail, setLEmail] = useState("");
  const [lPass, setLPass] = useState("");
  const [lErr, setLErr] = useState("");
  const [lLoad, setLLoad] = useState(false);

  
  const [rName, setRName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPass, setRPass] = useState("");
  const [rConfirm, setRConfirm] = useState("");
  const [rErr, setRErr] = useState<Record<string, string>>({});
  const [rLoad, setRLoad] = useState(false);

  const flipTo = useCallback((to: CardSide) => {
    setFlipped(to === "register");
    setTimeout(() => setSide(to), 450);
  }, []);

  
  useEffect(() => {
    if (getUsers().length === 0) setTimeout(() => flipTo("register"), 700);
  }, [flipTo]);

  const handleLogin = () => {
    setLErr("");
    if (!lEmail || !lPass) {
      setLErr("Please fill all fields");
      return;
    }
    setLLoad(true);
    setTimeout(() => {
      const found = getUsers().find(
        (u) => u.email === lEmail && u.password === lPass,
      );
      found ? onSuccess(found) : setLErr("Invalid email or password");
      setLLoad(false);
    }, 800);
  };

  const handleRegister = () => {
    const e: Record<string, string> = {};
    if (!rName.trim()) e.name = "Name is required";
    if (!rEmail.includes("@")) e.email = "Invalid email";
    if (rPass.length < 6) e.pass = "Min 6 characters";
    if (rPass !== rConfirm) e.confirm = "Passwords don't match";
    setRErr(e);
    if (Object.keys(e).length) return;

    setRLoad(true);
    setTimeout(() => {
      const users = getUsers();
      if (users.find((u) => u.email === rEmail)) {
        setRErr({ email: "Email already registered" });
        setRLoad(false);
        return;
      }
      saveUsers([...users, { email: rEmail, password: rPass, name: rName }]);
      setRLoad(false);
      setRName("");
      setREmail("");
      setRPass("");
      setRConfirm("");
      flipTo("login");
    }, 900);
  };

  const face: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    background: "rgba(8,7,16,0.83)",
    backdropFilter: "blur(32px)",
    border: "1px solid rgba(201,168,76,0.18)",
    borderRadius: "2px",
    padding: "2rem 2.2rem",
    display: "flex",
    flexDirection: "column",
    boxShadow:
      "0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(201,168,76,0.08)",
    boxSizing: "border-box",
    overflowY: "auto",
  };

  const footer = (text: string, linkLabel: string, to: CardSide) => (
    <div
      style={{
        borderTop: "1px solid rgba(201,168,76,0.1)",
        paddingTop: "1rem",
        textAlign: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "'Montserrat',sans-serif",
          fontSize: "0.72rem",
          color: "#6a6258",
          fontWeight: 300,
        }}
      >
        {text}{" "}
      </span>
      <LinkBtn onClick={() => flipTo(to)}>{linkLabel}</LinkBtn>
    </div>
  );

  return (
    <div style={{ perspective: "1200px", width: "100%", maxWidth: 400 }}>
     
      <div
        style={{
          height: 2,
          background: "linear-gradient(90deg,transparent,#c9a84c,transparent)",
          opacity: 0.5,
          marginBottom: 2,
        }}
      />

      <div
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.9s cubic-bezier(0.4,0,0.2,1)",
          height: side === "register" ? 570 : 465,
        }}
      >
      
        <div style={face}>
          <CardHeader
            title="Sign <span style='color:#c9a84c'>In</span>"
            sub="Welcome Back"
          />
          <GoldInput
            label="Email"
            type="email"
            value={lEmail}
            onChange={setLEmail}
            placeholder="you@example.com"
          />
          <GoldInput
            label="Password"
            type="password"
            value={lPass}
            onChange={setLPass}
            placeholder="••••••••"
            error={lErr}
          />
          <div
            style={{
              marginTop: "0.8rem",
              marginBottom: "1.1rem",
              flexShrink: 0,
            }}
          >
            <GoldButton onClick={handleLogin} loading={lLoad}>
              Enter NEWRAN
            </GoldButton>
          </div>
          {footer("New to NEWRAN?", "Create Account", "register")}
        </div>

        
        <div style={{ ...face, transform: "rotateY(180deg)" }}>
          <CardHeader
            title="Create <span style='color:#c9a84c'>Account</span>"
            sub="Join the Elite"
          />
          <GoldInput
            label="Full Name"
            type="text"
            value={rName}
            onChange={setRName}
            placeholder="Your Name"
            error={rErr.name}
          />
          <GoldInput
            label="Email"
            type="email"
            value={rEmail}
            onChange={setREmail}
            placeholder="you@example.com"
            error={rErr.email}
          />
          <GoldInput
            label="Password"
            type="password"
            value={rPass}
            onChange={setRPass}
            placeholder="Min 6 characters"
            error={rErr.pass}
          />
          <GoldInput
            label="Confirm Password"
            type="password"
            value={rConfirm}
            onChange={setRConfirm}
            placeholder="Repeat password"
            error={rErr.confirm}
          />
          <div
            style={{
              marginTop: "0.5rem",
              marginBottom: "1.1rem",
              flexShrink: 0,
            }}
          >
            <GoldButton onClick={handleRegister} loading={rLoad}>
              Join NEWRAN
            </GoldButton>
          </div>
          {footer("Already a member?", "Sign In", "login")}
        </div>
      </div>
    </div>
  );
}
