from pydantic import BaseModel, Field
from typing import Optional


class TaskCreateRequest(BaseModel):
    task_title: str = Field(..., min_length=1)
    end_date: str
    end_time: str
    task_description: Optional[str] = ""


class TaskUpdateRequest(BaseModel):
    task_title: Optional[str] = None
    end_date: Optional[str] = None
    end_time: Optional[str] = None
    task_description: Optional[str] = None


class TaskResponse(BaseModel):
    task_id: str
    task_title: str
    end_date: str
    end_time: str
    task_description: str


class ErrorResponse(BaseModel):
    detail: str
