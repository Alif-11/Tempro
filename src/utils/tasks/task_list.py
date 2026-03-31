import time
import copy
import uuid

class Task:

  def __init__(self, task_title: str, end_date: str, end_time: str, task_description: str = ""):
    self.task_id = str(uuid.uuid4())
    self.task_title = task_title
    self.end_date = end_date
    self.end_time = end_time
    self.task_description = task_description


  def edit(self, task_title: str = None, end_date: str = None, end_time: str = None, task_description: str = None):
    """
    Edits the current task.

    Precondition:   Ensure end_date and end_time are both valid (combined, they should happen
                    after today's date and current time).

    Postcondition:  The current task has successfully been modified.
    """

    if task_title is not None and task_title != "":
      self.task_title = task_title

    if end_date is not None and end_date != "":
      self.end_date = end_date

    if end_time is not None and end_time != "":
      self.end_time = end_time

    if task_description is not None and task_description != "":
      self.task_description = task_description
  

class TaskList:
  def __init__(self):
    self.task_list = []
  
  def add(self, task: Task):
    """
    Adds a task to the list of all tasks.

    Precondition:   Ensure task is a valid task (has a proper end date and end time).

    Postcondition:  The task has been succesfully added to our stored list of tasks.
    """
    self.task_list.append(task)
  
  def get_all_tasks(self):
    """
    Gets all tasks we currently have stored as a list of task objects.

    Precondition:   None
    Postcondition:  Returns a list of all topics we have on record. 
    """
    all_tasks_list = []
    for task in self.task_list:
      task_deepcopy = copy.deepcopy(task)
      all_tasks_list.append(task_deepcopy)
    
    return all_tasks_list

