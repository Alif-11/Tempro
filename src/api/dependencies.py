from src.utils.tasks.task_list import TaskList

# Singleton TaskList instance shared across all requests
task_list = TaskList()


def get_task_list() -> TaskList:
    """Dependency injection for TaskList"""
    return task_list
