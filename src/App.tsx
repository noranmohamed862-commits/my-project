import { useState, useCallback } from "react";
import { ThemeProvider }  from "./context/ThemeContext";
import { StoreProvider }  from "./context/StoreContext";
import FloatingTiles      from "./components/FloatingTiles";
import IntroScreen        from "./pages/IntroScreen";
import AuthPage           from "./pages/AuthPage";
import HomePage           from "./pages/HomePage";
import { type User, type Phase }    from "./types";

function AppInner() {
  const [phase,       setPhase]       = useState<Phase>("intro");
  const [authVisible, setAuthVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tilesOut,    setTilesOut]    = useState(false);

  const handleIntroDone = useCallback(() => {
    setPhase("auth");
    setTimeout(() => setAuthVisible(true), 80);
  }, []);

  const handleSuccess = (user: User) => {
    setAuthVisible(false);
    setTilesOut(true);
    setTimeout(() => {
      setCurrentUser(user);
      setPhase("home");
      setTilesOut(false);
    }, 900);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthVisible(false);
    setPhase("auth");
    setTimeout(() => setAuthVisible(true), 80);
  };

  return (
    <StoreProvider userEmail={currentUser?.email ?? ""}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; height: 100%; overflow: hidden; }
        input::placeholder { color: rgba(106,98,88,0.5); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #0a0a12 inset !important;
          -webkit-text-fill-color: #f0ece0 !important;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 2px; }
      `}</style>

      {phase !== "home" && (
        <div style={{ opacity: tilesOut ? 0 : 1, transition: "opacity 0.8s ease", position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <FloatingTiles />
        </div>
      )}

      {phase === "intro" && <IntroScreen onDone={handleIntroDone} />}
      {phase === "auth"  && <AuthPage visible={authVisible} onSuccess={handleSuccess} />}
      {phase === "home"  && currentUser && <HomePage user={currentUser} onLogout={handleLogout} />}
    </StoreProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}