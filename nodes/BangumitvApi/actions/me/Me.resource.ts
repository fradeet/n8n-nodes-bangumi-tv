import type { INodeProperties } from 'n8n-workflow';
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
				action: 'Get current user',
				description: 'Retrieve current authenticated user profile',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['me'] } },
	},
	...getProps,
];
