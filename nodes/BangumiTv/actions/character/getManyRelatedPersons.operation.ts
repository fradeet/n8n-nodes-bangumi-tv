import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/characters/{{$value}}/persons',
			},
		},
		displayOptions: {
			show: { resource: ['character'], operation: ['getManyRelatedPersons'] },
		},
	},
];
