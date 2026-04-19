export type Command = 'new' | 'get' | 'getall' | 'edit' | 'rm';

export type ParsedCommand = {
	command: Command;
	args?: string[];
};

/**
 * @purpose Parses a string to return the command and command arguments embedded within it
 * @precondition The `input` parameter must be alphanumeric
 * @postcondition Returns the parsed command and arguments as a variable of type ParsedCommand - which has command and args as its fields.
 * @sideeffect Will throw errors if `input` is empty, has more than two or more spaces within the executed command, or the parsed command is not one of the five valid commands.
 */
export function parseCommand(input: string): ParsedCommand {
	const trimmed = input.trim();

	if (!trimmed) {
		throw new Error(
			'Input string is empty after trimming, when it should contain content',
		);
	}

	if (/\s{2,}/.test(trimmed)) {
		throw new Error(`Invalid command: '${trimmed}' has too many spaces`);
	}

	const parts = trimmed.split(' ');
	const commandString = parts[0];

	if (!commandString) {
		throw new Error('Failed to extract command from input after splitting');
	}

	const commandLower = commandString.toLowerCase();
	const validCommands: Command[] = ['new', 'get', 'getall', 'edit', 'rm'];

	if (!validCommands.includes(commandLower as Command)) {
		throw new Error(
			`Invalid command: "${commandLower}". Valid commands are: ${validCommands.join(
				', ',
			)}`,
		);
	}

	const command = commandLower as Command;

	const args = parts.length > 1 ? parts.slice(1) : undefined;

	return {
		command,
		args,
	};
}
