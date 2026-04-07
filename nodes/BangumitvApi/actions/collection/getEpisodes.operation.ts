import type { INodeProperties } from 'n8n-workflow';
import { limitPropertyLarge, offsetProperty, episodeTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/-/collections/{{$value}}/episodes',
			},
		},
		displayOptions: { show: { resource: ['collection'], operation: ['getEpisodes'] } },
	},
	{
		displayName: 'Episode Type',
		name: 'episodeType',
		type: 'options',
		options: episodeTypeOptions,
		default: 0,
		description: 'Filter by episode type',
		displayOptions: { show: { resource: ['collection'], operation: ['getEpisodes'] } },
		routing: { request: { qs: { episode_type: '={{$value}}' } } },
	},
	{
		...limitPropertyLarge,
		displayOptions: { show: { resource: ['collection'], operation: ['getEpisodes'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['collection'], operation: ['getEpisodes'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
