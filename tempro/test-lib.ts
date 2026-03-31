import test from 'ava';
import {parseCommand} from './source/lib.js';

// Success path

test('parses valid command with no args', t => {
	t.deepEqual(parseCommand('new'), {command: 'new', args: undefined});
});

test('parses valid command with one arg', t => {
	t.deepEqual(parseCommand('edit 4'), {
		command: 'edit',
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

test('throws on extra whitespace between arguments', t => {
	const error = t.throws(() => {
		parseCommand('edit  4');
	});
	t.regex(error!.message, /too many spaces/);
	t.regex(error!.message, /edit {2}4/);
});

test('throws on triple spaces between arguments', t => {
	const error = t.throws(() => {
		parseCommand('edit   4');
	});
	t.regex(error!.message, /too many spaces/);
});

test('throws on multiple spaces in middle of multi-arg command', t => {
	const error = t.throws(() => {
		parseCommand('new   task');
	});
	t.regex(error!.message, /too many spaces/);
	t.regex(error!.message, /new {3}task/);
});
