// import { useEffect, useRef, useState } from "react";

// /** Meteor Dodger — Asterium (v2)
//  *  - Nivel = 1 + floor(ms/30000)
//  *  - Tipos de meteorito: NORMAL / FIRE / ICE
//  *  - Obstáculos: ondas de energía, campos de asteroides, cometas
//  *  - Power-ups: SHIELD (escudo), SLOW (ralentización)
//  *  - Gráficos: nebulosas, starfield, partículas, propulsores y escudo
//  */

// const LS_KEY = "asterium_meteordodger_best_v2";

// const METEOR_TYPES = {
//   NORMAL: { color: "#f59e0b", glow: "#ff9e3a", speed: 1, size: 1, score: 1 },
//   FIRE:   { color: "#ef4444", glow: "#ff3a3a", speed: 1.8, size: 0.85, score: 3 },
//   ICE:    { color: "#3b82f6", glow: "#46b6ff", speed: 0.65, size: 1.35, score: 2 },
// };

// const POWERUPS = {
//   SHIELD: { id: "SHIELD", color: "#60a5fa", dur: 4500 },
//   SLOW:   { id: "SLOW",   color: "#a78bfa", dur: 3500 }, // frena todo
// };

// export default function MeteorDodger() {
//   const canvasRef = useRef(null);

//   // HUD
//   const [score, setScore] = useState(0);
//   const [best, setBest] = useState(() => {
//     try { return Math.max(Number(sessionStorage.getItem(LS_KEY) || 0), 0); }
//     catch { return 0; }
//   });
//   const [running, setRunning] = useState(true);
//   const [gameOver, setGameOver] = useState(false);
//   const [startedAt, setStartedAt] = useState(() => performance.now());
//   const [elapsed, setElapsed] = useState(0);
//   const [level, setLevel] = useState(1);

//   // Buffs visibles en HUD
//   const [shieldMs, setShieldMs] = useState(0);
//   const [slowMs, setSlowMs] = useState(0);

//   // Controles
//   const keysRef = useRef(new Set());
//   const touchRef = useRef({ left: false, right: false });

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d", { alpha: false });

//     // ===== tamaño
//     let w, h, raf;
//     function resize() {
//       const maxW = Math.min(window.innerWidth, 980);
//       const maxH = Math.min(window.innerHeight - 120, 720);
//       w = canvas.width = Math.max(360, Math.floor(maxW));
//       h = canvas.height = Math.max(440, Math.floor(maxH));
//     }
//     resize();
//     window.addEventListener("resize", resize);

//     // ===== entidades
//     const player = { x: w / 2, y: h - 72, r: 15, vx: 0, shield: 0 };
//     const meteors = [];
//     const particles = [];         // propulsión, fuego, hielo
//     const stars = Array.from({ length: 180 }, () => ({
//       x: Math.random() * w, y: Math.random() * h, z: Math.random() * 0.9 + 0.1, tw: Math.random() * Math.PI * 2
//     }));
//     const energyWaves = [];       // { y, height, vy, life }
//     const comets = [];            // { x,y,vx,vy,life }
//     const asteroidFields = [];    // { y, rocks:[{x,r}], vy }

//     // ===== teclado
//     function onKeyDown(e) {
//       if (["ArrowLeft", "ArrowRight", "a", "d", "A", "D"].includes(e.key)) keysRef.current.add(e.key);
//       if (e.key === " ") { e.preventDefault(); if (!gameOver) setRunning(r => !r); }
//       if (e.key === "Enter" && gameOver) doRestart();
//     }
//     function onKeyUp(e) { keysRef.current.delete(e.key); }
//     window.addEventListener("keydown", onKeyDown);
//     window.addEventListener("keyup", onKeyUp);

//     // ===== temporales
//     let lastSpawn = 0;
//     let lastPattern = 0;
//     let lastObstacle = 0;
//     let lastPower = 0;

//     // ===== helpers
//     const rand = (a, b) => a + Math.random() * (b - a);
//     const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
//     const collides = (ax, ay, ar, bx, by, br) => Math.hypot(ax - bx, ay - by) <= ar + br - 1.5;

