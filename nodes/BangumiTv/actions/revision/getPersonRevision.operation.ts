import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Revision ID',
		name: 'revisionId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/revisions/persons/{{$value}}',
			},
		},
		displayOptions: {
			show: {
				resource: ['revision'],
				operation: ['getPersonRevision'],
			},
		},
	},
];
