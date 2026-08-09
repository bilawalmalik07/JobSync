from pydantic import BaseModel, Field
from uuid import UUID


class JobDescriptionInput(BaseModel):
    title: str
    description: str


class BatchJobInput(BaseModel):
    resume_detail: str
    jobs: list[JobDescriptionInput] = Field(max_length=50)


class MatchResult(BaseModel):
    match_score: float
    skill_gap: list[str]


class BatchJobResponse(BaseModel):
    batch_id: UUID
    result: list[MatchResult]
    total_jobs: int