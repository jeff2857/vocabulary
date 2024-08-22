import { openDB } from 'idb';

const DB_NAME = 'db';
const KEY_ARTICLE = 'article';
const KEY_WORDS = 'words';
const STORE_NAME = 'store';
const DB_VERSION = 3;

export const initDb = async () => {
	const db = await openDB(DB_NAME, DB_VERSION, {
		upgrade(db) {
			// if (!db.objectStoreNames.contains(STORE_ARTICLE)) {
			db.createObjectStore(STORE_NAME);
			// }
		},
	});
	return db;
};

export const getArticleList = async () => {
	const db = await initDb();
	const articles = await db.get(STORE_NAME, KEY_ARTICLE);
	if (!articles) return [];
	return (articles + '').split('`');
};

export const addArticle = async (articleName: string, words: string) => {
	const db = await initDb();
	const wordsKey = `${KEY_WORDS}_${articleName}`;
	let articles = ((await db.get(STORE_NAME, KEY_ARTICLE)) || '') as string;

	const articleAry = articles.split('`');
	if (!articleAry.includes(articleName)) {
		// insert
		if (articles) {
			articles += '`' + articleName;
		} else {
			articles = articleName;
		}
		db.put(STORE_NAME, articles, KEY_ARTICLE);
	}

	const wordsAry = words.replace('\n', '`');
	db.put(STORE_NAME, wordsAry, wordsKey);
};

export const delArticle = async (article: string) => {
	const db = await initDb();
	let articles = (await db.get(STORE_NAME, KEY_ARTICLE)) || '';
	const articleAry = (articles + '').split('`').filter((a) => a !== article);
	db.put(STORE_NAME, articleAry.join('`'), KEY_ARTICLE);
	const wordsKey = `${KEY_WORDS}_${article}`;
	db.delete(STORE_NAME, wordsKey);
};

export const getWords = async (article: string) => {
	const db = await initDb();
	const wordsKey = `${KEY_WORDS}_${article}`;
	const words = await db.get(STORE_NAME, wordsKey);
	return (words + '').replace('`', '\n');
};
