const glow = document.getElementById("glow");
const rabbit = document.getElementById("rabbit");
const iris = document.getElementById("iris");
const hole = document.getElementById("hole");
const surface = document.getElementById("surface");
const back = document.getElementById("back");
const watch = document.getElementById("watch");
const canvas = document.getElementById("motes");
const ctx = canvas.getContext("2d");

let mx = innerWidth * 0.5;
let my = innerHeight * 0.45;
let gx = mx;
let gy = my;
let inside = false;

const motes = Array.from({ length: 42 }, () => ({
  x: Math.random() * innerWidth,
  y: Math.random() * innerHeight,
  r: Math.random() * 1.6 + 0.4,
  s: Math.random() * 0.25 + 0.05,
  a: Math.random() * 0.28 + 0.04,
}));

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function tick() {
  gx += (mx - gx) * 0.08;
  gy += (my - gy) * 0.08;
  glow.style.transform = `translate(${gx}px, ${gy}px)`;

  const dx = (mx / innerWidth - 0.5) * 18;
  const dy = (my / innerHeight - 0.5) * 10;
  if (!inside) {
    rabbit.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  motes.forEach((p) => {
    p.y -= p.s;
    if (p.y < -4) {
      p.y = canvas.height + 4;
      p.x = Math.random() * canvas.width;
    }
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,253,248,${p.a})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(tick);
}

function nowCopy() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  watch.textContent = `it’s ${hh}:${mm} — later than you think`;
}

async function enter() {
  if (inside) return;
  inside = true;
  iris.classList.add("open");
  await wait(520);
  surface.hidden = true;
  hole.hidden = false;
  hole.inert = false;
  document.body.classList.add("inside");
  nowCopy();
  await wait(420);
  iris.classList.remove("open");
}

async function leave() {
  if (!inside) return;
  iris.classList.add("open");
  await wait(520);
  hole.hidden = true;
  hole.inert = true;
  surface.hidden = false;
  document.body.classList.remove("inside");
  inside = false;
  await wait(420);
  iris.classList.remove("open");
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

window.addEventListener("pointermove", (e) => {
  mx = e.clientX;
  my = e.clientY;
});

rabbit.addEventListener("click", enter);
back.addEventListener("click", leave);
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") enter();
  if (e.key === "Escape") leave();
});

resize();
window.addEventListener("resize", resize);
tick();
