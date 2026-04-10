import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'PUT',
				url: '=/v0/indices/{{$value}}/subjects/{{$parameter["subjectId"]}}',
			},
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const sort = this.getNodeParameter('sort', 0) as number | undefined;
						const comment = this.getNodeParameter('comment', 0) as string | undefined;
						const body: Record<string, unknown> = {};
						if (sort !== undefined) body.sort = sort;
						if (comment) body.comment = comment;
						if (Object.keys(body).length > 0) requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['index'], operation: ['editSubject'] } },
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['editSubject'] } },
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['index'], operation: ['editSubject'] } },
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['editSubject'] } },
	},
];
