from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# SQLite database URL for development
DATABASE_URL = "sqlite+aiosqlite:///./clovernote.db"

# Create async engine
engine = create_async_engine(DATABASE_URL, echo=False)

# Create async session maker
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get database session."""
    session = async_session()
    try:
        yield session
    finally:
        await session.close()
