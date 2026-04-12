import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'POST',
				url: '=/v0/persons/{{$value}}/collect',
			},
		},
		displayOptions: {
			show: { resource: ['me'], operation: ['createPersonCollect'] },
		},
	},
];
