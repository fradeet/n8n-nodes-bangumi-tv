import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/subjects/{{$value}}/image',
			},
		},
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getImage'],
			},
		},
	},
];
