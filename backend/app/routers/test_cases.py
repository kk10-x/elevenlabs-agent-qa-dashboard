from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import TestCase
from app.schemas import TestCaseCreate, TestCaseRead

router = APIRouter(prefix="/test-cases", tags=["test-cases"])


@router.get("", response_model=list[TestCaseRead])
async def list_test_cases(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TestCase))
    return result.scalars().all()


@router.post("", response_model=TestCaseRead, status_code=201)
async def create_test_case(payload: TestCaseCreate, db: AsyncSession = Depends(get_db)):
    test_case = TestCase(**payload.model_dump())
    db.add(test_case)
    await db.commit()
    await db.refresh(test_case)
    return test_case


@router.get("/{test_case_id}", response_model=TestCaseRead)
async def get_test_case(test_case_id: int, db: AsyncSession = Depends(get_db)):
    test_case = await db.get(TestCase, test_case_id)
    if test_case is None:
        raise HTTPException(status_code=404, detail="Test case not found")
    return test_case
