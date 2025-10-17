
import { useEffect, useRef, useState } from "react";


const LS_KEY = "asterium_meteordodger_best_v1";

const METEOR_TYPES = {
  NORMAL: { color: "#f59e0b", speed: 1.0, size: 1.0, score: 1 },
  FIRE:   { color: "#ef4444", speed: 1.7, size: 0.9, score: 2 },
  ICE:    { color: "#3b82f6", speed: 0.7, size: 1.3, score: 2 },
};

export default function MeteorDodger() {
  const canvasRef = useRef(null);

  // HUD
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem(LS_KEY) || 0); } catch { return 0; }
  });
  const [running, setRunning] = useState(true);
  const runningRef = useRef(true); // fuente de verdad en el loop
  const [gameOver, setGameOver] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(1); // solo para HUD

  // Tiempo (pausa real)
  const startRef = useRef(performance.now());
  const pausedAtRef = useRef(null);

  // Controles
  const keysRef = useRef(new Set());
  const touchRef = useRef({ left: false, right: false });

  // === Audio (añadido) ===
  const bgAudioRef = useRef(null);
  const loseAudioRef = useRef(null);
  const [musicOn, setMusicOn] = useState(true);

  const toggleMusic = () => {
    const a = bgAudioRef.current;
    if (!a) return;
    if (musicOn) { a.pause(); setMusicOn(false); }
    else {
      a.volume = 0.35;
      a.loop = true;
      a.play().catch(() => {});
      setMusicOn(true);
    }
  };

  // Intenta iniciar la música tras la primera interacción del usuario
  useEffect(() => {
    const kick = () => {
      const a = bgAudioRef.current;
      if (a && musicOn && a.paused) {
        a.volume = 0.35;
        a.loop = true;
        a.play().catch(() => {});
      }
      window.removeEventListener("click", kick);
      window.removeEventListener("keydown", kick);
    };
    window.addEventListener("click", kick);
    window.addEventListener("keydown", kick);
    return () => {
      window.removeEventListener("click", kick);
      window.removeEventListener("keydown", kick);
    };
  }, [musicOn]);

  // --- Gapless loop hack (evita micro-corte de MP3) ---
  useEffect(() => {
    const a = bgAudioRef.current;
    if (!a) return;
    const LOOP_FIX_AHEAD = 0.12;   // cuánto antes del final re-saltamos
    const LOOP_RESTART_AT = 0.02;  // punto de reanudación
    const fixGap = () => {
      if (!a.paused && a.duration && a.currentTime > a.duration - LOOP_FIX_AHEAD) {
        a.currentTime = LOOP_RESTART_AT;
        a.play().catch(() => {});
      }
    };
    a.addEventListener("timeupdate", fixGap);
    return () => a.removeEventListener("timeupdate", fixGap);
  }, []);

  useEffect(() => { runningRef.current = running; }, [running]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    // Tamaño
    let w, h, raf;
    function resize() {
      const maxW = Math.min(window.innerWidth, 980);
      const maxH = Math.min(window.innerHeight - 120, 720);
      w = canvas.width  = Math.max(360, Math.floor(maxW));
      h = canvas.height = Math.max(440, Math.floor(maxH));
    }
    resize();
    window.addEventListener("resize", resize);

    // Entidades
    const player = { x: w / 2, y: h - 72, r: 15, vx: 0 };
    const meteors = [];
    const particles = []; // estelas FIRE + propulsor
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.9 + 0.1,
      tw: Math.random() * Math.PI * 2,
    }));
    const comets = []; // estrellas fugaces

    // Teclado
    function onKeyDown(e) {
      if (["ArrowLeft","ArrowRight","a","d","A","D"].includes(e.key)) keysRef.current.add(e.key);
      if (e.key === " ") { e.preventDefault(); togglePause(); }
      if (e.key === "Enter" && gameOver) restart();
    }
    function onKeyUp(e) { keysRef.current.delete(e.key); }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Spawns
    let lastSpawn = 0;
    let lastComet = 0;

    const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
    const collides = (ax,ay,ar,bx,by,br) => Math.hypot(ax-bx, ay-by) <= ar+br-1.5;
    const rand = (a,b) => a + Math.random() * (b - a);

    // Progresión rápida para demo:
    // L2 a 10s, L3 a 30s, luego cada 20s (50, 70, 90…).
    function computeLevel(ms) {
      if (ms < 10000) return 1;
      if (ms < 30000) return 2;
      return 3 + Math.floor((ms - 30000) / 20000);
    }

    function pickMeteorType(levelNow) {
      if (levelNow <= 1) return "NORMAL";
      if (levelNow === 2) return Math.random() < 0.6 ? "FIRE" : "NORMAL";
      // >=3 mezcla de los tres; FIRE/ICE suben con nivel
      const fireP = Math.min(0.5, 0.35 + (levelNow - 3) * 0.04);
      const iceP  = Math.min(0.4, 0.25 + (levelNow - 3) * 0.035);
      const r = Math.random();
      if (r < fireP) return "FIRE";
      if (r < fireP + iceP) return "ICE";
      return "NORMAL";
    }

    function spawnMeteor(t, levelNow) {
      const type = pickMeteorType(levelNow);
      const spec = METEOR_TYPES[type];
      const r = rand(12, 22) * spec.size;
      const vy = (2.0 + rand(0, 1.2) + levelNow * 0.33) * spec.speed; // un pelín más agresivo
      const vx = (Math.random() - 0.5) * (0.8 + levelNow * 0.22);
      meteors.push({
        type, x: rand(30, w - 30), y: -20, r, vy, vx,
        rot: rand(0, Math.PI * 2), rotSpeed: (Math.random() - 0.5) * 0.06,
      });
    }

    function spawnComet() {
      const fromLeft = Math.random() < 0.5;
      comets.push({
        x: fromLeft ? -40 : w + 40,
        y: rand(30, h * 0.5),
        vx: fromLeft ? rand(2.6, 3.4) : -rand(2.6, 3.4),
        vy: rand(1.1, 1.7),
        life: 4200,
      });
    }

    function loop(t) {
      // Tiempo efectivo (sin pausa)
      const ms = t - startRef.current;
      setElapsed(ms);
      const levelNow = computeLevel(ms);
      if (levelNow !== level) setLevel(levelNow);

      // Fondo + nebulosas
      ctx.fillStyle = "#050814";
      ctx.fillRect(0, 0, w, h);
      const nebPulse = (Math.sin(t * 0.0013) + 1) / 2;
      const g1 = ctx.createRadialGradient(w*0.25, h*0.3, 60, w*0.25, h*0.3, Math.max(w,h));
      g1.addColorStop(0, `rgba(59,130,246,${0.12 + nebPulse * 0.06})`);
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1; ctx.fillRect(0,0,w,h);
      const g2 = ctx.createRadialGradient(w*0.8, h*0.75, 60, w*0.8, h*0.75, Math.max(w,h));
      g2.addColorStop(0, `rgba(168,85,247,${0.12 + (1 - nebPulse) * 0.06})`);
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2; ctx.fillRect(0,0,w,h);

      // Estrellas con twinkle
      for (const s of stars) {
        s.x -= (0.35 + s.z * 0.7);
        if (s.x < 0) { s.x = w; s.y = Math.random() * h; }
        s.tw += 0.02 + s.z * 0.02;
        const a = 0.35 + Math.sin(s.tw) * 0.25 * s.z;
        ctx.globalAlpha = clamp(a, 0.05, 0.9);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(s.x, s.y, 1.1, 1.1);
      }
      ctx.globalAlpha = 1;

      // Si está pausado, no simular
      if (!runningRef.current) { raf = requestAnimationFrame(loop); return; }

      // Input
      const keys = keysRef.current;
      const left  = keys.has("ArrowLeft") || keys.has("a") || keys.has("A") || touchRef.current.left;
      const right = keys.has("ArrowRight") || keys.has("d") || keys.has("D") || touchRef.current.right;
      player.vx = (right ? 1 : 0) - (left ? 1 : 0);
      const speed = 6.2 + Math.min(6.8, levelNow * 1.05);
      player.x += player.vx * speed;
      player.x = clamp(player.x, player.r + 8, w - player.r - 8);

      // Spawns: meteors (usa levelNow)
      // Arranca más intenso para la demo
      const baseInterval = 420;
      const interval = Math.max(90, baseInterval - levelNow * 34);
      if (t - lastSpawn > interval) { lastSpawn = t; spawnMeteor(t, levelNow); }

      // Spawns: cometas (3–6s)
      if (t - lastComet > 3000 + Math.random() * 3000) { lastComet = t; spawnComet(); }

      // Update meteors
      for (const m of meteors) {
        m.y += m.vy;
        m.x += m.vx;
        m.rot += m.rotSpeed;

        // Estela FIRE
        if (m.type === "FIRE" && Math.random() < 0.6) {
          particles.push({
            x: m.x, y: m.y + m.r * 0.2,
            vx: (Math.random() - 0.5) * 0.6, vy: 1.6 + Math.random() * 1.1,
            life: 0.45, decay: 0.05, color: Math.random() < 0.5 ? "#ff9e3a" : "#ef4444", size: 2 + Math.random() * 2
          });
        }
        // Cristales ICE
        if (m.type === "ICE" && Math.random() < 0.3) {
          particles.push({
            x: m.x + (Math.random() - 0.5) * m.r, y: m.y + (Math.random() - 0.5) * m.r,
            vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
            life: 0.6, decay: 0.03, color: "#93c5fd", size: 1.6
          });
        }
      }

      // Offscreen + puntos
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (m.y > h + 60 || m.x < -80 || m.x > w + 80) {
          meteors.splice(i, 1);
          setScore(s => s + (METEOR_TYPES[m.type]?.score ?? 1));
        }
      }

      // Colisiones
      for (const m of meteors) {
        const dx = m.x - player.x, dy = m.y - player.y;
        if (Math.hypot(dx, dy) <= m.r + player.r - 2) { gameEnd(); break; }
      }

      // Update comets (estrellas fugaces)
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += c.vx; c.y += c.vy; c.life -= 16;
        if (c.life <= 0 || c.x < -120 || c.x > w + 120 || c.y > h + 120) comets.splice(i, 1);
      }

      // Partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // ===== Render meteors
      for (const m of meteors) {
        // glow
        const glow = ctx.createRadialGradient(m.x, m.y, m.r * 0.2, m.x, m.y, m.r * 2.3);
        glow.addColorStop(0, "rgba(255,255,255,0.14)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 2.3, 0, Math.PI * 2); ctx.fill();

        // cuerpo + cráter
        ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(m.rot);
        ctx.fillStyle = METEOR_TYPES[m.type].color;
        ctx.beginPath(); ctx.arc(0, 0, m.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fde68a";
        ctx.beginPath(); ctx.arc(-m.r * 0.3, -m.r * 0.25, m.r * 0.35, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Partículas (fuego y propulsor)
      for (const p of particles) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Cometas (estrellas fugaces)
      for (const c of comets) {
        const tail = ctx.createLinearGradient(c.x - c.vx * 20, c.y - c.vy * 20, c.x, c.y);
        tail.addColorStop(0, "rgba(148,163,184,0)");
        tail.addColorStop(1, "rgba(148,163,184,0.8)");
        ctx.strokeStyle = tail; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(c.x - c.vx * 18, c.y - c.vy * 18); ctx.lineTo(c.x, c.y); ctx.stroke();
        ctx.fillStyle = "#e2e8f0";
        ctx.beginPath(); ctx.arc(c.x, c.y, 3, 0, Math.PI * 2); ctx.fill();
      }

      // ===== NAVE (cohete)
      {
        // partículas del propulsor
        if (Math.random() < 0.7) {
          particles.push({
            x: player.x + (Math.random() - 0.5) * 8,
            y: player.y + player.r * 0.85,
            vx: (Math.random() - 0.5) * 1.2,
            vy: 2 + Math.random() * 2,
            life: 0.6, decay: 0.04,
            color: Math.random() > 0.5 ? "#7c3aed" : "#a78bfa",
            size: 2 + Math.random() * 2
          });
        }

        // glow
        const glow = ctx.createRadialGradient(player.x, player.y, 8, player.x, player.y, 50);
        glow.addColorStop(0, "rgba(124,58,237,0.5)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(player.x, player.y, 50, 0, Math.PI * 2); ctx.fill();

        // cuerpo con gradiente
        ctx.save(); ctx.translate(player.x, player.y);
        const bodyGrad = ctx.createLinearGradient(-player.r, 0, player.r, 0);
        bodyGrad.addColorStop(0, "#7c3aed"); bodyGrad.addColorStop(0.5, "#a78bfa"); bodyGrad.addColorStop(1, "#7c3aed");
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(0, -player.r * 1.1);
        ctx.lineTo(player.r * 0.85, player.r * 0.2);
        ctx.lineTo(player.r * 0.5, player.r * 1.1);
        ctx.lineTo(-player.r * 0.5, player.r * 1.1);
        ctx.lineTo(-player.r * 0.85, player.r * 0.2);
        ctx.closePath(); ctx.fill();

        // detalle y cabina
        ctx.strokeStyle = "#c4b5fd"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-player.r * 0.4, -player.r * 0.3); ctx.lineTo(player.r * 0.4, -player.r * 0.3); ctx.stroke();
        const cockpit = ctx.createRadialGradient(0, -player.r * 0.3, 0, 0, -player.r * 0.3, player.r * 0.5);
        cockpit.addColorStop(0, "#e9d5ff"); cockpit.addColorStop(1, "#c4b5fd");
        ctx.fillStyle = cockpit; ctx.beginPath(); ctx.arc(0, -player.r * 0.2, player.r * 0.45, 0, Math.PI * 2); ctx.fill();

        // alas
        ctx.fillStyle = "#6d28d9";
        ctx.beginPath(); ctx.moveTo(-player.r * 0.85, player.r * 0.2); ctx.lineTo(-player.r * 1.3, player.r * 0.5); ctx.lineTo(-player.r * 0.9, player.r * 0.8); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(player.r * 0.85, player.r * 0.2); ctx.lineTo(player.r * 1.3, player.r * 0.5); ctx.lineTo(player.r * 0.9, player.r * 0.8); ctx.closePath(); ctx.fill();

        // llamas
        const thrust = ctx.createLinearGradient(0, player.r * 0.9, 0, player.r * 1.6);
        thrust.addColorStop(0, "#a78bfa"); thrust.addColorStop(0.5, "#7c3aed"); thrust.addColorStop(1, "rgba(124,58,237,0)");
        ctx.fillStyle = thrust;
        ctx.beginPath(); ctx.moveTo(-player.r * 0.4, player.r * 0.95); ctx.lineTo(-player.r * 0.3, player.r * 1.5); ctx.lineTo(-player.r * 0.2, player.r * 0.95); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(player.r * 0.4, player.r * 0.95); ctx.lineTo(player.r * 0.3, player.r * 1.5); ctx.lineTo(player.r * 0.2, player.r * 0.95); ctx.closePath(); ctx.fill();

        ctx.restore();
      }

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    function gameEnd() {
      runningRef.current = false;
      setRunning(false);
      setGameOver(true);

      // reproducir sonido de perder (añadido)
      try {
        if (loseAudioRef.current) {
          loseAudioRef.current.currentTime = 0;
          loseAudioRef.current.play().catch(() => {});
        }
      } catch {}

      // parar música de fondo y dejarla al inicio (añadido)
      try {
        if (bgAudioRef.current) {
          bgAudioRef.current.pause();
          bgAudioRef.current.currentTime = 0;
        }
      } catch {}

      setBest(prev => {
        const next = Math.max(prev, score);
        try { localStorage.setItem(LS_KEY, String(next)); } catch {}
        return next;
      });
    }

    function togglePause() {
      if (gameOver) return;
      if (runningRef.current) {
        pausedAtRef.current = performance.now();
        runningRef.current = false;
        setRunning(false);
        // pausa música al pausar (añadido)
        bgAudioRef.current?.pause();
      } else {
        const now = performance.now();
        const pausedMs = now - (pausedAtRef.current ?? now);
        startRef.current += pausedMs; // compensar tiempo pausado
        runningRef.current = true;
        setRunning(true);
        // reanuda música si el usuario la tiene activada (añadido)
        if (musicOn && bgAudioRef.current) {
          bgAudioRef.current.volume = 0.35;
          bgAudioRef.current.play().catch(() => {});
        }
      }
    }

    function restart() {
      setScore(0); setGameOver(false); setLevel(1); setElapsed(0);
      startRef.current = performance.now();
      pausedAtRef.current = null;
      runningRef.current = true;
      setRunning(true);
      // arrays internos se vacían en el siguiente frame (reinicio suave)

      // si la música está activada, reanudar al reiniciar (añadido)
      if (musicOn && bgAudioRef.current) {
        bgAudioRef.current.currentTime = 0;
        bgAudioRef.current.volume = 0.35;
        bgAudioRef.current.play().catch(() => {});
      }
    }

    (window)._md_controls = { togglePause, restart };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, musicOn]);

  // Botones
  const onPause = () => window._md_controls?.togglePause();
  const onRestart = () => window._md_controls?.restart();

  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const levelLabel = String(level).padStart(2, "0");

  return (
    <main className="relative min-h-[100dvh] bg-black text-white overflow-hidden">
      {/* Nebulosas de fondo (CSS) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(1000px 600px at 20% 30%, rgba(59,130,246,0.12), transparent 60%),
            radial-gradient(900px 500px at 80% 65%, rgba(168,85,247,0.14), transparent 60%),
            radial-gradient(700px 700px at 50% -10%, rgba(236,72,153,0.10), transparent 60%),
            #000
          `
        }}
      />

      {/* HUD dividido: izquierda (título+chips) / derecha (puntos+botones) */}
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-2 flex items-start justify-between gap-4">
        {/* Izquierda */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Meteor Asterium
          </h1>
          <p className="text-slate-300 text-sm mt-1">
                Esquiva meteoritos en un arcade espacial súper rápido y visual. Sobrevive lo máximo posible mientras sube la dificultad y se desbloquean nuevos tipos de meteoritos.          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur text-sm">
              Nivel <b className="tabular-nums">{levelLabel}</b>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur text-sm">
              Tiempo <b className="tabular-nums">
                {minutes.toString().padStart(2,"0")}:{seconds.toString().padStart(2,"0")}
              </b>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur text-sm">Puntos <b className="tabular-nums">{score}</b></span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur text-sm">Mejor <b className="tabular-nums">{best}</b></span>
          </div>
        </div>

        {/* Derecha */}
        <div className="flex flex-col items-end gap-2 mt-8 sm:mt-10">
          <div className="flex gap-2">
            <button onClick={onPause} className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm">
              {running ? "Pausar" : "Reanudar"}
            </button>
            <button onClick={onRestart} className="px-3 py-1 rounded-lg bg-white/10 text-sm">Reiniciar</button>
            <button
              onClick={toggleMusic}
              className="px-3 py-1 rounded-lg bg-white/10 text-sm"
              aria-pressed={musicOn}
              title={musicOn ? "Silenciar música" : "Activar música"}
            >
              {musicOn ? "🔊 Música" : "🔇 Música"}
            </button>
          </div>
        </div>
      </div>

      {/* Canvas + overlays */}
      <div className="mx-auto max-w-5xl px-4 pb-10">
        <div className="relative mx-auto w-[min(92vw,980px)] rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900">
          <canvas ref={canvasRef} className="block w-full h-full" />
          {!running && !gameOver && (
            <div className="absolute inset-0 grid place-items-center bg-black/40 backdrop-blur-sm">
              <div className="px-5 py-3 rounded-xl bg-white/10 border border-white/10">
                <p className="text-slate-200">⏸️ Pausa</p>
                <p className="text-slate-400 text-sm">Espacio o “Reanudar”</p>
              </div>
            </div>
          )}
          {gameOver && (
            <div className="absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-sm">
              <div className="px-6 py-5 rounded-2xl bg-white/10 border border-white/10 text-center">
                <h2 className="text-xl font-medium mb-2">💥 ¡Impacto!</h2>
                <p className="text-slate-300">Puntos: <b>{score}</b> · Mejor: <b>{Math.max(best, score)}</b></p>
                <div className="mt-4 flex justify-center gap-2">
                  <button onClick={onRestart} className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500">Reintentar (Enter)</button>
                  <button onClick={() => navigator.clipboard.writeText(`${window.location.href}?score=${score}`)} className="px-3 py-1 rounded-lg bg-white/10">Compartir</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controles táctiles */}
        <div className="mt-4 flex justify-center gap-4 sm:hidden select-none">
          <button
            onTouchStart={() => (touchRef.current.left = true)}
            onTouchEnd={() => (touchRef.current.left = false)}
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/10"
          >⬅️</button>
          <button
            onTouchStart={() => (touchRef.current.right = true)}
            onTouchEnd={() => (touchRef.current.right = false)}
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/10"
          >➡️</button>
        </div>

        <p className="text-center text-slate-400 text-xs mt-3">
          Controles: ← → o A/D · Pausa: Espacio · Reiniciar: Enter
        </p>
      </div>

      {/* === Audio elements (añadido) === */}
      <audio
        ref={bgAudioRef}
        src="/public/alien-song-323613.mp3"
        preload="auto"
        playsInline
      />
      <audio
        ref={loseAudioRef}
        src="/public/080047_lose_funny_retro_video-game-80925.mp3"
        preload="auto"
        playsInline
      />
    </main>
  );
}
