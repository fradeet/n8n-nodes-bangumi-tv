import type { INodeProperties } from 'n8n-workflow';
import {
	limitProperty,
	offsetProperty,
	subjectTypeOptions,
	subjectSortOptions,
} from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject Type',
		name: 'subjectType',
		type: 'options',
		options: subjectTypeOptions,
		required: true,
		default: 2,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/subjects',
				qs: { type: '={{$value}}' },
			},
		},
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'options',
		options: subjectSortOptions,
		default: 'date',
		description: 'Sort order (date or rank)',
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { sort: '={{$value}}' } } },
	},
	{
		displayName: 'Year',
		name: 'year',
		type: 'number',
		default: 0,
		description: 'Filter by year',
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { year: '={{$value}}' } } },
	},
	{
		displayName: 'Month',
		name: 'month',
		type: 'number',
		default: 0,
		description: 'Filter by month',
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { month: '={{$value}}' } } },
	},
	{
		...limitProperty,
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
