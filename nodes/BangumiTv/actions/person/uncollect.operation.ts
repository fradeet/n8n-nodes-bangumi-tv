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
				method: 'DELETE',
				url: '=/v0/persons/{{$value}}/collect',
			},
		},
		displayOptions: {
			show: { resource: ['person'], operation: ['uncollect'] },
		},
	},
];
