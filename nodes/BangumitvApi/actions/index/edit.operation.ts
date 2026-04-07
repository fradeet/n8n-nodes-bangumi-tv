import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'PUT', url: '=/v0/indices/{{$value}}' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const title = this.getNodeParameter('title', 0) as string | undefined;
						const description = this.getNodeParameter('description', 0) as string | undefined;
						const body: Record<string, unknown> = {};
						if (title) body.title = title;
						if (description) body.description = description;
						if (Object.keys(body).length > 0) requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['index'], operation: ['edit'] } },
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['edit'] } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['edit'] } },
	},
];
