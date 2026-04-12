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
				url: '=/v0/users/{{$value}}/collections/-/characters/{{$parameter["characterId"]}}',
			},
		},
		displayOptions: { show: { resource: ['user'], operation: ['getCharacterCollection'] } },
	},
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['getCharacterCollection'] } },
	},
];
