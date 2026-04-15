import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'POST',
				url: '=/v0/indices',
			},
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const title = this.getNodeParameter('title', 0) as string;
						const description = this.getNodeParameter('description', 0) as string | undefined;
						const body: Record<string, unknown> = { title };
						if (description) body.description = description;
						requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['index'], operation: ['create'] } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['create'] } },
	},
];
