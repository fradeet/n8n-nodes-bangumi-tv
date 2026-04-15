import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/{{$value}}',
			},
		},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get'],
			},
		},
	},
];