//     function spawnMeteor(t) {
//       // prob segun nivel
//       const fireP = Math.min(0.15 + level * 0.03, 0.45);
//       const iceP = Math.min(0.1 + level * 0.02, 0.35);
//       const r = Math.random();
//       const type = r < fireP ? "FIRE" : r < fireP + iceP ? "ICE" : "NORMAL";
//       const spec = METEOR_TYPES[type];

//       const baseR = rand(12, 22) * spec.size;
//       const vy = (2.0 + Math.random() * 1.4 + level * 0.25) * spec.speed;
//       const vx = (Math.random() - 0.5) * (0.7 + level * 0.2);

//       meteors.push({
//         type, x: rand(30, w - 30), y: -20, r: baseR, vy, vx,
//         rot: rand(0, Math.PI * 2), rotSpeed: (Math.random() - 0.5) * 0.06,
//         glowPhase: Math.random() * Math.PI * 2,
//         score: spec.score,
//       });
//     }

//     function spawnPattern(t) {
//       // Oleadas horizontales/diagonales
//       const kind = Math.floor(Math.random() * 3);
//       if (kind === 0) {
//         // Línea diagonal
//         const startX = rand(40, w - 40);
//         for (let i = 0; i < 6 + Math.min(8, level); i++) {
//           meteors.push({
//             type: "NORMAL",
//             x: startX + (i - 4) * 28, y: -60 - i * 24,
//             r: rand(10, 18),
//             vy: 2.3 + level * 0.25,
//             vx: (Math.random() - 0.5) * 0.3,
//             rot: 0, rotSpeed: (Math.random() - 0.5) * 0.05, glowPhase: 0, score: 1,
//           });
//         }
//       } else if (kind === 1) {
//         // Chorrito FIRE
//         for (let i = 0; i < 4 + Math.min(6, level); i++) {
//           meteors.push({
//             type: "FIRE",
//             x: rand(40, w - 40),
//             y: -i * 18 - 20,
//             r: rand(9, 15) * 0.9,
//             vy: 3.2 + level * 0.35,
//             vx: (Math.random() - 0.5) * 0.9,
//             rot: 0, rotSpeed: (Math.random() - 0.5) * 0.09, glowPhase: 0, score: METEOR_TYPES.FIRE.score,
//           });
//         }
//       } else {
//         // Bloque ICE
//         for (let i = 0; i < 3 + Math.min(5, level); i++) {
//           meteors.push({
//             type: "ICE",
//             x: rand(60, w - 60),
//             y: -i * 40 - 30,
//             r: rand(18, 26) * 1.2,
//             vy: 1.5 + level * 0.2,
//             vx: (Math.random() - 0.5) * 0.4,
//             rot: 0, rotSpeed: (Math.random() - 0.5) * 0.03, glowPhase: 0, score: METEOR_TYPES.ICE.score,
//           });
//         }
//       }
//     }

//     function spawnObstacle(t) {
//       if (level >= 4 && Math.random() < 0.6) {
//         // Onda de energía
//         const y = rand(h * 0.25, h * 0.65);
//         energyWaves.push({ y, height: 14 + Math.random() * 14, vy: 0.35 + Math.random() * 0.25, life: 5000 });
//       } else if (Math.random() < 0.5) {
//         // Campo de asteroides (banda horizontal de rocas pequeñas)
//         const y = -20;
//         const rocks = Array.from({ length: 12 + Math.min(8, level) }, () => ({
//           x: rand(30, w - 30), r: rand(6, 11),
//         }));
//         asteroidFields.push({ y, rocks, vy: 1.8 + Math.random() * 0.6 });
//       } else {
//         // Cometa diagonal
//         const fromLeft = Math.random() < 0.5;
//         comets.push({
//           x: fromLeft ? -40 : w + 40,
//           y: rand(40, h * 0.4),
//           vx: fromLeft ? (2.6 + Math.random() * 0.6) : -(2.6 + Math.random() * 0.6),
//           vy: 1.4 + Math.random() * 0.4,
//           life: 6000,
//         });
//       }
//     }

