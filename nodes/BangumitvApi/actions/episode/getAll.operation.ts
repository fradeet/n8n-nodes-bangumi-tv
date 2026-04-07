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
				url: '=/v0/episodes',
				qs: { subject_id: '={{$value}}' },
			},
		},
		displayOptions: {
			show: {
				resource: ['episode'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Episode Type',
		name: 'episodeType',
		type: 'options',
		options: episodeTypeOptions,
		description: 'Filter by episode type',
		default: '',
		displayOptions: {
			show: {
				resource: ['episode'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { type: '={{$value}}' } } },
	},
	{
		...limitPropertyLarge,
		displayOptions: {
			show: {
				resource: ['episode'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: {
			show: {
				resource: ['episode'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];