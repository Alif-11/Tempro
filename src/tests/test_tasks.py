import pytest
from src.utils.tasks.task_list import Task, TaskList


task_list = TaskList()

def test_initial_tasklist_has_no_tasks():
  assert len(task_list.get_all_tasks()) == 0