//     function spawnPowerup(t) {
//       const kind = Math.random() < 0.5 ? POWERUPS.SHIELD : POWERUPS.SLOW;
//       // Se representa como “orbe” que cae y al colisionar aplica efecto
//       meteors.push({
//         type: kind.id, // reusamos array (simple)
//         x: rand(40, w - 40),
//         y: -20,
//         r: 12,
//         vy: 2.2,
//         vx: (Math.random() - 0.5) * 0.4,
//         rot: 0, rotSpeed: 0, glowPhase: 0, score: 0,
//       });
//     }

//     function applyPowerup(id) {
//       if (id === POWERUPS.SHIELD.id) {
//         player.shield = POWERUPS.SHIELD.dur;
//         setShieldMs(POWERUPS.SHIELD.dur);
//       } else if (id === POWERUPS.SLOW.id) {
//         setSlowMs(POWERUPS.SLOW.dur);
//       }
//     }

//     // ===== Loop
//     function loop(t) {
//       if (!running) { raf = requestAnimationFrame(loop); return; }

//       // tiempo, nivel
//       const ms = t - startedAt;
//       setElapsed(ms);
//       const newLevel = 1 + Math.floor(ms / 30000);
//       if (newLevel !== level) setLevel(newLevel);

//       // factores de tiempo (slow)
//       const slowFactor = slowMs > 0 ? 0.55 : 1;

//       // fondo base
//       ctx.fillStyle = "#050814";
//       ctx.fillRect(0, 0, w, h);

//       // nebulosas animadas
//       const nebPulse = (Math.sin(t * 0.0013) + 1) / 2;
//       const neb = ctx.createRadialGradient(w * 0.25, h * 0.3, 60, w * 0.25, h * 0.3, Math.max(w, h));
//       neb.addColorStop(0, `rgba(59,130,246,${0.12 + nebPulse * 0.06})`);
//       neb.addColorStop(1, "rgba(0,0,0,0)");
//       ctx.fillStyle = neb; ctx.fillRect(0, 0, w, h);
//       const neb2 = ctx.createRadialGradient(w * 0.8, h * 0.75, 60, w * 0.8, h * 0.75, Math.max(w, h));
//       neb2.addColorStop(0, `rgba(168,85,247,${0.12 + (1 - nebPulse) * 0.06})`);
//       neb2.addColorStop(1, "rgba(0,0,0,0)");
//       ctx.fillStyle = neb2; ctx.fillRect(0, 0, w, h);

//       // estrellas con “twinkle”
//       for (const s of stars) {
//         s.x -= (0.35 + s.z * 0.7) * slowFactor;
//         if (s.x < 0) { s.x = w; s.y = Math.random() * h; }
//         s.tw += 0.02 + s.z * 0.02;
//         const a = 0.35 + Math.sin(s.tw) * 0.25 * s.z;
//         ctx.globalAlpha = clamp(a, 0.05, 0.9);
//         ctx.fillStyle = "#ffffff";
//         ctx.fillRect(s.x, s.y, 1.1, 1.1);
//       }
//       ctx.globalAlpha = 1;

//       // input
//       const keys = keysRef.current;
//       const left = keys.has("ArrowLeft") || keys.has("a") || keys.has("A") || touchRef.current.left;
//       const right = keys.has("ArrowRight") || keys.has("d") || keys.has("D") || touchRef.current.right;
//       const speed = (6.2 + Math.min(5, level * 0.9)) * (slowFactor === 1 ? 1 : 0.9);
//       player.vx = (right ? 1 : 0) - (left ? 1 : 0);
//       player.x += player.vx * speed;
//       player.x = clamp(player.x, player.r + 8, w - player.r - 8);

//       // spawns base
//       const baseInterval = 380;
//       const interval = Math.max(90, baseInterval - level * 22);
//       if (t - lastSpawn > interval) { lastSpawn = t; spawnMeteor(t); }

