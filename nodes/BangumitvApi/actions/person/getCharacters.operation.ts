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
				method: 'GET',
				url: '=/v0/persons/{{$value}}/characters',
			},
		},
		displayOptions: {
			show: { resource: ['person'], operation: ['getCharacters'] },
		},
	},
];
