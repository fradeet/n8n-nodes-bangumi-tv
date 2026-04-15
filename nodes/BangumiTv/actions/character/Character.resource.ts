import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as searchProps } from './search.operation';
import { properties as getManyRelatedSubjectsProps } from './getManyRelatedSubjects.operation';
import { properties as getManyRelatedPersonsProps } from './getManyRelatedPersons.operation';
import { properties as getImageProps } from './getImage.operation';
import { properties as createCollectionProps } from './createCollection.operation';
import { properties as deleteCollectionProps } from './deleteCollection.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Create Collection',
				value: 'createCollection',
				action: 'Create character collection',
				description: 'Create a new character collection',
			},
			{
				name: 'Delete Collection',
				value: 'deleteCollection',
				action: 'Delete character collection',
				description: 'Delete a character collection',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get character',
				description: 'Retrieve a character detail',
			},
			{
				name: 'Get Image',
				value: 'getImage',
				action: 'Get character image',
				description: 'Retrieve character image',
			},
			{
				name: 'Get Related Persons',
				value: 'getManyRelatedPersons',
				action: 'Get related persons for character',
				description: 'List all related persons in a character',
			},
			{
				name: 'Get Related Subjects',
				value: 'getManyRelatedSubjects',
				action: 'Get related subjects for character',
				description: 'List all related subjects in a character',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search characters',
				description: 'Search characters by keyword',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['character'] } },
	},
	...getProps,
	...searchProps,
	...getManyRelatedSubjectsProps,
	...getManyRelatedPersonsProps,
	...getImageProps,
	...createCollectionProps,
	...deleteCollectionProps,
];