//       // oleadas
//       if (t - lastPattern > 1800 - Math.min(1000, level * 90)) { lastPattern = t; spawnPattern(t); }

//       // obstáculos
//       if (t - lastObstacle > 2200 - Math.min(1200, level * 80)) { lastObstacle = t; spawnObstacle(t); }

//       // power-ups
//       if (t - lastPower > 6000 - Math.min(3000, level * 200)) { lastPower = t; if (Math.random() < 0.55) spawnPowerup(t); }

//       // actualizar meteoritos, powerups y colisiones
//       for (const m of meteors) {
//         m.y += m.vy * slowFactor;
//         m.x += m.vx * slowFactor;
//         m.rot += m.rotSpeed * slowFactor;
//         m.glowPhase += 0.05 * slowFactor;

//         // estelas
//         if (m.type === "FIRE" && Math.random() < 0.6) {
//           particles.push({
//             x: m.x, y: m.y + m.r * 0.2,
//             vx: (Math.random() - 0.5) * 0.6, vy: 1.8 + Math.random() * 1.2,
//             life: 0.5, decay: 0.04, color: Math.random() < 0.5 ? "#ff9e3a" : "#ef4444", size: 2 + Math.random() * 2
//           });
//         }
//         if (m.type === "ICE" && Math.random() < 0.3) {
//           particles.push({
//             x: m.x + (Math.random() - 0.5) * m.r, y: m.y + (Math.random() - 0.5) * m.r,
//             vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
//             life: 0.6, decay: 0.03, color: "#93c5fd", size: 1.6
//           });
//         }

//         // colisión con jugador
//         if (["NORMAL", "FIRE", "ICE"].includes(m.type) && collides(player.x, player.y, player.r, m.x, m.y, m.r)) {
//           if (player.shield > 0) {
//             // consumimos parte del escudo y destruimos meteorito
//             player.shield -= 800;
//             setShieldMs(s => Math.max(0, s - 800));
//             m.y = h + 100; // “eliminar”
//             // chispas
//             for (let i = 0; i < 12; i++) particles.push({
//               x: m.x, y: m.y, vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
//               life: 0.5, decay: 0.06, color: "#e2e8f0", size: 2
//             });
//           } else {
//             return gameEnd();
//           }
//         }

//         // recoger powerups (están en el mismo array con type="SHIELD"/"SLOW")
//         if (["SHIELD", "SLOW"].includes(m.type) && collides(player.x, player.y, player.r + 6, m.x, m.y, m.r)) {
//           applyPowerup(m.type);
//           m.y = h + 100;
//         }
//       }

//       // quitar offscreen y sumar puntos
//       for (let i = meteors.length - 1; i >= 0; i--) {
//         const m = meteors[i];
//         if (m.y > h + 60 || m.x < -80 || m.x > w + 80) {
//           meteors.splice(i, 1);
//           if (["NORMAL", "FIRE", "ICE"].includes(m.type)) setScore(s => s + m.score);
//         }
//       }

//       // actualizar obstáculos
//       for (const wave of energyWaves) { wave.y += wave.vy * slowFactor; wave.life -= 16 * slowFactor; }
//       for (const field of asteroidFields) { field.y += field.vy * slowFactor; }
//       for (const c of comets) { c.x += c.vx * slowFactor; c.y += c.vy * slowFactor; c.life -= 16 * slowFactor; }

//       // colisiones con ondas/rocas/cometas
//       for (const wave of energyWaves) {
//         if (wave.life > 0 && Math.abs(player.y - wave.y) < wave.height && player.shield <= 0) return gameEnd();
//       }
//       for (const field of asteroidFields) {
//         for (const r of field.rocks) {
//           if (collides(player.x, player.y, player.r, r.x, field.y, r.r)) {
//             if (player.shield > 0) { player.shield -= 800; setShieldMs(s => Math.max(0, s - 800)); }
//             else return gameEnd();
//           }
//         }
//       }
//       for (const c of comets) {
//         if (c.life > 0 && collides(player.x, player.y, player.r + 4, c.x, c.y, 12)) {
//           if (player.shield > 0) { player.shield -= 800; setShieldMs(s => Math.max(0, s - 800)); }
//           else return gameEnd();
//         }
//       }

