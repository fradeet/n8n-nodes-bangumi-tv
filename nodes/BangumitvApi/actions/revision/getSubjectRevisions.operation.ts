import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		default: '',
		description: 'Filter by subject ID',
		displayOptions: {
			show: {
				resource: ['revision'],
				operation: ['getSubjectRevisions'],
			},
		},
		routing: { request: { qs: { subject_id: '={{$value}}' } } },
	},
	{
		...limitProperty,
		displayOptions: {
			show: {
				resource: ['revision'],
				operation: ['getSubjectRevisions'],
			},
		},
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: {
			show: {
				resource: ['revision'],
				operation: ['getSubjectRevisions'],
			},
		},
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'hidden',
		default: 'revision',
		displayOptions: {
			show: {
				operation: ['getSubjectRevisions'],
			},
		},
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/revisions/subjects',
			},
		},
	},
];
