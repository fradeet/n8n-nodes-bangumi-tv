import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { episodeCollectionTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'PATCH', url: '=/v0/users/-/collections/{{$value}}/episodes' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const episodeIds = this.getNodeParameter('episodeIds', 0) as string;
						const type = this.getNodeParameter('type', 0) as number;
						requestOptions.body = {
							episode_id: episodeIds.split(',').map(Number),
							type,
						};
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['episode'], operation: ['updateManyCollections'] } },
	},
	{
		displayName: 'Episode IDs',
		name: 'episodeIds',
		type: 'string',
		required: true,
		default: '',
		description: 'Comma-separated episode IDs',
		displayOptions: { show: { resource: ['episode'], operation: ['updateManyCollections'] } },
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: episodeCollectionTypeOptions,
		required: true,
		default: 1,
		description: 'Episode collection type',
		displayOptions: { show: { resource: ['episode'], operation: ['updateManyCollections'] } },
	},
];
