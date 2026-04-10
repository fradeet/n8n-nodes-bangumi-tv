import type { INodeProperties } from 'n8n-workflow';
import { properties as getCalendarProps } from './getCalendar.operation';
import { properties as searchProps } from './search.operation';
import { properties as getAllProps } from './getAll.operation';
import { properties as getProps } from './get.operation';
import { properties as getImageProps } from './getImage.operation';
import { properties as getPersonsProps } from './getPersons.operation';
import { properties as getCharactersProps } from './getCharacters.operation';
import { properties as getRelationsProps } from './getRelations.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Get', value: 'get', action: 'Get a subject', description: 'Get a subject by ID' },
			// eslint-disable-next-line n8n-nodes-base/node-param-operation-option-without-action, n8n-nodes-base/node-param-option-name-wrong-for-get-many
			{ name: 'Get All', value: 'getAll', description: 'Browse subjects' },
			{
				name: 'Get Calendar',
				value: 'getCalendar',
				action: 'Get calendar',
				description: 'Get daily broadcast schedule',
			},
			{
				name: 'Get Characters',
				value: 'getCharacters',
				action: 'Get characters',
				description: 'Get related characters',
			},
			{
				name: 'Get Image',
				value: 'getImage',
				action: 'Get image',
				description: 'Get subject image',
			},
			{
				name: 'Get Persons',
				value: 'getPersons',
				action: 'Get persons',
				description: 'Get related persons',
			},
			{
				name: 'Get Relations',
				value: 'getRelations',
				action: 'Get relations',
				description: 'Get related subjects',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search',
				description: 'Search subjects by keyword',
			},
		],
		default: 'getAll',
		displayOptions: {
			show: {
				resource: ['subject'],
			},
		},
	},
	...getCalendarProps,
	...searchProps,
	...getAllProps,
	...getProps,
	...getImageProps,
	...getPersonsProps,
	...getCharactersProps,
	...getRelationsProps,
];
