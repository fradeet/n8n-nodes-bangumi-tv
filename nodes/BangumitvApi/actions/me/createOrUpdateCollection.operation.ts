import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { collectionTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'POST', url: '=/v0/users/-/collections/{{$value}}' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const type = this.getNodeParameter('type', 0) as number | undefined;
						const rate = this.getNodeParameter('rate', 0) as number | undefined;
						const comment = this.getNodeParameter('comment', 0) as string | undefined;
						const tags = this.getNodeParameter('tags', 0) as string;
						const privacy = this.getNodeParameter('privacy', 0) as boolean | undefined;
						const body: Record<string, unknown> = {};
						if (type !== undefined) body.type = type;
						if (rate !== undefined) body.rate = rate;
						if (comment) body.comment = comment;
						if (tags) {
							const tagArray = tags
								.split(',')
								.map((t) => t.trim())
								.filter(Boolean);
							if (tagArray.length > 0) body.tags = tagArray;
						}
						if (privacy !== undefined) body.private = privacy;
						if (Object.keys(body).length > 0) requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['me'], operation: ['createOrUpdateCollection'] } },
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: collectionTypeOptions,
		default: 1,
		description: 'Collection type',
		displayOptions: { show: { resource: ['me'], operation: ['createOrUpdateCollection'] } },
	},
	{
		displayName: 'Rate',
		name: 'rate',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, maxValue: 10 },
		description: 'Rating (0-10)',
		displayOptions: { show: { resource: ['me'], operation: ['createOrUpdateCollection'] } },
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		description: 'Comment/review',
		displayOptions: { show: { resource: ['me'], operation: ['createOrUpdateCollection'] } },
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		description: 'Comma-separated tag names',
		displayOptions: { show: { resource: ['me'], operation: ['createOrUpdateCollection'] } },
	},
	{
		displayName: 'Private',
		name: 'privacy',
		type: 'boolean',
		default: false,
		description: 'Whether the collection is only visible to self',
		displayOptions: { show: { resource: ['me'], operation: ['createOrUpdateCollection'] } },
	},
];
