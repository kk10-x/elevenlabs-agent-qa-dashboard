from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://agentqa:agentqa@localhost:5432/agentqa"
    elevenlabs_api_key: str = ""
    max_credits_per_run: int = 1000


settings = Settings()
