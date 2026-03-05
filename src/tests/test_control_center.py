from src.tempro.control_center import TaskManager

async def test_input_exists():
  app = TaskManager()
  async with app.run_test() as pilot:
    await pilot.press("h")
    assert app.query_one("#task_cli").value == 'h'