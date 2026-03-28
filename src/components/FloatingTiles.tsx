import { useState, useEffect, useRef } from "react";


const IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
  "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&q=80",
  "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=400&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80",
  "https://images.unsplash.com/photo-1600950207944-0d63e8edbc3f?w=400&q=80",
];


const TILES = [
  { id:0,  x:1,  y:4,  w:140, h:190, delay:0,    dur:5000, img:0,  br:"3px",             rot:-2 },
  { id:1,  x:1,  y:36, w:120, h:160, delay:800,  dur:6000, img:4,  br:"3px",             rot:1  },
  { id:2,  x:1,  y:66, w:140, h:170, delay:1600, dur:5500, img:8,  br:"3px",             rot:-1 },
  { id:3,  x:13, y:2,  w:130, h:150, delay:400,  dur:6500, img:1,  br:"3px",             rot:2  },
  { id:4,  x:13, y:30, w:110, h:180, delay:1200, dur:5000, img:5,  br:"50% 3px 50% 3px", rot:0  },
  { id:5,  x:13, y:62, w:130, h:155, delay:2000, dur:7000, img:9,  br:"3px",             rot:-2 },
  { id:6,  x:72, y:3,  w:140, h:175, delay:600,  dur:5800, img:2,  br:"3px",             rot:1  },
  { id:7,  x:72, y:34, w:120, h:145, delay:1400, dur:6200, img:6,  br:"3px",             rot:-1 },
  { id:8,  x:72, y:62, w:140, h:170, delay:2200, dur:5200, img:10, br:"3px",             rot:2  },
  { id:9,  x:85, y:5,  w:130, h:160, delay:200,  dur:6800, img:3,  br:"3px",             rot:-2 },
  { id:10, x:85, y:34, w:110, h:185, delay:1000, dur:5600, img:7,  br:"50% 3px 3px 50%", rot:0  },
  { id:11, x:85, y:66, w:130, h:150, delay:1800, dur:7200, img:11, br:"3px",             rot:1  },
  { id:12, x:6,  y:88, w:100, h:100, delay:900,  dur:6000, img:12, br:"50%",             rot:0  },
  { id:13, x:88, y:88, w:100, h:100, delay:1700, dur:5400, img:13, br:"50%",             rot:0  },
  { id:14, x:26, y:88, w:90,  h:90,  delay:500,  dur:6600, img:14, br:"50%",             rot:0  },
  { id:15, x:70, y:88, w:90,  h:90,  delay:1300, dur:5800, img:15, br:"50%",             rot:0  },
];


function ImageTile({ t }: { t: typeof TILES[0] }) {
  const [cur,    setCur]    = useState(t.img % IMAGES.length);
  const [nxt,    setNxt]    = useState((t.img + 1) % IMAGES.length);
  const [fading, setFading] = useState(false);
  const [vis,    setVis]    = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVis(true), t.delay);
    return () => clearTimeout(id);
  }, [t.delay]);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCur(nxt);
        setNxt((n) => (n + 2) % IMAGES.length);
        setFading(false);
      }, 900);
    }, t.dur);
    return () => clearInterval(id);
  }, [t.dur, nxt]);

  return (
    <div style={{
      position: "absolute",
      left: `${t.x}%`, top: `${t.y}%`,
      width: t.w, height: t.h,
      borderRadius: t.br,
      overflow: "hidden",
      transform: `rotate(${t.rot}deg)`,
      opacity: vis ? 1 : 0,
      transition: `opacity 1.2s ease ${t.delay}ms`,
      boxShadow: "0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.1)",
    }}>
      <img src={IMAGES[cur]} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity: fading ? 0 : 1, transition:"opacity 0.9s ease", filter:"brightness(0.7) saturate(0.8)" }} />
      <img src={IMAGES[nxt]} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity: fading ? 1 : 0, transition:"opacity 0.9s ease", filter:"brightness(0.7) saturate(0.8)" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(201,168,76,0.07) 0%,transparent 60%)", pointerEvents:"none" }} />
    </div>
  );
}


function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const resize = () => { c.width = innerWidth; c.height = innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: 0.6 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.15 - Math.random() * 0.35,
      life: Math.random() * 200,
      max: 140 + Math.random() * 100,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.life++;
        if (p.life > p.max) { p.x = Math.random() * c.width; p.y = c.height + 5; p.life = 0; }
        const a = Math.sin((p.life / p.max) * Math.PI) * 0.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${a})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />;
}


export default function FloatingTiles() {
  return (
    <>
      <Particles />
      <div style={{ position:"fixed", inset:0, zIndex:1, pointerEvents:"none", overflow:"hidden" }}>
        {TILES.map((t) => <ImageTile key={t.id} t={t} />)}
      </div>
    </>
  );
}