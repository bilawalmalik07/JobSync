CREATE TABLE IF NOT EXISTS scans (
    id SERIAL PRIMARY KEY,
    batch_id UUID NOT NULL,
    resume_detail TEXT NOT NULL,
    job_description TEXT NOT NULL,
    match_score NUMERIC(5,2),
    skill_gap JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scans_batch_id ON scans (batch_id);

CREATE TABLE IF NOT EXISTS cache (
    hash_id TEXT PRIMARY KEY,
    cached_result JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);