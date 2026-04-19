import React, {useState} from 'react';
import {Box, Text, useStdout} from 'ink';
import TextInput from 'ink-text-input';
import {parseCommand} from './lib.js';
import {createLogger, format, transports} from 'winston';

type HistoryEntry = {
	command: string;
	error?: string;
};

export default function App() {
	// Used to track current text input value
	const [query, setQuery] = useState('');
	// Used to keep track of all previously sent messages
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	// Solely used to figure out terminal height (for message vertical spacing purposes)
	const {stdout} = useStdout();

	const logger = createLogger({
		level: 'debug',
		format: format.combine(
			format.timestamp({
				format: 'YYYY-MM-DD HH:mm:ss',
			}),
			format.errors({stack: true}),
			format.splat(),
			format.json(),
		),
		defaultMeta: {service: 'tempro'},
		transports: [
			//
			// - Write to all logs with level `info` and below to `quick-start-combined.log`.
			// - Write all logs error (and below) to `quick-start-error.log`.
			//
			new transports.File({filename: 'log/app-error.log', level: 'debug'}),
		],
	});

	/**
	 * @purpose Callback function to manage history state when inputting text values into the app's command line
	 * @precondition The `value` parameter must be alphanumeric
	 * @postcondition Updates chat history and current command line text value
	 */
	const handleSubmit = (value: string) => {
		const historyEntry: HistoryEntry = {command: ''};
		historyEntry.command = value;

		try {
			parseCommand(value);
		} catch (error: unknown) {
			historyEntry.error =
				error instanceof Error ? error.message : 'Unknown error';
		}

		setHistory(entries => [...entries, historyEntry]);
		setQuery('');
	};

	// Get terminal height to fill the entire screen
	const terminalHeight = stdout?.rows ?? 24;

	const inputHeight = 3;
	const borderHeight = 2; // Top and bottom borders
	const maxHistoryHeight = terminalHeight - inputHeight - borderHeight;

	// Only show commands that fit in available space
	const visibleHistory = history.slice(-maxHistoryHeight);
	logger.log({
		level: 'debug',
		message: `Max history is of height ${maxHistoryHeight.toString()}`,
		terminalHeight: `Number of rows allocated to the view of the tempro app: ${terminalHeight.toString()}`,
		visibleHistoryLength: `Length of visible history is ${visibleHistory.length.toString()}`,
		visibleHistoryContent: `Visible history content is ${JSON.stringify(
			visibleHistory,
		)}`,
	});

	return (
		<Box flexDirection="column" height={terminalHeight}>
			{/* Command History Area - fills remaining space */}
			<Box flexDirection="column" height={maxHistoryHeight} overflowY="hidden">
				{history.length === 0 ? (
					<Text dimColor>No commands yet. Type something and press Enter.</Text>
				) : (
					/*(
						visibleHistory.map(_ => <Text key="4"></Text>)
					)*/
					visibleHistory.map((entry, index) => (
						<Text key={`${index}`}>
							{entry.error ? (
								<Text color="red">{entry.error}</Text>
							) : (
								<>
									<Text color="#1fd01f">{'>'}</Text> {entry.command}
								</>
							)}
						</Text>
					))
				)}
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
