import type { INodeProperties } from 'n8n-workflow';
import { properties as getManyProps } from './getMany.operation';
import { properties as getProps } from './get.operation';
import { properties as getCollectionProps } from './getCollection.operation';
import { properties as getManyCollectionProps } from './getManyCollection.operation';
import { properties as updateCollectionProps } from './updateCollection.operation';
import { properties as updateManyCollectionsProps } from './updateManyCollections.operation';

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
				action: 'Get episode',
				description: 'Retrieve an episode detail',
			},
			{
				name: 'Get Collection',
				value: 'getCollection',
				action: 'Get episode collection status',
				description: 'Retrieve your watch status for an episode',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many episodes',
				description: 'List all episodes in a subject',
			},
			{
				name: 'Get Many Collection',
				value: 'getManyCollection',
				action: 'Get many episode collection',
				description: 'List all episode watch statuses for a subject',
			},
			{
				name: 'Update Collection',
				value: 'updateCollection',
				action: 'Update episode collection status',
				description: 'Update one episode collection status',
			},
			{
				name: 'Update Many Collection',
				value: 'updateManyCollections',
				action: 'Update episode collection statuses',
				description: 'Update episodes inside a subject',
			},
		],
		default: 'getMany',
		displayOptions: {
			show: {
				resource: ['episode'],
			},
		},
	},
	...getManyProps,
	...getProps,
	...getCollectionProps,
	...getManyCollectionProps,
	...updateCollectionProps,
	...updateManyCollectionsProps,
];
