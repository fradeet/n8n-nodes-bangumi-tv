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
				method: 'POST',
				url: '=/v0/characters/{{$value}}/collect',
			},
		},
		displayOptions: {
			show: { resource: ['character'], operation: ['collect'] },
		},
	},
];
