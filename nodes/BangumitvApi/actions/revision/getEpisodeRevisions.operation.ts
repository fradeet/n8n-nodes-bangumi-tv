import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Episode ID',
		name: 'episodeId',
		type: 'string',
		default: '',
		description: 'Filter by episode ID',
		displayOptions: {
			show: {
				resource: ['revision'],
				operation: ['getEpisodeRevisions'],
			},
		},
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/revisions/episodes',
				qs: { episode_id: '={{$value}}' },
			},
		},
	},
	{
		...limitProperty,
		displayOptions: {
			show: {
				resource: ['revision'],
				operation: ['getEpisodeRevisions'],
			},
		},
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: {
			show: {
				resource: ['revision'],
				operation: ['getEpisodeRevisions'],
			},
		},
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
