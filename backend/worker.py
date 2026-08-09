import asyncio

from sqlalchemy.ext.asyncio import AsyncSession

from ai import analyze_match
from cache import get_cached_result, make_hash, save_to_cache
from database import AsyncSessionLocal
from schemas import BatchJobInput, JobDescriptionInput, MatchResult


async def process_single_job(resume_detail: str, job: JobDescriptionInput, db: AsyncSession) -> MatchResult:
    hash_id = make_hash(resume_detail, job.description)
    cached = await get_cached_result(hash_id, db)
    if cached is not None:
        return MatchResult(**cached)

    result = await analyze_match(resume_detail, job.description)
    await save_to_cache(hash_id, result.model_dump(), db)
    return result


async def run_job_with_own_session(resume_detail: str, job: JobDescriptionInput) -> MatchResult:
    async with AsyncSessionLocal() as job_db:
        return await process_single_job(resume_detail, job, job_db)


async def process_batch(batch: BatchJobInput, batch_id: str) -> list[MatchResult]:
    tasks = [
        run_job_with_own_session(batch.resume_detail, job)
        for job in batch.jobs
    ]

    results = await asyncio.gather(*tasks)
    return results