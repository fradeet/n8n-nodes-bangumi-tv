import type { INodeProperties } from 'n8n-workflow';
import { properties as getManyProps } from './getMany.operation';
import { properties as getProps } from './get.operation';
import { properties as getCollectionProps } from './getCollection.operation';
import { properties as getCollectionsProps } from './getCollections.operation';
import { properties as updateCollectionProps } from './updateCollection.operation';
import { properties as updateCollectionsProps } from './updateCollections.operation';

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
				description: 'Retrieve an episode by ID',
			},
			{
				name: 'Get Collection Status',
				value: 'getCollection',
				action: 'Get episode collection status',
				description: 'Retrieve your watch status for an episode',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many episodes',
				description: 'Retrieve episodes for a subject',
			},
			{
				name: 'Get Many Collection Statuses',
				value: 'getCollections',
				action: 'Get many episode collection statuses',
				description: 'Retrieve episode watch statuses for a subject',
			},
			{
				name: 'Update Collection Status',
				value: 'updateCollection',
				action: 'Update episode collection status',
				description: 'Update your watch status for an episode',
			},
			{
				name: 'Update Collection Statuses',
				value: 'updateCollections',
				action: 'Update episode collection statuses',
				description: 'Batch update watch statuses for episodes',
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
	...getCollectionsProps,
	...updateCollectionProps,
	...updateCollectionsProps,
];
