import { useState, useRef } from "react";

export default function BatchInput({ onSubmit, loading }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [jobsText, setJobsText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  function handleFile(file) {
    if (file) {
      setResumeFile(file);
      setFileName(file.name);
    }
  }

  function handleFileChange(e) {
    handleFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!resumeFile) return;

    const jobs = jobsText
      .split(/\n---\n/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => {
        const [title, ...rest] = block.split("\n");
        return { title: title.trim(), description: rest.join("\n").trim() };
      });

    onSubmit(resumeFile, jobs);
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="field">
        <label>Resume</label>
        <div
          className={`dropzone${isDragging ? " dropzone-active" : ""}${resumeFile ? " dropzone-filled" : ""}`}
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            required
            hidden
          />
          {resumeFile ? (
            <>
              <svg className="dropzone-icon" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="dropzone-title">{fileName}</span>
              <span className="dropzone-hint">Click to choose a different file</span>
            </>
          ) : (
            <>
              <svg className="dropzone-icon" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V4M12 4L7 9M12 4l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="dropzone-title">Drop your resume here, or click to browse</span>
              <span className="dropzone-hint">PDF, DOCX, TXT, JPG, or PNG</span>
            </>
          )}
        </div>
      </div>

      <div className="field">
        <label>Job Descriptions</label>
        <p className="field-hint">Paste each job description below, separated by a line with three dashes (---)</p>
        <textarea
          value={jobsText}
          onChange={(e) => setJobsText(e.target.value)}
          rows={12}
          required
          placeholder={"Senior Backend Engineer\nWe're seeking a Backend Engineer with 3+ years of experience in Python, FastAPI, and PostgreSQL to help scale our platform...\n---\nProduct Designer\nJoin our design team to lead end-to-end product design, from wireframes to high-fidelity prototypes..."}
        />
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "Analyzing..." : "Analyze Jobs"}
      </button>
    </form>
  );
}