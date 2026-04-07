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
			// eslint-disable-next-line n8n-nodes-base/node-param-operation-option-without-action, n8n-nodes-base/node-param-option-name-wrong-for-get-many
			{ name: 'Get All', value: 'getAll', description: 'Get episodes for a subject' },
			{ name: 'Get', value: 'get', action: 'Get an episode', description: 'Get an episode by ID' },
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