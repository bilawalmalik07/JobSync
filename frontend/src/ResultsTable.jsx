function ScoreRing({ score }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const label = score >= 85 ? "STRONG MATCH" : score >= 60 ? "GOOD MATCH" : "WEAK MATCH";

  return (
    <div className="score-ring">
      <svg width="110" height="110" viewBox="0 0 100 100">
        <defs>
          <linearGradient id={`ring-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={`url(#ring-${score})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="48" textAnchor="middle" fill="#111827" fontSize="20" fontWeight="700">
          {Math.round(score)}%
        </text>
      </svg>
      <span className="score-label">{label}</span>
    </div>
  );
}

export default function ResultsTable({ results }) {
  if (!results.length) return null;

  const sorted = [...results].sort((a, b) => b.match_score - a.match_score);

  return (
    <div className="results">
      {sorted.map((r, i) => (
        <div key={i} className="result-card">
          <span className="result-rank">#{i + 1}</span>
          <ScoreRing score={r.match_score} />
          <div className="skills-panel">
            <p className="skills-title">Missing Skills</p>
            {r.skill_gap.length ? (
              <div className="skills-list">
                {r.skill_gap.map((skill, j) => (
                  <span key={j} className="skill-pill">{skill}</span>
                ))}
              </div>
            ) : (
              <span className="no-gaps">No gaps found</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}