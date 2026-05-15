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
				url: '=/v0/search/characters',
			},
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const keyword = this.getNodeParameter('keyword', 0) as string;
						const body: Record<string, unknown> = { keyword };
						requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: {
			show: {
				resource: ['character'],
				operation: ['search'],
			},
		},
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['character'], operation: ['search'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['character'], operation: ['search'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
