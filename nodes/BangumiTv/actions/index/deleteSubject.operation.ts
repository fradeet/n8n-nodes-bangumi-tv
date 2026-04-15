import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'DELETE',
				url: '=/v0/indices/{{$value}}/subjects/{{$parameter["subjectId"]}}',
			},
		},
		displayOptions: { show: { resource: ['index'], operation: ['deleteSubject'] } },
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['deleteSubject'] } },
	},
];
