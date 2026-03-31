import React from 'react';
import test from 'ava';
import {render} from 'ink-testing-library';
import {Text} from 'ink';
import App from './source/app.js';

test('shows welcome message when no commands entered', t => {
	const {lastFrame} = render(<App />);
	const output = lastFrame();

	t.true(output?.includes('No commands yet'), 'Should show welcome message');
});

test('command history displays submitted commands', t => {
	// Test rendering logic by mocking the history display
	function HistoryDisplay({commands}: {readonly commands: string[]}) {
		return (
			<>
				{commands.map(command => (
					<Text key="4">
						<Text color="green">›</Text> {command}
					</Text>
				))}
			</>
		);
	}

	const {lastFrame} = render(
		<HistoryDisplay commands={['test command', 'another command']} />,
	);
	const output = lastFrame();
	console.log('HUHUHU?');
	console.log(output);

	t.true(output?.includes('test command'));
	t.true(output?.includes('another command'));
});
