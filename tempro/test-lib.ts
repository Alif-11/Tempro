import test from 'ava';
import {parseCommand} from './source/lib.js';

// Success path

test('parses valid command with no args', t => {
	t.deepEqual(parseCommand('new'), {command: 'new', args: undefined});
});

test('parses valid command with one arg', t => {
	t.deepEqual(parseCommand('edit 4'), {
		command: 'get',
		args: ['4'],
	});
});

test('is case insensitive', t => {
	t.deepEqual(parseCommand('NEW'), {command: 'new', args: undefined});
});

test('trims leading and trailing whitespace', t => {
	t.deepEqual(parseCommand('  getall  '), {command: 'getall', args: undefined});
});

test('accepts all five valid commands', t => {
	for (const cmd of ['new', 'get', 'getall', 'edit', 'rm'] as const) {
		t.notThrows(() => {
			parseCommand(cmd);
		});
	}
});

// Error path

test('throws on empty string', t => {
	const error = t.throws(() => {
		parseCommand('');
	});
	t.regex(error!.message, /empty after trimming/);
});

test('throws on whitespace-only string', t => {
	const error = t.throws(() => {
		parseCommand('   ');
	});
	t.regex(error!.message, /empty after trimming/);
});

test('throws on invalid command', t => {
	const error = t.throws(() => {
		parseCommand('foo');
	});
	t.regex(error!.message, /Invalid command/);
});
