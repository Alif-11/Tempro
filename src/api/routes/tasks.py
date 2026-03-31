from fastapi import APIRouter, HTTPException, Depends
from typing import List
from src.api.models import TaskCreateRequest, TaskUpdateRequest, TaskResponse
from src.api.dependencies import get_task_list
from src.utils.tasks.task_list import TaskList, Task

router = APIRouter()


@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(
    task_data: TaskCreateRequest,
    task_list: TaskList = Depends(get_task_list)
):
    """
    Create a new task (handles 'new' command)
    """
    new_task = Task(
        task_title=task_data.task_title,
        end_date=task_data.end_date,
        end_time=task_data.end_time,
        task_description=task_data.task_description or ""
    )
    task_list.add(new_task)

    return TaskResponse(
        task_id=new_task.task_id,
        task_title=new_task.task_title,
        end_date=new_task.end_date,
        end_time=new_task.end_time,
        task_description=new_task.task_description
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    task_list: TaskList = Depends(get_task_list)
):
    """
    Get a specific task by ID (handles 'get' command)
    """
    task = task_list.get_task_by_id(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found")

    return TaskResponse(
        task_id=task.task_id,
        task_title=task.task_title,
        end_date=task.end_date,
        end_time=task.end_time,
        task_description=task.task_description
    )


@router.get("", response_model=List[TaskResponse])
async def get_all_tasks(task_list: TaskList = Depends(get_task_list)):
    """
    Get all tasks (handles 'getall' command)
    """
    tasks = task_list.get_all_tasks()
    return [
        TaskResponse(
            task_id=task.task_id,
            task_title=task.task_title,
            end_date=task.end_date,
            end_time=task.end_time,
            task_description=task.task_description
        )
        for task in tasks
    ]


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdateRequest,
    task_list: TaskList = Depends(get_task_list)
):
    """
    Update a task (handles 'edit' command)
    """
    update_fields = task_data.model_dump(exclude_unset=True)
    updated_task = task_list.update_task(task_id, **update_fields)

    if updated_task is None:
        raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found")

    return TaskResponse(
        task_id=updated_task.task_id,
        task_title=updated_task.task_title,
        end_date=updated_task.end_date,
        end_time=updated_task.end_time,
        task_description=updated_task.task_description
    )


@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: str,
    task_list: TaskList = Depends(get_task_list)
):
    """
    Delete a task (handles 'rm' command)
    """
    deleted = task_list.delete_task(task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found")
