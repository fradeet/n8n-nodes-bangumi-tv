import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		default: '',
		routing: { request: { method: 'POST', url: '=/v0/indices/{{$value}}/collect' } },
		displayOptions: { show: { resource: ['index'], operation: ['createCollection'] } },
	},
];
