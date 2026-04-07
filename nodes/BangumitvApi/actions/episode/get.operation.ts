import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Episode ID',
		name: 'episodeId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/episodes/{{$value}}',
			},
		},
		displayOptions: {
			show: {
				resource: ['episode'],
				operation: ['get'],
			},
		},
	},
];