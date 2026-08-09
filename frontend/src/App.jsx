import { useState } from "react";
import { analyzeBatch } from "./api";
import BatchInput from "./BatchInput";
import ResultsTable from "./ResultsTable";
import StatsBar from "./StatsBar";

export default function App() {
  const [results, setResults] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(resumeFile, jobs) {
    setLoading(true);
    setError(null);
    const start = Date.now();

    try {
      const data = await analyzeBatch(resumeFile, jobs);
      setResults(data.result);
      setTotalJobs(data.total_jobs);
      setElapsedMs(Date.now() - start);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <aside className="side-panel">
        <h2 className="side-panel-title">How it works</h2>
        <p className="side-panel-text">
          Upload your resume and paste in the job descriptions you're
          considering. We'll compare them side by side and show you a match
          score plus exactly which skills each role is looking for that
          aren't on your resume yet.
        </p>
      </aside>

      <main className="app">
        <div className="hero">
          <h1>JobSync <span>AI</span></h1>
        </div>

        <div className="hero-divider" />

        <BatchInput onSubmit={handleSubmit} loading={loading} />

        {error && <p className="error">{error}</p>}

        <StatsBar totalJobs={totalJobs} elapsedMs={elapsedMs} />
        <ResultsTable results={results} />
      </main>

      <aside className="side-panel">
        <h2 className="side-panel-title">Good luck out there</h2>
        <p className="side-panel-text">
          Every application is a step closer. We hope this helps you walk in
          prepared, put your best foot forward, and land the role that's
          actually right for you.
        </p>
      </aside>
    </div>
  );
}