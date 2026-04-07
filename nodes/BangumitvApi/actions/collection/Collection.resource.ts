import type { INodeProperties } from 'n8n-workflow';
import { properties as getCollectionsProps } from './getCollections.operation';
import { properties as getProps } from './get.operation';
import { properties as createProps } from './create.operation';
import { properties as updateProps } from './update.operation';
import { properties as getEpisodesProps } from './getEpisodes.operation';
import { properties as updateEpisodesProps } from './updateEpisodes.operation';
import { properties as getEpisodeProps } from './getEpisode.operation';
import { properties as updateEpisodeProps } from './updateEpisode.operation';
import { properties as getCharacterCollectionsProps } from './getCharacterCollections.operation';
import { properties as getCharacterCollectionProps } from './getCharacterCollection.operation';
import { properties as getPersonCollectionsProps } from './getPersonCollections.operation';
import { properties as getPersonCollectionProps } from './getPersonCollection.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Get Collections', value: 'getCollections', description: 'Get user subject collections' },
			{ name: 'Get', value: 'get', description: 'Get single subject collection' },
			{ name: 'Create', value: 'create', description: 'Create or replace subject collection' },
			{ name: 'Update', value: 'update', description: 'Update subject collection' },
			{ name: 'Get Episodes', value: 'getEpisodes', description: 'Get episode collections for subject' },
			{ name: 'Update Episodes', value: 'updateEpisodes', description: 'Bulk update episode status' },
			{ name: 'Get Episode', value: 'getEpisode', description: 'Get single episode collection' },
			{ name: 'Update Episode', value: 'updateEpisode', description: 'Update single episode status' },
			{ name: 'Get Character Collections', value: 'getCharacterCollections', description: 'Get user character collections' },
			{ name: 'Get Character Collection', value: 'getCharacterCollection', description: 'Get single character collection' },
			{ name: 'Get Person Collections', value: 'getPersonCollections', description: 'Get user person collections' },
			{ name: 'Get Person Collection', value: 'getPersonCollection', description: 'Get single person collection' },
		],
		default: 'getCollections',
		displayOptions: { show: { resource: ['collection'] } },
	},
	...getCollectionsProps,
	...getProps,
	...createProps,
	...updateProps,
	...getEpisodesProps,
	...updateEpisodesProps,
	...getEpisodeProps,
	...updateEpisodeProps,
	...getCharacterCollectionsProps,
	...getCharacterCollectionProps,
	...getPersonCollectionsProps,
	...getPersonCollectionProps,
];
