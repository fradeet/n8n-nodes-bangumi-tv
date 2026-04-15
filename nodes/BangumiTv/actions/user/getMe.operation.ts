import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Get',
		name: 'get',
		type: 'hidden',
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/me',
			},
		},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getMe'],
			},
		},
	},
];
