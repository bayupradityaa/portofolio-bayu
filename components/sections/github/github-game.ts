import type { ContributionData, ThemeColors } from "./github-calendar";

export interface GithubGameOptions {
  canvas: HTMLCanvasElement;
  weeks: (string | null)[][];
  data: ContributionData;
  step: number;
  cellSize: number;
  monthLabelHeight: number;
  activeColors: ThemeColors;
  /** DOM id prefix for the contribution cells (`cell-${id}-${date}`). */
  id: string;
  width: number;
  height: number;
}

/**
 * Runs the GitHub contribution "space shooter" mini-game on a canvas overlay.
 *
 * Extracted from github-calendar.tsx and loaded on demand (dynamic import) so
 * the particle system, bullet/star loops, and requestAnimationFrame driver are
 * NOT shipped in the initial bundle — they arrive only when a user toggles Game
 * Mode (desktop only). Returns a cleanup function that cancels the loop.
 */
export function startContributionGame(opts: GithubGameOptions): () => void {
  const {
    canvas,
    weeks,
    data,
    step,
    cellSize,
    monthLabelHeight,
    activeColors,
    id,
    width,
    height,
  } = opts;

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  canvas.width = width;
  canvas.height = height;

  let animationFrameId = 0;

  const cellLevels = new Map<string, number>();
  weeks.forEach((week) => {
    week.forEach((date) => {
      if (!date) return;
      const entry = data[date];
      const initialLevel = entry?.level ?? 0;
      cellLevels.set(date, initialLevel);
      const rect = document.getElementById(`cell-${id}-${date}`);
      if (rect) {
        if (initialLevel === 0) {
          rect.style.opacity = "0";
          rect.style.pointerEvents = "none";
        } else {
          rect.style.opacity = "1";
          rect.style.pointerEvents = "auto";
        }
      }
    });
  });

  const player = {
    x: width / 2 - 15,
    y: height - 25,
    width: 30,
    height: 20,
    speed: 4,
    direction: 1,
    color: "#22c55e",
  };

  type GameBullet = {
    x: number;
    y: number;
    vy: number;
    width: number;
    height: number;
    color: string;
  };
  let bullets: GameBullet[] = [];
  let lastShot = 0;
  const cooldown = 140;

  const shoot = () => {
    bullets.push({
      x: player.x + player.width / 2 - 1.5,
      y: player.y - 4,
      vy: -6,
      width: 3,
      height: 8,
      color: "#fbbf24",
    });
  };

  const stars = Array.from({ length: 140 }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    speed: Math.random() * 0.4 + 0.1,
    size: Math.random() * 1.2 + 0.5,
    alpha: Math.random() * 0.5 + 0.1,
  }));

  type GameParticle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    alpha: number;
    life: number;
    maxLife: number;
  };
  let particles: GameParticle[] = [];
  const explode = (x: number, y: number, color: string) => {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 1.2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 2 + 1,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 15 + 15,
      });
    }
  };
  const update = () => {
    let minWi = -1;
    let maxWi = -1;
    weeks.forEach((week, wi) => {
      week.forEach((date) => {
        if (!date) return;
        if ((cellLevels.get(date) ?? 0) > 0) {
          if (minWi === -1) minWi = wi;
          minWi = Math.min(minWi, wi);
          maxWi = Math.max(maxWi, wi);
        }
      });
    });

    let minX = 0;
    let maxX = width - player.width;
    if (minWi !== -1 && maxWi !== -1) {
      minX = minWi * step;
      maxX = Math.max(
        minX,
        Math.min(width - player.width, (maxWi + 1) * step - player.width),
      );
    }

    player.x = Math.max(minX, Math.min(maxX, player.x));
    player.x += player.speed * player.direction;
    if (player.x >= maxX) {
      player.x = maxX;
      player.direction = -1;
    } else if (player.x <= minX) {
      player.x = minX;
      player.direction = 1;
    }

    const now = Date.now();
    if (now - lastShot >= cooldown) {
      shoot();
      lastShot = now;
    }

    let anyActive = false;
    cellLevels.forEach((level) => {
      if (level > 0) anyActive = true;
    });

    if (!anyActive) {
      weeks.forEach((week) => {
        week.forEach((date) => {
          if (!date) return;
          const originalLevel = data[date]?.level ?? 0;
          cellLevels.set(date, originalLevel);
          const rect = document.getElementById(`cell-${id}-${date}`);
          if (rect) {
            const originalColor =
              activeColors[`level${originalLevel}` as keyof ThemeColors] ||
              activeColors.level0;
            rect.setAttribute("fill", originalColor);
            if (originalLevel === 0) {
              rect.style.opacity = "0";
              rect.style.pointerEvents = "none";
            } else {
              rect.style.opacity = "1";
              rect.style.pointerEvents = "auto";
            }
          }
        });
      });
    }

    stars.forEach((s) => {
      s.y += s.speed;
      if (s.y > height) {
        s.y = 0;
        s.x = Math.random() * width;
      }
    });

    bullets = bullets.filter((b) => {
      b.y += b.vy;
      return b.y > 0;
    });

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = 1 - p.life / p.maxLife;
    });
    particles = particles.filter((p) => p.life < p.maxLife);

    bullets.forEach((bullet, bulletIdx) => {
      weeks.forEach((week, wi) => {
        week.forEach((date, di) => {
          if (!date) return;

          const currentLevel = cellLevels.get(date) ?? 0;
          if (currentLevel === 0) return;

          const cellX = wi * step;
          const cellY = monthLabelHeight + di * step;

          if (
            bullet.x < cellX + cellSize &&
            bullet.x + bullet.width > cellX &&
            bullet.y < cellY + cellSize &&
            bullet.y + bullet.height > cellY
          ) {
            bullets.splice(bulletIdx, 1);
            const newLevel = currentLevel - 1;
            cellLevels.set(date, newLevel);

            const rect = document.getElementById(`cell-${id}-${date}`);
            if (rect) {
              if (newLevel === 0) {
                rect.style.opacity = "0";
                rect.style.pointerEvents = "none";
              } else {
                const newColor =
                  activeColors[`level${newLevel}` as keyof ThemeColors] ||
                  activeColors.level0;
                rect.setAttribute("fill", newColor);
              }
            }

            const hitColor =
              activeColors[`level${currentLevel}` as keyof ThemeColors] ||
              activeColors.level0;
            explode(cellX + cellSize / 2, cellY + cellSize / 2, hitColor);
          }
        });
      });
    });
  };

  const render = () => {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#ffffff";
    stars.forEach((s) => {
      ctx.globalAlpha = s.alpha;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });
    ctx.globalAlpha = 1.0;

    bullets.forEach((b) => {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.width, b.height);
    });

    particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = player.color;
    ctx.shadowColor = player.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.lineTo(player.x + player.width * 0.7, player.y + player.height * 0.75);
    ctx.lineTo(player.x + player.width * 0.3, player.y + player.height * 0.75);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  let running = true;
  const loop = () => {
    update();
    render();
    if (running) animationFrameId = requestAnimationFrame(loop);
  };
  animationFrameId = requestAnimationFrame(loop);

  return () => {
    running = false;
    cancelAnimationFrame(animationFrameId);
  };
}
