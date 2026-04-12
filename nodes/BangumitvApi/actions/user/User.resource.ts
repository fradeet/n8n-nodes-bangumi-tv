import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as getAvatarProps } from './getAvatar.operation';
import { properties as getCollectionsProps } from './getCollections.operation';
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
			{
				name: 'Get',
				value: 'get',
				action: 'Get user',
				description: 'Retrieve user profile by username',
			},
			{
				name: 'Get Avatar',
				value: 'getAvatar',
				action: 'Get user avatar',
				description: 'Retrieve user avatar by username',
			},
			{
				name: 'Get Character Collection',
				value: 'getCharacterCollection',
				action: 'Get user character collection',
				description: 'Retrieve single character collection for user',
			},
			{
				name: 'Get Many Character Collections',
				value: 'getCharacterCollections',
				action: 'Get many user character collections',
				description: 'Retrieve character collections for user',
			},
			{
				name: 'Get Many Collections',
				value: 'getCollections',
				action: 'Get many user collections',
				description: 'Retrieve subject collections for user',
			},
			{
				name: 'Get Many Person Collections',
				value: 'getPersonCollections',
				action: 'Get many user person collections',
				description: 'Retrieve person collections for user',
			},
			{
				name: 'Get Person Collection',
				value: 'getPersonCollection',
				action: 'Get user person collection',
				description: 'Retrieve single person collection for user',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['user'] } },
	},
	...getProps,
	...getAvatarProps,
	...getCollectionsProps,
	...getCharacterCollectionsProps,
	...getCharacterCollectionProps,
	...getPersonCollectionsProps,
	...getPersonCollectionProps,
];
