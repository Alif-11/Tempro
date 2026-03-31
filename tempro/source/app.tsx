import React, {useState} from 'react';
import {Box, Text, useStdout} from 'ink';
import TextInput from 'ink-text-input';
import {parseCommand} from './lib.js';

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

	/**
	 * @side_effect Updates chat history and current command line text value
	 */
	const handleSubmit = (value: string) => {
		try {
			parseCommand(value);
			setHistory(previousHistory => [...previousHistory, {command: value}]);
		} catch (error: unknown) {
			setHistory(previousHistory => [
				...previousHistory,
				{
					command: value,
					error: error instanceof Error ? error.message : 'Unknown error',
				},
			]);
		}

		setQuery('');
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
					<Text dimColor>No commands yet. Type something and press Enter.</Text>
				) : (
					visibleHistory.map((entry, index) => (
						<Text key={`${entry.command}-${index}`}>
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
