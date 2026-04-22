import type { INodeProperties } from 'n8n-workflow';
import { properties as getCalendarProps } from './getCalendar.operation';
import { properties as searchProps } from './search.operation';
import { properties as getManyProps } from './getMany.operation';
import { properties as getProps } from './get.operation';
import { properties as getImageProps } from './getImage.operation';
import { properties as getManyRelatedPersonsProps } from './getManyRelatedPersons.operation';
import { properties as getManyRelatedCharactersProps } from './getManyRelatedCharacters.operation';
import { properties as getManyRelatedSubjectsProps } from './getManyRelatedSubjects.operation';
import { properties as createOrUpdateCollectionProps } from './createOrUpdateCollection.operation';
import { properties as updateCollectionProps } from './updateCollection.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Collect or Update Collection',
				value: 'createOrUpdateCollection',
				action: 'Collect or update subject collection',
				description: 'Collect a subject or update an existing collection',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get subject',
				description: 'Retrieve a subject detail',
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
				description: 'Retrieve a list of subjects',
			},
			{
				name: 'Get Related Characters',
				value: 'getManyRelatedCharacters',
				action: 'Get related characters for subject',
				description: 'Retrieve related characters inside a subject',
			},
			{
				name: 'Get Related Persons',
				value: 'getManyRelatedPersons',
				action: 'Get related persons for subject',
				description: 'Retrieve related persons inside a subject',
			},
			{
				name: 'Get Related Subjects',
				value: 'getManyRelatedSubjects',
				action: 'Get related subjects for subject',
				description: 'Retrieve related subjects inside a subject',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search subjects',
				description: 'Search subjects by keyword',
			},
			{
				name: 'Update Collection',
				value: 'updateCollection',
				action: 'Update existing subject collection',
				description: 'Update an existing subject collection only',
			},
		],
		default: 'getMany',
		displayOptions: { show: { resource: ['subject'] } },
	},
	...getCalendarProps,
	...searchProps,
	...getManyProps,
	...getProps,
	...getImageProps,
	...getManyRelatedPersonsProps,
	...getManyRelatedCharactersProps,
	...getManyRelatedSubjectsProps,
	...createOrUpdateCollectionProps,
	...updateCollectionProps,
];
