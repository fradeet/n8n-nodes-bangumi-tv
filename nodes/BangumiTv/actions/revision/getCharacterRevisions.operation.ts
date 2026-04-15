import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		default: '',
		description: 'Filter by character ID',
		displayOptions: {
			show: {
				resource: ['revision'],
				operation: ['getCharacterRevisions'],
			},
		},
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/revisions/characters',
				qs: { character_id: '={{$value}}' },
			},
		},
	},
	{
		...limitProperty,
		displayOptions: {
			show: {
				resource: ['revision'],
				operation: ['getCharacterRevisions'],
			},
		},
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: {
			show: {
				resource: ['revision'],
				operation: ['getCharacterRevisions'],
			},
		},
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