//       // actualizar partículas
//       for (let i = particles.length - 1; i >= 0; i--) {
//         const p = particles[i];
//         p.x += p.vx; p.y += p.vy; p.life -= p.decay;
//         if (p.life <= 0) particles.splice(i, 1);
//       }

//       // decaimiento buffs
//       if (player.shield > 0) { player.shield -= 16; if (player.shield < 0) player.shield = 0; setShieldMs(player.shield); }
//       if (slowMs > 0) setSlowMs(s => Math.max(0, s - 16));

//       // ===== render: meteors/obstáculos/partículas/nave/HUD-canvas
//       // meteoritos
//       for (const m of meteors) {
//         if (m.type === "SHIELD" || m.type === "SLOW") {
//           // orbe powerup
//           const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 2.2);
//           const col = m.type === "SHIELD" ? "#60a5fa" : "#a78bfa";
//           g.addColorStop(0, `${col}AA`.replace("#","rgba(")); // fallback no hex-alpha
//           ctx.fillStyle = g;
//           ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 1.8, 0, Math.PI * 2); ctx.fill();
//           ctx.fillStyle = col;
//           ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
//           continue;
//         }

//         const spec = METEOR_TYPES[m.type];
//         const g = ctx.createRadialGradient(m.x, m.y, m.r * 0.2, m.x, m.y, m.r * 2.3);
//         g.addColorStop(0, `rgba(255,255,255,${0.15})`);
//         g.addColorStop(1, "rgba(0,0,0,0)");
//         ctx.fillStyle = g;
//         ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 2.3, 0, Math.PI * 2); ctx.fill();

//         ctx.save();
//         ctx.translate(m.x, m.y);
//         ctx.rotate(m.rot);
//         ctx.fillStyle = spec.color;
//         ctx.beginPath(); ctx.arc(0, 0, m.r, 0, Math.PI * 2); ctx.fill();
//         // detalle
//         ctx.fillStyle = "#fde68a";
//         ctx.beginPath(); ctx.arc(-m.r * 0.3, -m.r * 0.25, m.r * 0.35, 0, Math.PI * 2); ctx.fill();
//         ctx.restore();
//       }

//       // ondas de energía
//       for (const wave of energyWaves) {
//         const grad = ctx.createLinearGradient(0, wave.y - wave.height, 0, wave.y + wave.height);
//         grad.addColorStop(0, "rgba(236,72,153,0)");
//         grad.addColorStop(0.5, "rgba(236,72,153,0.35)");
//         grad.addColorStop(1, "rgba(236,72,153,0)");
//         ctx.fillStyle = grad;
//         ctx.fillRect(0, wave.y - wave.height, w, wave.y + wave.height - (wave.y - wave.height));
//       }

//       // campos de asteroides
//       for (const field of asteroidFields) {
//         for (const r of field.rocks) {
//           ctx.fillStyle = "#64748b";
//           ctx.beginPath(); ctx.arc(r.x, field.y, r.r, 0, Math.PI * 2); ctx.fill();
//         }
//       }

//       // cometas
//       for (const c of comets) {
//         const tail = ctx.createLinearGradient(c.x - c.vx * 20, c.y - c.vy * 20, c.x, c.y);
//         tail.addColorStop(0, "rgba(148,163,184,0)");
//         tail.addColorStop(1, "rgba(148,163,184,0.8)");
//         ctx.strokeStyle = tail; ctx.lineWidth = 3;
//         ctx.beginPath(); ctx.moveTo(c.x - c.vx * 18, c.y - c.vy * 18); ctx.lineTo(c.x, c.y); ctx.stroke();
//         ctx.fillStyle = "#e2e8f0";
//         ctx.beginPath(); ctx.arc(c.x, c.y, 3, 0, Math.PI * 2); ctx.fill();
//       }

//       // partículas
//       for (const p of particles) {
//         ctx.globalAlpha = Math.max(0, p.life);
//         ctx.fillStyle = p.color;
//         ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
//       }
//       ctx.globalAlpha = 1;

