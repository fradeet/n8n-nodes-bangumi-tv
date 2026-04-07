import type { INodeProperties } from 'n8n-workflow';
import { properties as getAllProps } from './getAll.operation';
import { properties as getProps } from './get.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Get All', value: 'getAll', description: 'Get episodes for a subject' },
			{ name: 'Get', value: 'get', description: 'Get an episode by ID' },
		],
		default: 'getAll',
		displayOptions: {
			show: {
				resource: ['episode'],
			},
		},
	},
	...getAllProps,
	...getProps,
];