import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty, subjectTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'GET', url: '=/v0/indices/{{$value}}/subjects' },
		},
		displayOptions: { show: { resource: ['index'], operation: ['getManySubjects'] } },
	},
	{
		displayName: 'Subject Type',
		name: 'subjectType',
		type: 'options',
		options: [{ name: 'All', value: '' }, ...subjectTypeOptions],
		description: 'Filter by subject type',
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['getManySubjects'] } },
		routing: { request: { qs: { type: '={{$value}}' } } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['index'], operation: ['getManySubjects'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['index'], operation: ['getManySubjects'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
