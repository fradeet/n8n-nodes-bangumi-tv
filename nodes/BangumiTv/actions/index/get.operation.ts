import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		default: '',
		routing: { request: { method: 'GET', url: '=/v0/indices/{{$value}}' } },
		displayOptions: { show: { resource: ['index'], operation: ['get'] } },
	},
];
