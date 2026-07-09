from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import TestCase, TestRun
from app.schemas import TestRunRead, TrendPoint

router = APIRouter(prefix="/runs", tags=["runs"])


@router.post("/{test_case_id}", response_model=TestRunRead, status_code=202)
async def trigger_run(
    test_case_id: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """Kick off a test run against a live agent.

    Returns immediately with a pending run; the actual conversation call and
    analysis happen asynchronously since conversations can take a while to finish.
    """
    test_case = await db.get(TestCase, test_case_id)
    if test_case is None:
        raise HTTPException(status_code=404, detail="Test case not found")

    run = TestRun(test_case_id=test_case_id)
    db.add(run)
    await db.commit()
    await db.refresh(run)

    # TODO: background_tasks.add_task(execute_run, run.id) once the runner
    # (start_conversation -> poll_until_complete -> assertion analysis) is wired up.
    return run


@router.get("/{test_case_id}/history", response_model=list[TrendPoint])
async def run_history(test_case_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(TestRun).where(TestRun.test_case_id == test_case_id).order_by(TestRun.started_at)
    )
    return [
        TrendPoint(
            run_id=run.id,
            started_at=run.started_at,
            status=run.status,
            latency_ms=run.latency_ms,
        )
        for run in result.scalars().all()
    ]