//       // NAVE (con escudo y propulsores)
//       {
//         // escudo visual
//         if (player.shield > 0) {
//           const pulse = Math.sin(t * 0.01) * 0.2 + 0.8;
//           const sg = ctx.createRadialGradient(player.x, player.y, player.r, player.x, player.y, player.r * 2.6);
//           sg.addColorStop(0, `rgba(59,130,246,${0.28 * pulse})`);
//           sg.addColorStop(0.7, `rgba(59,130,246,${0.12 * pulse})`);
//           sg.addColorStop(1, "rgba(59,130,246,0)");
//           ctx.fillStyle = sg;
//           ctx.beginPath(); ctx.arc(player.x, player.y, player.r * 2.5, 0, Math.PI * 2); ctx.fill();
//         }

//         // propulsión partículas
//         if (Math.random() < 0.7) {
//           particles.push({
//             x: player.x + (Math.random() - 0.5) * 8,
//             y: player.y + player.r * 0.85,
//             vx: (Math.random() - 0.5) * 1.2,
//             vy: 2 + Math.random() * 2,
//             life: 0.6, decay: 0.04,
//             color: Math.random() > 0.5 ? "#7c3aed" : "#a78bfa",
//             size: 2 + Math.random() * 2
//           });
//         }

//         // glow
//         const glow = ctx.createRadialGradient(player.x, player.y, 8, player.x, player.y, 50);
//         glow.addColorStop(0, "rgba(124,58,237,0.5)");
//         glow.addColorStop(1, "rgba(0,0,0,0)");
//         ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(player.x, player.y, 50, 0, Math.PI * 2); ctx.fill();

//         // cuerpo
//         ctx.save();
//         ctx.translate(player.x, player.y);

//         const bodyGrad = ctx.createLinearGradient(-player.r, 0, player.r, 0);
//         bodyGrad.addColorStop(0, "#7c3aed"); bodyGrad.addColorStop(0.5, "#a78bfa"); bodyGrad.addColorStop(1, "#7c3aed");
//         ctx.fillStyle = bodyGrad;
//         ctx.beginPath();
//         ctx.moveTo(0, -player.r * 1.1);
//         ctx.lineTo(player.r * 0.85, player.r * 0.2);
//         ctx.lineTo(player.r * 0.5, player.r * 1.1);
//         ctx.lineTo(-player.r * 0.5, player.r * 1.1);
//         ctx.lineTo(-player.r * 0.85, player.r * 0.2);
//         ctx.closePath();
//         ctx.fill();

//         // detalle y cabina
//         ctx.strokeStyle = "#c4b5fd"; ctx.lineWidth = 2;
//         ctx.beginPath(); ctx.moveTo(-player.r * 0.4, -player.r * 0.3); ctx.lineTo(player.r * 0.4, -player.r * 0.3); ctx.stroke();

//         const cockpit = ctx.createRadialGradient(0, -player.r * 0.3, 0, 0, -player.r * 0.3, player.r * 0.5);
//         cockpit.addColorStop(0, "#e9d5ff"); cockpit.addColorStop(1, "#c4b5fd");
//         ctx.fillStyle = cockpit; ctx.beginPath(); ctx.arc(0, -player.r * 0.2, player.r * 0.45, 0, Math.PI * 2); ctx.fill();

//         // alas
//         ctx.fillStyle = "#6d28d9";
//         ctx.beginPath(); ctx.moveTo(-player.r * 0.85, player.r * 0.2); ctx.lineTo(-player.r * 1.3, player.r * 0.5); ctx.lineTo(-player.r * 0.9, player.r * 0.8); ctx.closePath(); ctx.fill();
//         ctx.beginPath(); ctx.moveTo(player.r * 0.85, player.r * 0.2); ctx.lineTo(player.r * 1.3, player.r * 0.5); ctx.lineTo(player.r * 0.9, player.r * 0.8); ctx.closePath(); ctx.fill();

