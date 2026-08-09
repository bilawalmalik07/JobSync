import hashlib
import json

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


def make_hash(resume_detail: str, description: str) -> str:
    combined = resume_detail + description
    return hashlib.sha256(combined.encode()).hexdigest()


async def get_cached_result(hash_id: str, db: AsyncSession) -> dict | None:
    result = await db.execute(
        text("SELECT cached_result FROM cache WHERE hash_id = :hash_id"),
        {"hash_id": hash_id}
    )
    row = result.fetchone()
    if row is None:
        return None

    return row[0]


async def save_to_cache(hash_id: str, result: dict, db: AsyncSession) -> None:
    await db.execute(
        text("INSERT INTO cache (hash_id, cached_result) VALUES (:hash_id, :cached_result)"),
        {"hash_id": hash_id, "cached_result": json.dumps(result)}
    )
    await db.commit()