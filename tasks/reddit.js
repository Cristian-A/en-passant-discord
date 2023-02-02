

import { Roles, Channels, Time } from '../config.js';
import { Database } from '../database.js';
import { createTask, send, text } from '../parser.js';

const ENDPOINT = 'https://www.reddit.com/r/thechessnerd.json?limit=1';

createTask({
	name: 'reddit', emoji: ':large_orange_diamond:', interval: Time.hours(6),
	description: 'Sends out the hot reddit post.',
	execute: async () => {
		const id = await Database.get('reddit_id');
		let data = await fetch(ENDPOINT);
		if (data.status != 200) return;
		data = await data.json();
		if (data == null || data == undefined) return;
		if (id != data.data.children[0].data.id) {
			Database.set('reddit_id', data.data.children[0].data.id);
			send(Channels.reddit, text(
				`Hey guys, check out our new <@&${Roles.reddit}> post!\n` +
				'https://www.reddit.com' + data.data.children[0].data.permalink
			));
		}
	}
});
