export default function StatsBar({ totalJobs, elapsedMs }) {
  if (!totalJobs) return null;

  const seconds = (elapsedMs / 1000).toFixed(1);

  return (
    <div className="stats-bar">
      <span><strong>{totalJobs}</strong> jobs analyzed</span>
      <span><strong>{seconds}s</strong> total time</span>
    </div>
  );
}