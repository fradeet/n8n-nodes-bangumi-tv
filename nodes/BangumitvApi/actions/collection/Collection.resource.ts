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
			{ name: 'Create', value: 'create', action: 'Create a collection', description: 'Create or replace subject collection' },
			{ name: 'Get', value: 'get', action: 'Get a collection', description: 'Get single subject collection' },
			{ name: 'Get Character Collection', value: 'getCharacterCollection', action: 'Get a character collection', description: 'Get single character collection' },
			{ name: 'Get Character Collections', value: 'getCharacterCollections', action: 'Get character collections', description: 'Get user character collections' },
			{ name: 'Get Collections', value: 'getCollections', action: 'Get collections', description: 'Get user subject collections' },
			{ name: 'Get Episode', value: 'getEpisode', action: 'Get an episode', description: 'Get single episode collection' },
			{ name: 'Get Episodes', value: 'getEpisodes', action: 'Get episodes', description: 'Get episode collections for subject' },
			{ name: 'Get Person Collection', value: 'getPersonCollection', action: 'Get a person collection', description: 'Get single person collection' },
			{ name: 'Get Person Collections', value: 'getPersonCollections', action: 'Get person collections', description: 'Get user person collections' },
			{ name: 'Update', value: 'update', action: 'Update a collection', description: 'Update subject collection' },
			{ name: 'Update Episode', value: 'updateEpisode', action: 'Update an episode', description: 'Update single episode status' },
			{ name: 'Update Episodes', value: 'updateEpisodes', action: 'Update episodes', description: 'Bulk update episode status' },
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
