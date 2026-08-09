const API_URL = import.meta.env.VITE_API_URL || "";
const API_KEY = import.meta.env.VITE_API_KEY;

export async function analyzeBatch(resumeFile, jobs) {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jobs", JSON.stringify(jobs));

  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: {
      "X-API-Key": API_KEY,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Request failed: ${response.status}`);
  }

  return response.json();
}