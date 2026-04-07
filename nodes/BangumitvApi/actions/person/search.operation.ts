import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Keyword',
		name: 'keyword',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'POST',
				url: '=/v0/search/persons',
			},
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const keyword = this.getNodeParameter('keyword', 0) as string;
						const careers = this.getNodeParameter('careers', 0) as string[] | undefined;
						const body: Record<string, unknown> = { keyword };
						if (careers !== undefined && careers.length > 0) {
							body.filter = { career: careers };
						}
						requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Careers',
		name: 'careers',
		type: 'multiOptions',
		options: [
			{ name: 'Actor', value: 'actor' },
			{ name: 'Artist', value: 'artist' },
			{ name: 'Director', value: 'director' },
			{ name: 'Musician', value: 'musician' },
			{ name: 'Producer', value: 'producer' },
			{ name: 'Writer', value: 'writer' },
		],
		default: [],
		description: 'Filter by career type',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['search'],
			},
		},
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['person'], operation: ['search'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['person'], operation: ['search'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
