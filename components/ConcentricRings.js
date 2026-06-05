export default function ConcentricRings({ color = '#f43f5e', className = '' }) {
  const rings = [18, 30, 42, 54, 66, 78, 90, 102, 114];
  const cx = 120;
  const cy = 120;
  const groups = [
    { cx: 60 },
    { cx: 140 },
    { cx: 220 },
    { cx: 300 },
    { cx: 380 },
  ];

  return (
    <svg
      viewBox="0 0 440 140"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
    >
      {groups.map((g, gi) =>
        rings.map((r, ri) => (
          <circle
            key={`${gi}-${ri}`}
            cx={g.cx}
            cy={140}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            opacity={0.25 + ri * 0.04}
          />
        ))
      )}
    </svg>
  );
}
