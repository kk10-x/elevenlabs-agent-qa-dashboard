from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models import FailureReason, RunStatus


class TestCaseCreate(BaseModel):
    name: str
    agent_id: str
    expected_flow: dict
    assertions: dict
    max_latency_ms: int = 3000


class TestCaseRead(TestCaseCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class TestRunRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    test_case_id: int
    conversation_id: str | None
    status: RunStatus
    failure_reason: FailureReason | None
    latency_ms: float | None
    credits_used: int | None
    started_at: datetime
    completed_at: datetime | None


class TrendPoint(BaseModel):
    run_id: int
    started_at: datetime
    status: RunStatus
    latency_ms: float | None
