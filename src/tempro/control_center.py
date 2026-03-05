from textual.app import App, ComposeResult
from textual.widgets import Input, Header, Footer, Static

class TaskManager(App):
    """A simple Textual app with a text input field."""
    
    # Optional CSS to style the interface
    CSS = """
    Input {
        margin: 1 2;
        border: solid green;
    }
    #output {
        margin: 1 2;
        color: cyan;
    }
    """

    def compose(self) -> ComposeResult:
        """Create child widgets for the app."""
        yield Header()
        yield Input(id='task_cli')
        yield Footer()

    def on_input_submitted(self, event: Input.Submitted) -> None:
        """Handle the 'enter' key being pressed in the input field."""
        pass
        

if __name__ == "__main__":
    app = TaskManager()
    app.run()