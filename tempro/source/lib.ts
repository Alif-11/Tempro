export type Command = 'new' | 'get' | 'getall' | 'edit' | 'rm';

export type ParsedCommand = {
	command: Command;
	args?: string[];
};

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
