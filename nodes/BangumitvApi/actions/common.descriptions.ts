import type { INodeProperties } from 'n8n-workflow';

export const limitProperty: INodeProperties = {
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
	default: 30,
	typeOptions: {
		minValue: 1,
		maxValue: 50,
	},
	description: 'Max number of results to return',
};

export const limitPropertyLarge: INodeProperties = {
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
	default: 100,
	typeOptions: {
		minValue: 1,
		maxValue: 1000,
	},
	description: 'Max number of results to return',
};

export const offsetProperty: INodeProperties = {
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	typeOptions: {
		minValue: 0,
	},
	description: 'Number of results to skip',
};

export const subjectTypeOptions = [
	{ name: 'Book', value: 1 },
	{ name: 'Anime', value: 2 },
	{ name: 'Music', value: 3 },
	{ name: 'Game', value: 4 },
	{ name: 'Real', value: 6 },
];

export const collectionTypeOptions = [
	{ name: 'Wish', value: 1 },
	{ name: 'Done', value: 2 },
	{ name: 'Doing', value: 3 },
	{ name: 'On Hold', value: 4 },
	{ name: 'Dropped', value: 5 },
];

export const episodeCollectionTypeOptions = [
	{ name: 'Wish', value: 1 },
	{ name: 'Done', value: 2 },
	{ name: 'Dropped', value: 3 },
];

export const episodeTypeOptions = [
	{ name: 'Main Story', value: 0 },
	{ name: 'Special', value: 1 },
	{ name: 'OP', value: 2 },
	{ name: 'ED', value: 3 },
	{ name: 'PV/Promo', value: 4 },
	{ name: 'MAD', value: 5 },
	{ name: 'Other', value: 6 },
];

export const subjectSortOptions = [
	{ name: 'Date', value: 'date' },
	{ name: 'Rank', value: 'rank' },
];

export const searchSortOptions = [
	{ name: 'Match', value: 'match' },
	{ name: 'Heat', value: 'heat' },
	{ name: 'Rank', value: 'rank' },
	{ name: 'Score', value: 'score' },
];
