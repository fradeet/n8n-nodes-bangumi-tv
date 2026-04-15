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
				url: '=/v0/users/{{$value}}/collections/-/persons/{{$parameter["personId"]}}',
			},
		},
		displayOptions: { show: { resource: ['collection'], operation: ['getPerson'] } },
	},
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['collection'], operation: ['getPerson'] } },
	},
];
