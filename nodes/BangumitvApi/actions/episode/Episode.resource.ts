import type { INodeProperties } from 'n8n-workflow';
import { properties as getManyProps } from './getMany.operation';
import { properties as getProps } from './get.operation';

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
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many episodes',
				description: 'Retrieve episodes for a subject',
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
];
