import React, {useState} from 'react';
import {Box, Text, useStdout} from 'ink';
import TextInput from 'ink-text-input';
import {parseCommand} from './lib.js';
import {
	createTask,
	getTask,
	getAllTasks,
	updateTask,
	deleteTask,
	getErrorMessage,
} from './api.js';
import type {Task} from './types.js';

export default function App() {
	// Used to track current text input value
	const [query, setQuery] = useState('');
	// Used to keep track of all previously sent messages
	const [history, setHistory] = useState<string[]>([]);
	// Loading state for API calls
	const [loading, setLoading] = useState(false);
	// Solely used to figure out terminal height (for message vertical spacing purposes)
	const {stdout} = useStdout();

	const addToHistory = (message: string, isError = false) => {
		const prefix = isError ? '[ERROR]' : '[OK]';
		setHistory(previousHistory => [...previousHistory, `${prefix} ${message}`]);
	};

	const formatTask = (task: Task): string => {
		return `Task: ${task.task_title} | ID: ${task.task_id} | Due: ${task.end_date} ${task.end_time}${task.task_description ? ` | Desc: ${task.task_description}` : ''}`;
	};

	/**
	 * Handles command submission by parsing and executing API calls
	 * @side_effect Updates chat history and current command line text value
	 */
	const handleSubmit = async (value: string) => {
		// Add user input to history
		setHistory(previousHistory => [
			...previousHistory,
			`> ${value}`,
		]);
		setQuery('');

		if (loading) {
			addToHistory('Please wait for the current command to complete', true);
			return;
		}

		try {
			setLoading(true);
			const parsed = parseCommand(value);

			switch (parsed.command) {
				case 'new': {
					// Expected format: new "Task Title" YYYY-MM-DD HH:MM "Description" (description optional)
					if (!parsed.args || parsed.args.length < 3) {
						addToHistory(
							'Usage: new "Task Title" YYYY-MM-DD HH:MM ["Description"]',
							true,
						);
						break;
					}

					const title = parsed.args[0]!.replace(/^["']|["']$/g, '');
					const date = parsed.args[1]!;
					const time = parsed.args[2]!;
					const description =
						parsed.args.length > 3
							? parsed.args.slice(3).join(' ').replace(/^["']|["']$/g, '')
							: '';

					const newTask = await createTask({
						task_title: title,
						end_date: date,
						end_time: time,
						task_description: description,
					});
					addToHistory(`Created: ${formatTask(newTask)}`);
					break;
				}

				case 'get': {
					// Expected format: get <task_id>
					if (!parsed.args || parsed.args.length === 0) {
						addToHistory('Usage: get <task_id>', true);
						break;
					}

					const taskId = parsed.args[0]!;
					const task = await getTask(taskId);
					addToHistory(formatTask(task));
					break;
				}

				case 'getall': {
					const tasks = await getAllTasks();
					if (tasks.length === 0) {
						addToHistory('No tasks found');
					} else {
						addToHistory(`Found ${tasks.length} task(s):`);
						for (const task of tasks) {
							addToHistory(formatTask(task));
						}
					}

					break;
				}

				case 'edit': {
					// Expected format: edit <task_id> ["title"] [date] [time] ["description"]
					// At least task_id and one field to update is required
					if (!parsed.args || parsed.args.length < 2) {
						addToHistory(
							'Usage: edit <task_id> ["New Title"] [YYYY-MM-DD] [HH:MM] ["New Desc"]',
							true,
						);
						break;
					}

					const taskId = parsed.args[0]!;
					const updateData: {
						task_title?: string;
						end_date?: string;
						end_time?: string;
						task_description?: string;
					} = {};

					// Parse optional fields from remaining args
					if (parsed.args.length > 1) {
						updateData.task_title = parsed.args[1]!.replace(/^["']|["']$/g, '');
					}

					if (parsed.args.length > 2) {
						updateData.end_date = parsed.args[2]!;
					}

					if (parsed.args.length > 3) {
						updateData.end_time = parsed.args[3]!;
					}

					if (parsed.args.length > 4) {
						updateData.task_description = parsed.args
							.slice(4)
							.join(' ')
							.replace(/^["']|["']$/g, '');
					}

					const updatedTask = await updateTask(taskId, updateData);
					addToHistory(`Updated: ${formatTask(updatedTask)}`);
					break;
				}

				case 'rm': {
					// Expected format: rm <task_id>
					if (!parsed.args || parsed.args.length === 0) {
						addToHistory('Usage: rm <task_id>', true);
						break;
					}

					const taskId = parsed.args[0]!;
					await deleteTask(taskId);
					addToHistory(`Deleted task: ${taskId}`);
					break;
				}
			}
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			addToHistory(errorMessage, true);
		} finally {
			setLoading(false);
		}
	};

	// Get terminal height to fill the entire screen
	const terminalHeight = stdout?.rows ?? 24;

	const inputHeight = 3;
	const borderHeight = 2; // Top and bottom borders
	const maxHistoryHeight = terminalHeight - inputHeight - borderHeight;

	// Only show commands that fit in available space
	const visibleHistory = history.slice(-maxHistoryHeight);

	return (
		<Box flexDirection="column" height={terminalHeight}>
			{/* Command History Area - fills remaining space */}
			<Box flexDirection="column" height={maxHistoryHeight}>
				{history.length === 0 ? (
					<Text dimColor>No commands yet. Try: getall, new "Task" 2026-04-01 14:00</Text>
				) : (
					visibleHistory.map((line, index) => {
						const key = `${index}-${line.slice(0, 20)}`;
						if (line.startsWith('> ')) {
							return (
								<Text key={key}>
									<Text color="#1fd01f">{'>'}</Text> {line.slice(2)}
								</Text>
							);
						}

						if (line.startsWith('[ERROR]')) {
							return (
								<Text key={key} color="red">
									{line}
								</Text>
							);
						}

						if (line.startsWith('[OK]')) {
							return (
								<Text key={key} color="green">
									{line}
								</Text>
							);
						}

						return <Text key={key}>{line}</Text>;
					})
				)}
				{loading && <Text color="yellow">Processing...</Text>}
			</Box>

			{/* Spacer - 18% from bottom */}
			<Box height={1} />

			{/* Text input section - 3 rows with borders */}
			<Box
				borderBottom
				borderTop
				borderLeft={false}
				borderRight={false}
				borderStyle="single"
				flexDirection="column"
				height={3}
				width="100%"
			>
				<TextInput value={query} onChange={setQuery} onSubmit={handleSubmit} />
			</Box>
		</Box>
	);
}
