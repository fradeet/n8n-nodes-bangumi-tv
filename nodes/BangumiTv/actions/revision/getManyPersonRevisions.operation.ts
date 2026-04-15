import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		default: '',
		description: 'Filter by person ID',
		displayOptions: {
			show: {
				resource: ['revision'],
				operation: ['getManyPersonRevisions'],
			},
		},
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/revisions/persons',
				qs: { person_id: '={{$value}}' },
			},
		},
	},
	{
		...limitProperty,
		displayOptions: {
			show: {
				resource: ['revision'],
				operation: ['getManyPersonRevisions'],
			},
		},
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: {
			show: {
				resource: ['revision'],
				operation: ['getManyPersonRevisions'],
			},
		},
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
