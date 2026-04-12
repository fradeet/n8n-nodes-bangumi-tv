import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { episodeCollectionTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Episode ID',
		name: 'episodeId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'PUT', url: '=/v0/users/-/collections/-/episodes/{{$value}}' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const type = this.getNodeParameter('type', 0) as number;
						requestOptions.body = { type };
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['me'], operation: ['updateEpisode'] } },
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: episodeCollectionTypeOptions,
		required: true,
		default: 1,
		description: 'Episode collection type',
		displayOptions: { show: { resource: ['me'], operation: ['updateEpisode'] } },
	},
];
