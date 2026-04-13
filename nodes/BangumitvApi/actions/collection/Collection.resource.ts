// nodes/BangumitvApi/actions/collection/Collection.resource.ts
import type { INodeProperties } from 'n8n-workflow';
import { properties as getManyProps } from './getMany.operation';
import { properties as getCharacterCollectionProps } from './getCharacterCollection.operation';
import { properties as getCharacterCollectionsProps } from './getCharacterCollections.operation';
import { properties as getPersonCollectionProps } from './getPersonCollection.operation';
import { properties as getPersonCollectionsProps } from './getPersonCollections.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many collections',
				description: "View a user's collected subjects",
			},
			{
				name: 'Get Character Collection',
				value: 'getCharacterCollection',
				action: 'Get character collection',
				description: "View a user's collected character",
			},
			{
				name: 'Get Many Character Collections',
				value: 'getCharacterCollections',
				action: 'Get many character collections',
				description: "View a user's collected characters",
			},
			{
				name: 'Get Person Collection',
				value: 'getPersonCollection',
				action: 'Get person collection',
				description: "View a user's collected person",
			},
			{
				name: 'Get Many Person Collections',
				value: 'getPersonCollections',
				action: 'Get many person collections',
				description: "View a user's collected persons",
			},
		],
		default: 'getMany',
		displayOptions: { show: { resource: ['collection'] } },
	},
	...getManyProps,
	...getCharacterCollectionProps,
	...getCharacterCollectionsProps,
	...getPersonCollectionProps,
	...getPersonCollectionsProps,
];
