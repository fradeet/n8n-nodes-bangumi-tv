// nodes/BangumitvApi/actions/collection/getCharacterCollection.operation.ts
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
		displayOptions: { show: { resource: ['collection'], operation: ['getCharacterCollection'] } },
	},
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['collection'], operation: ['getCharacterCollection'] } },
	},
];
