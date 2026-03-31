# Tempro Frontend-to-Backend Integration Guide

This guide explains how to run and use the integrated Tempro task management system.

## Architecture

- **Frontend**: React/Ink-based TUI (Terminal UI) in `/tempro/`
- **Backend**: FastAPI REST API in `/src/api/`
- **Commands**: new, get, getall, edit, rm

## Setup

### 1. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies

```bash
cd tempro
npm install
```

### 3. Build Frontend

```bash
cd tempro
npm run build
```

## Running the Application

You need to run both the backend and frontend in separate terminals.

### Terminal 1: Start Backend Server

```bash
# From project root
uvicorn src.api.main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### Terminal 2: Run Frontend TUI

```bash
cd tempro
npm start
```

## Usage

### Command Format

#### Create a new task (new)
```
new "Task Title" YYYY-MM-DD HH:MM "Description"
```
Example:
```
new "Complete project" 2026-04-01 14:00 "Finish the integration"
```

#### Get a specific task (get)
```
get <task_id>
```
Example:
```
get 550e8400-e29b-41d4-a716-446655440000
```

#### Get all tasks (getall)
```
getall
```

#### Edit a task (edit)
```
edit <task_id> ["New Title"] [YYYY-MM-DD] [HH:MM] ["New Description"]
```
Example:
```
edit 550e8400-e29b-41d4-a716-446655440000 "Updated Title" 2026-04-02 15:00
```

#### Remove a task (rm)
```
rm <task_id>
```
Example:
```
rm 550e8400-e29b-41d4-a716-446655440000
```

## API Endpoints

| Command  | HTTP Method | Endpoint           | Description           |
|----------|-------------|--------------------|-----------------------|
| new      | POST        | /api/tasks         | Create a new task     |
| get      | GET         | /api/tasks/{id}    | Get a specific task   |
| getall   | GET         | /api/tasks         | Get all tasks         |
| edit     | PUT         | /api/tasks/{id}    | Update a task         |
| rm       | DELETE      | /api/tasks/{id}    | Delete a task         |

## File Structure

```
.
├── src/
│   ├── api/
│   │   ├── main.py              # FastAPI app
│   │   ├── models.py            # Pydantic models
│   │   ├── dependencies.py      # Dependency injection
│   │   └── routes/
│   │       └── tasks.py         # Task endpoints
│   └── utils/
│       └── tasks/
│           └── task_list.py     # Task and TaskList classes
├── tempro/
│   └── source/
│       ├── app.tsx              # Main TUI component
│       ├── api.ts               # HTTP client
│       ├── types.ts             # TypeScript types
│       └── lib.ts               # Command parser
└── requirements.txt             # Python dependencies
```

## Development Tips

1. **Keep backend running**: The frontend needs the backend to process commands
2. **Check backend logs**: Backend terminal shows request logs for debugging
3. **API docs**: Visit `http://localhost:8000/docs` to test endpoints directly
4. **Task IDs**: Copy task IDs from the output to use with get/edit/rm commands
5. **Data persistence**: Tasks are stored in memory and will be lost on server restart

## Troubleshooting

### "Cannot connect to backend server"
- Ensure backend is running on port 8000
- Check if another process is using port 8000: `lsof -i :8000`

### Import errors in backend
- Ensure all `__init__.py` files exist in Python directories
- Run from project root, not from `/src/`

### Frontend build errors
- Delete `tempro/node_modules` and run `npm install` again
- Ensure TypeScript compiles: `npm run build`

## Next Steps

- Add data persistence (JSON file or database)
- Implement multi-step input for better UX
- Add task validation (date/time must be in future)
- Add task filtering and sorting
- Add task completion status
