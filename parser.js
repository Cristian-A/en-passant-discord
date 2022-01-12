
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { Name, Prefix, Roles, ColorCode } from './config.js';

var commands = [];

function handle(command, bot, message) {
	if (command.execute.constructor.name == 'AsyncFunction') {
		command.execute(message, bot).then(result => {
			if (result != undefined) sendMessage(bot, message.channelId, result);
		});
		return;
	}
	const result = command.execute(message, bot);
	if (result != undefined) sendMessage(bot, message.channelId, result);
}

export function parse(bot, message) {
	if (!message.content.startsWith(Prefix)) return;
	const content = message.content.split(/[ \t]+/g)[0].substring(1);
	for (let command of commands) {
		if (command.name == content ||
			command.aliases.includes(content)) {
			if (command.permissions.includes(Roles.everyone)) {
				handle(command, bot, message);
				return;
			}
			for (let role of message.member.roles) {
				if (command.permissions.includes(role)) {
					handle(command, bot, message);
					return;
				}
			}
		}
	}
}

export function createCommand(command) {
	if (typeof command.execute != 'function') return;
	if (command.name == undefined) return;
	if (command.aliases == undefined) command.aliases = [ ];
	if (command.hidden == undefined) command.hidden = false;
	if (command.permissions == undefined) {
		command.permissions = [ Roles.everyone];
	} else if (typeof command.permissions != 'object') {
		command.permissions = [ command.permissions ];
	}
	commands.push(command);
}

export function text(message) { return { content: message }; }

export function card(title, message, color) {
	return {
		embeds: [{
			title: title || Name,
			color: color || ColorCode.random(),
			description: message || ''
		}]
	};
}

export function error(title, message) {
	return {
		embeds: [{
			title: title || Name,
			color: ColorCode.error,
			description: message || ''
		}]
	};
}

export function info(title, message) {
	return {
		embeds: [{
			title: title || Name,
			color: ColorCode.info,
			description: message || ''
		}]
	};
}

export function success(title, message) {
	return {
		embeds: [{
			title: title || Name,
			color: ColorCode.success,
			description: message || ''
		}]
	};
}

export function warn(title, message) {
	return {
		embeds: [{
			title: title || Name,
			color: ColorCode.warn,
			description: message || ''
		}]
	};
}

export function createHelp(title, color) {
	return {
		embeds: [{
			type: 'rich',
			title: title || Name,
			color: color || ColorCode.random(),
			fields: commands.filter(command => !command.hidden).map(command => {
				return {
					name: `${command.emoji || ''} \`${Prefix}${command.name}\`:`,
					value: command.description || '',
					inline: false
				};
			})
		}]
	};
}
