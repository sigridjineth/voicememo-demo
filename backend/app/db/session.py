from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get database session."""
    # Minimal implementation - will be expanded later
    yield  # type: ignore