//         // llamas
//         const thrust = ctx.createLinearGradient(0, player.r * 0.9, 0, player.r * 1.6);
//         thrust.addColorStop(0, "#a78bfa"); thrust.addColorStop(0.5, "#7c3aed"); thrust.addColorStop(1, "rgba(124,58,237,0)");
//         ctx.fillStyle = thrust;
//         ctx.beginPath(); ctx.moveTo(-player.r * 0.4, player.r * 0.95); ctx.lineTo(-player.r * 0.3, player.r * 1.5); ctx.lineTo(-player.r * 0.2, player.r * 0.95); ctx.closePath(); ctx.fill();
//         ctx.beginPath(); ctx.moveTo(player.r * 0.4, player.r * 0.95); ctx.lineTo(player.r * 0.3, player.r * 1.5); ctx.lineTo(player.r * 0.2, player.r * 0.95); ctx.closePath(); ctx.fill();

//         ctx.restore();
//       }

//       raf = requestAnimationFrame(loop);
//     }

//     raf = requestAnimationFrame(loop);

//     function gameEnd() {
//       setRunning(false);
//       setGameOver(true);
//       setBest(prev => {
//         const next = Math.max(prev, score);
//         try { sessionStorage.setItem(LS_KEY, String(next)); } catch {}
//         return next;
//       });
//     }

//     function doRestart() {
//       // reset react
//       setScore(0);
//       setGameOver(false);
//       setRunning(true);
//       const now = performance.now();
//       setStartedAt(now); setElapsed(0); setLevel(1);
//       setShieldMs(0); setSlowMs(0);

//       // reset entidades rápidas (vía canvas unmount pattern: no necesario limpiar arrays aquí)
//       // simplemente recargamos la página del juego:
//       // pero lo haremos sin reload: vaciamos arrays y recolocamos player
//       meteors.length = particles.length = energyWaves.length = comets.length = asteroidFields.length = 0;

//       player.x = w / 2; player.y = h - 72; player.vx = 0; player.shield = 0;
//       // timers
//       lastSpawn = lastPattern = lastObstacle = lastPower = 0;
//     }

//     // Exponer a UI
//     (window)._md_controls = { restart: doRestart, togglePause: () => { if (!gameOver) setRunning(r => !r); } };

//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener("resize", resize);
//       window.removeEventListener("keydown", onKeyDown);
//       window.removeEventListener("keyup", onKeyUp);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [gameOver]);

//   // ===== UI helpers
//   const onPause = () => window._md_controls?.togglePause();
//   const onRestart = () => window._md_controls?.restart();
//   const minutes = Math.floor(elapsed / 60000);
//   const seconds = Math.floor((elapsed % 60000) / 1000);
//   const levelLabel = String(level).padStart(2, "0");

//   return (
//     <main className="relative min-h-[100dvh] bg-black text-white overflow-hidden">
//       {/* Nebulosas de fondo fijas (CSS) */}
//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-0 -z-10"
//         style={{
//           background: `
//             radial-gradient(1000px 600px at 20% 30%, rgba(59,130,246,0.12), transparent 60%),
//             radial-gradient(900px 500px at 80% 65%, rgba(168,85,247,0.14), transparent 60%),
//             radial-gradient(700px 700px at 50% -10%, rgba(236,72,153,0.10), transparent 60%),
//             #000
//           `
//         }}
//       />

//       {/* HUD */}
//       <div className="mx-auto max-w-6xl px-4 pt-8 pb-2 flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Meteor Dodger</h1>
//           <p className="text-slate-300 text-sm mt-1">Esquiva meteoritos. Sube de nivel cada 30 s. Power-ups: Escudo y Ralentización.</p>
//         </div>
//         <div className="flex flex-wrap items-center gap-2">
//           <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur text-sm">Nivel <b className="tabular-nums">{levelLabel}</b></span>
//           <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur text-sm">Puntos <b className="tabular-nums">{score}</b></span>
//           <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur text-sm">Mejor <b className="tabular-nums">{best}</b></span>
//           {shieldMs > 0 && <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sm">🛡 Escudo</span>}
//           {slowMs > 0 && <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-sm">⏱ Lento</span>}
//           <button onClick={onPause} className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm">{running ? "Pausar" : "Reanudar"}</button>
//           <button onClick={onRestart} className="px-3 py-1 rounded-lg bg-white/10 text-sm">Reiniciar</button>
//         </div>
//       </div>

