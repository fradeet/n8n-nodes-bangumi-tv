import type { INodeProperties } from 'n8n-workflow';
import {
	limitProperty,
	offsetProperty,
	subjectTypeOptions,
	collectionTypeOptions,
} from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/{{$value}}/collections',
			},
		},
		displayOptions: { show: { resource: ['collection'], operation: ['getManySubjects'] } },
	},
	{
		displayName: 'Subject Type',
		name: 'subjectType',
		type: 'options',
		options: [{ name: 'All', value: '' }, ...subjectTypeOptions],
		default: '',
		description: 'Filter by subject type',
		displayOptions: { show: { resource: ['collection'], operation: ['getManySubjects'] } },
		routing: { request: { qs: { subject_type: '={{$value}}' } } },
	},
	{
		displayName: 'Collection Type',
		name: 'collectionType',
		type: 'options',
		options: [{ name: 'All', value: '' }, ...collectionTypeOptions],
		default: '',
		description: 'Filter by collection type',
		displayOptions: { show: { resource: ['collection'], operation: ['getManySubjects'] } },
		routing: { request: { qs: { type: '={{$value}}' } } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['collection'], operation: ['getManySubjects'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['collection'], operation: ['getManySubjects'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
