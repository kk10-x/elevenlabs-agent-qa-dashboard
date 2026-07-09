import enum
from datetime import datetime

from sqlalchemy import JSON, DateTime, Enum, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RunStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    PASSED = "passed"
    FAILED = "failed"
    ERROR = "error"


class FailureReason(str, enum.Enum):
    WRONG_RESPONSE = "wrong_response"
    LATENCY_SPIKE = "latency_spike"
    INTERRUPTION_MISHANDLED = "interruption_mishandled"


class TestCase(Base):
    __tablename__ = "test_cases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), unique=True)
    agent_id: Mapped[str] = mapped_column(String(200))
    expected_flow: Mapped[dict] = mapped_column(JSON)
    assertions: Mapped[dict] = mapped_column(JSON)
    max_latency_ms: Mapped[int] = mapped_column(Integer, default=3000)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    runs: Mapped[list["TestRun"]] = relationship(back_populates="test_case")


class TestRun(Base):
    __tablename__ = "test_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    test_case_id: Mapped[int] = mapped_column(ForeignKey("test_cases.id"))
    conversation_id: Mapped[str | None] = mapped_column(String(200), nullable=True)
    status: Mapped[RunStatus] = mapped_column(Enum(RunStatus), default=RunStatus.PENDING)
    failure_reason: Mapped[FailureReason | None] = mapped_column(Enum(FailureReason), nullable=True)
    latency_ms: Mapped[float | None] = mapped_column(Float, nullable=True)
    credits_used: Mapped[int | None] = mapped_column(Integer, nullable=True)
    transcript: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    test_case: Mapped["TestCase"] = relationship(back_populates="runs")
