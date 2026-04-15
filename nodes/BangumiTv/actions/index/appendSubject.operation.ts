import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'POST', url: '=/v0/indices/{{$value}}/subjects' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const subjectId = this.getNodeParameter('subjectId', 0) as string;
						const sort = this.getNodeParameter('sort', 0) as number | undefined;
						const comment = this.getNodeParameter('comment', 0) as string | undefined;
						const body: Record<string, unknown> = { subject_id: Number(subjectId) };
						if (sort !== undefined) body.sort = sort;
						if (comment) body.comment = comment;
						requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['index'], operation: ['appendSubject'] } },
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['appendSubject'] } },
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'number',
		description: 'Sort order (lower = first)',
		default: 0,
		displayOptions: { show: { resource: ['index'], operation: ['appendSubject'] } },
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['appendSubject'] } },
	},
];
