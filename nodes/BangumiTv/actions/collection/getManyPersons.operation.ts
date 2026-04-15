import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'GET', url: '=/v0/users/{{$value}}/collections/-/persons' },
		},
		displayOptions: { show: { resource: ['collection'], operation: ['getManyPersons'] } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['collection'], operation: ['getManyPersons'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['collection'], operation: ['getManyPersons'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
