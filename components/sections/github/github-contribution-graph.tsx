"use client";

import { useState, useEffect } from "react";

interface ContributionGraphProps {
  userName?: string;
  data: Array<{
    day: number;
    count: number;
    date: string;
  }>;
}

export function GithubContributionGraph({
  userName = "Bayu Praditya",
  data,
}: ContributionGraphProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    day: number;
    count: number;
    date: string;
    x: number;
    y: number;
  } | null>(null);

  const [activePoint, setActivePoint] = useState<{
    day: number;
    count: number;
    date: string;
    x: number;
    y: number;
  } | null>(null);

  // Fallback 30-day dataset matching screenshot exact visual points
  const fallbackPoints = [
    0, 0, 0, 0, 0, 19, 3, 3, 5, 3,
    6, 13, 5, 4, 5, 0, 0, 7, 6, 4,
    3, 8, 2, 0, 8, 3, 6, 6, 7, 11
  ];

  const pointsData =
    data && data.length === 30
      ? data
      : fallbackPoints.map((count, i) => ({
          day: i + 1,
          count,
          date: `Day ${i + 1}`,
        }));

  // Chart layout dimensions
  const svgWidth = 800;
  const svgHeight = 340;

  const paddingLeft = 65;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 55;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxVal = 20; // Y-axis max value matching screenshot (0-20)
  const yTicks = [20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 0];

  // Map data points to SVG coordinates
  const points = pointsData.map((d, i) => {
    const x = paddingLeft + (i / (pointsData.length - 1)) * chartWidth;
    const clampedCount = Math.min(Math.max(0, d.count), maxVal);
    const y = paddingTop + chartHeight - (clampedCount / maxVal) * chartHeight;
    return { ...d, x, y };
  });

  // Build smooth cubic bezier spline SVG path
  const buildSmoothPath = (pts: typeof points) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp1y = p0.y;
      const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cp2y = p1.y;
      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
    }
    return d;
  };

  const pathD = buildSmoothPath(points);
  const currentPoint = activePoint || hoveredPoint;

  // Clear active point when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => setActivePoint(null);
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <div className="w-full mt-10">
      {/* Section Sub-heading */}
      <div className="border-b border-border/60 pb-3">
        <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Contribution Activity
        </h3>
      </div>

      {/* Contribution Graph Container */}
      <div
        className="mt-6 rounded-2xl border border-border/60 bg-card/80 p-6 sm:p-8 backdrop-blur-sm shadow-xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title centered above chart */}
        <h4 className="text-center font-bold text-emerald-400 text-lg sm:text-xl mb-6">
          {userName}&apos;s Contribution Graph
        </h4>

        {/* Responsive SVG Chart */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[650px] overflow-visible select-none"
          >
            <defs>
              {/* Green Glow Filter */}
              <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Horizontal Dashed Grid Lines & Y-axis Labels */}
            {yTicks.map((val) => {
              const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
              return (
                <g key={val}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 15}
                    y={y + 4}
                    fill="#10b981"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="600"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Vertical Y-axis Title "Contributions" */}
            <text
              transform={`rotate(-90 ${paddingLeft - 45} ${paddingTop + chartHeight / 2})`}
              x={paddingLeft - 45}
              y={paddingTop + chartHeight / 2}
              fill="#10b981"
              fontSize="12"
              fontFamily="monospace"
              fontWeight="600"
              textAnchor="middle"
            >
              Contributions
            </text>

            {/* X-axis Labels (Day numbers 30, 1..30) */}
            {points.map((pt, i) => {
              const displayNum = i === 0 ? 30 : i;
              return (
                <text
                  key={i}
                  x={pt.x}
                  y={paddingTop + chartHeight + 22}
                  fill="#10b981"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {displayNum}
                </text>
              );
            })}

            {/* X-axis Title "Days" centered at bottom */}
            <text
              x={paddingLeft + chartWidth / 2}
              y={svgHeight - 8}
              fill="#10b981"
              fontSize="12"
              fontFamily="monospace"
              fontWeight="600"
              textAnchor="middle"
            >
              Days
            </text>

            {/* Smooth Emerald Curve Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#22c55e"
              strokeWidth="3.5"
              filter="url(#emeraldGlow)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Node Dots with White Fill and Green Stroke */}
            {points.map((pt, i) => {
              const isSelected = currentPoint?.day === pt.day;

              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePoint((prev) => (prev?.day === pt.day ? null : pt));
                  }}
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Transparent enlarged touch target */}
                  <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                  {/* Pulsing selection aura */}
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="10"
                      fill="#22c55e"
                      opacity="0.35"
                    />
                  )}

                  {/* Node Circle Dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 6.5 : 4.5}
                    fill="#ffffff"
                    stroke="#22c55e"
                    strokeWidth={isSelected ? 3 : 2.5}
                    className="transition-all duration-150 ease-out"
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip */}
          {currentPoint && (
            <div
              className="absolute z-30 pointer-events-none rounded-lg border border-emerald-500/50 bg-card/95 px-3 py-1.5 text-xs shadow-xl backdrop-blur-md transition-all duration-150 font-mono text-center"
              style={{
                left: `${(currentPoint.x / svgWidth) * 100}%`,
                top: `${(currentPoint.y / svgHeight) * 100}%`,
                transform: "translate(-50%, -135%)",
              }}
            >
              <div className="font-bold text-emerald-400 text-sm">
                {currentPoint.count} contributions
              </div>
              <div className="text-[10px] text-muted">
                {currentPoint.date}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
