import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { limitProperty, offsetProperty, searchSortOptions } from '../common.descriptions';

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
				url: '=/v0/search/subjects',
			},
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const keyword = this.getNodeParameter('keyword', 0) as string;
						const sort = this.getNodeParameter('sort', 0) as string;
						const body: Record<string, unknown> = { keyword };
						if (sort) body.sort = sort;
						requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'options',
		options: searchSortOptions,
		default: 'match',
		description: 'Sort order for results',
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['search'],
			},
		},
	},
	{
		...limitProperty,
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['search'],
			},
		},
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['search'],
			},
		},
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
