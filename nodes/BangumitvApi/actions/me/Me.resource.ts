import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as getCollectionProps } from './getCollection.operation';
import { properties as createOrUpdateCollectionProps } from './createOrUpdateCollection.operation';
import { properties as updateCollectionProps } from './updateCollection.operation';
import { properties as getEpisodesProps } from './getEpisodes.operation';
import { properties as updateEpisodesProps } from './updateEpisodes.operation';
import { properties as getEpisodeProps } from './getEpisode.operation';
import { properties as updateEpisodeProps } from './updateEpisode.operation';
import { properties as createCharacterCollectProps } from './createCharacterCollect.operation';
import { properties as deleteCharacterCollectProps } from './deleteCharacterCollect.operation';
import { properties as createPersonCollectProps } from './createPersonCollect.operation';
import { properties as deletePersonCollectProps } from './deletePersonCollect.operation';
import { properties as createIndexCollectProps } from './createIndexCollect.operation';
import { properties as deleteIndexCollectProps } from './deleteIndexCollect.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Create Character Collection',
				value: 'createCharacterCollect',
				action: 'Create character collection',
				description: "Add character to current user's collection",
			},
			{
				name: 'Create Index Collection',
				value: 'createIndexCollect',
				action: 'Create index collection',
				description: "Add index to current user's collection",
			},
			{
				name: 'Create or Update Collection',
				value: 'createOrUpdateCollection',
				action: 'Create or update subject collection',
				description: 'Create a new subject collection or update existing one',
			},
			{
				name: 'Create Person Collection',
				value: 'createPersonCollect',
				action: 'Create person collection',
				description: "Add person to current user's collection",
			},
			{
				name: 'Delete Character Collection',
				value: 'deleteCharacterCollect',
				action: 'Delete character collection',
				description: "Remove character from current user's collection",
			},
			{
				name: 'Delete Index Collection',
				value: 'deleteIndexCollect',
				action: 'Delete index collection',
				description: "Remove index from current user's collection",
			},
			{
				name: 'Delete Person Collection',
				value: 'deletePersonCollect',
				action: 'Delete person collection',
				description: "Remove person from current user's collection",
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get current user',
				description: 'Retrieve current authenticated user profile',
			},
			{
				name: 'Get Collection',
				value: 'getCollection',
				action: 'Get subject collection',
				description: 'Retrieve subject collection status for current user',
			},
			{
				name: 'Get Episode',
				value: 'getEpisode',
				action: 'Get episode collection',
				description: 'Retrieve single episode collection status',
			},
			{
				name: 'Get Many Episodes',
				value: 'getEpisodes',
				action: 'Get many episode collections',
				description: 'Retrieve episode collection statuses for a subject',
			},
			{
				name: 'Update Collection',
				value: 'updateCollection',
				action: 'Update subject collection',
				description: 'Update subject collection status for current user',
			},
			{
				name: 'Update Episode',
				value: 'updateEpisode',
				action: 'Update episode collection',
				description: 'Update single episode collection status',
			},
			{
				name: 'Update Episodes',
				value: 'updateEpisodes',
				action: 'Update episode collections',
				description: 'Update episode collection statuses for a subject',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['me'] } },
	},
	...getProps,
	...getCollectionProps,
	...createOrUpdateCollectionProps,
	...updateCollectionProps,
	...getEpisodesProps,
	...updateEpisodesProps,
	...getEpisodeProps,
	...updateEpisodeProps,
	...createCharacterCollectProps,
	...deleteCharacterCollectProps,
	...createPersonCollectProps,
	...deletePersonCollectProps,
	...createIndexCollectProps,
	...deleteIndexCollectProps,
];
