import React, {useState} from 'react';
import {Box, Text} from 'ink';
import TextInput from 'ink-text-input';

type AppProps = {
	readonly name: string | undefined;
};

export default function App({name}: AppProps) {
	const [query, setQuery] = useState('');
	const [taskList, setTaskList] = useState<string[]>([]);
	const [chatLog, setChatLog] = useState<string[]>([]);

	const handleSubmit = (value: string) => {
		setChatLog([...chatLog, `User: ${value}`, `Bot: You said "${value}"`]);
		setQuery('');

		const splitValue = value.split(' ');

		if (splitValue.length > 1) {
			if (splitValue[0] === 'new') {
				setChatLog([
					...chatLog,
					`User: ${value}`,
					`Bot: New task made! (Nothing in backend changed, just a frontend change.)`,
				]);

				setTaskList([...taskList, `{split_value[1]}`]);
				setQuery('');
			}
		} else {
			setChatLog([
				...chatLog,
				`Bot: Invalid command with the operation ${value}!`,
			]);
		}

		console.log(`here is the name: ${name ?? 'undefined name'}`);
	};

	return (
		<Box flexDirection="column">
			{chatLog.map(line => (
				<Text key={line}>{line}</Text>
			))}
			<Box marginTop={1}>
				<Text color="green">Chat: </Text>
				<TextInput value={query} onChange={setQuery} onSubmit={handleSubmit} />
			</Box>
		</Box>
	);
}