//       {/* Canvas con contenedor “glass” */}
//       <div className="mx-auto max-w-5xl px-4 pb-10">
//         <div className="relative mx-auto w-[min(92vw,980px)] rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900">
//           <canvas ref={canvasRef} className="block w-full h-full" />

//           {/* overlays */}
//           {!running && !gameOver && (
//             <div className="absolute inset-0 grid place-items-center bg-black/40 backdrop-blur-sm">
//               <div className="px-5 py-3 rounded-xl bg-white/10 border border-white/10">
//                 <p className="text-slate-200">⏸️ Pausa</p>
//                 <p className="text-slate-400 text-sm">Espacio para reanudar</p>
//               </div>
//             </div>
//           )}
//           {gameOver && (
//             <div className="absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-sm">
//               <div className="px-6 py-5 rounded-2xl bg-white/10 border border-white/10 text-center">
//                 <h2 className="text-xl font-medium mb-2">💥 ¡Impacto!</h2>
//                 <p className="text-slate-300">Puntos: <b>{score}</b> · Mejor: <b>{Math.max(best, score)}</b></p>
//                 <div className="mt-4 flex justify-center gap-2">
//                   <button onClick={onRestart} className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500">Reintentar (Enter)</button>
//                   <button onClick={() => navigator.clipboard.writeText(`${window.location.href}?score=${score}`)} className="px-3 py-1 rounded-lg bg-white/10">Compartir</button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Controles táctiles */}
//         <div className="mt-4 flex justify-center gap-4 sm:hidden select-none">
//           <button
//             onTouchStart={() => (touchRef.current.left = true)}
//             onTouchEnd={() => (touchRef.current.left = false)}
//             className="px-6 py-3 rounded-xl bg-white/10 border border-white/10"
//           >⬅️</button>
//           <button
//             onTouchStart={() => (touchRef.current.right = true)}
//             onTouchEnd={() => (touchRef.current.right = false)}
//             className="px-6 py-3 rounded-xl bg-white/10 border border-white/10"
//           >➡️</button>
//         </div>

//         <p className="text-center text-slate-400 text-xs mt-3">
//           Controles: ← → o A/D · Pausa: Espacio · Reiniciar: Enter
//         </p>
//       </div>
//     </main>
//   );
// }
import { useEffect, useRef, useState } from "react";

/**
 * Meteor Dodger — Asterium (demo-fast levels + split HUD + pause fix)
 * - Niveles: L2 a los 10s, L3 a los 30s, luego +1 cada 20s (50, 70, 90…)
 * - Tipos por nivel: L1 NORMAL · L2 añade FIRE · L3 añade ICE
 * - Dificultad ↑ con nivel (densidad/velocidad)
 * - Estrellas fugaces + cohete chulo + pausa real con refs
 */

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
      } else {
        const now = performance.now();
        const pausedMs = now - (pausedAtRef.current ?? now);
        startRef.current += pausedMs; // compensar tiempo pausado
        runningRef.current = true;
        setRunning(true);
      }
    }

    function restart() {
      setScore(0); setGameOver(false); setLevel(1); setElapsed(0);
      startRef.current = performance.now();
      pausedAtRef.current = null;
      runningRef.current = true;
      setRunning(true);
      // arrays internos se vacían en el siguiente frame (reinicio suave)
    }

    (window)._md_controls = { togglePause, restart };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

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
        <div className="flex flex-col items-end gap-2">
          
          <div className="flex gap-2">
            <button onClick={onPause} className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm">
              {running ? "Pausar" : "Reanudar"}
            </button>
            <button onClick={onRestart} className="px-3 py-1 rounded-lg bg-white/10 text-sm">Reiniciar</button>
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
    </main>
  );
}
