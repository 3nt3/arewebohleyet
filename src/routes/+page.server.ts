import type { PageLoad } from './$types';
import * as cheerio from 'cheerio';

export const load: PageLoad = async () => {
	const text = await (await fetch('http://bohlebots.de/door/last.php')).text();
	const loaded = cheerio.load(text);
	// get the second h1 element's text
	const last = loaded('h1').eq(1).text().trim();

	return {
		last,
		wasJonathan: last === 'Jonathan'
	};
};
