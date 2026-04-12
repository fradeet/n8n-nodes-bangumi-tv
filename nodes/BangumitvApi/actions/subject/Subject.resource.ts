import type { INodeProperties } from 'n8n-workflow';
import { properties as getCalendarProps } from './getCalendar.operation';
import { properties as searchProps } from './search.operation';
import { properties as getManyProps } from './getMany.operation';
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
			{
				name: 'Get',
				value: 'get',
				action: 'Get subject',
				description: 'Retrieve a subject by ID',
			},
			{
				name: 'Get Calendar',
				value: 'getCalendar',
				action: 'Get calendar',
				description: 'Retrieve daily broadcast schedule for subjects',
			},
			{
				name: 'Get Image',
				value: 'getImage',
				action: 'Get subject image',
				description: 'Retrieve subject image',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many subjects',
				description: 'Browse subjects with filters',
			},
			{
				name: 'Get Many Characters',
				value: 'getCharacters',
				action: 'Get related characters for subject',
				description: 'Retrieve related characters for a subject',
			},
			{
				name: 'Get Many Persons',
				value: 'getPersons',
				action: 'Get related persons for subject',
				description: 'Retrieve related persons for a subject',
			},
			{
				name: 'Get Many Related Subjects',
				value: 'getRelations',
				action: 'Get related subjects for subject',
				description: 'Retrieve related subjects for a subject',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search subjects',
				description: 'Search subjects by keyword',
			},
		],
		default: 'getMany',
		displayOptions: {
			show: {
				resource: ['subject'],
			},
		},
	},
	...getCalendarProps,
	...searchProps,
	...getManyProps,
	...getProps,
	...getImageProps,
	...getPersonsProps,
	...getCharactersProps,
	...getRelationsProps,
];
