import type { INodeProperties } from 'n8n-workflow';
import { properties as createCollectionProps } from './createCollection.operation';
import { properties as getProps } from './get.operation';
import { properties as getManyRelatedCharactersProps } from './getManyRelatedCharacters.operation';
import { properties as getImageProps } from './getImage.operation';
import { properties as getManyRelatedSubjectsProps } from './getManyRelatedSubjects.operation';
import { properties as searchProps } from './search.operation';
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
				action: 'Delete person collection',
				description: 'Delete a person collection',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get person',
				description: 'Retrieve a person detail',
			},
			{
				name: 'Get Image',
				value: 'getImage',
				action: 'Get person image',
				description: 'Retrieve person image',
			},
			{
				name: 'Get Related Characters',
				value: 'getManyRelatedCharacters',
				action: 'Get related characters for person',
				description: 'Retrieve related characters for a person',
			},
			{
				name: 'Get Related Subjects',
				value: 'getManyRelatedSubjects',
				action: 'Get related subjects for person',
				description: 'Retrieve related subjects for a person',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search persons',
				description: 'Search persons by keyword',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['person'] } },
	},
	...createCollectionProps,
	...getProps,
	...getManyRelatedCharactersProps,
	...getImageProps,
	...getManyRelatedSubjectsProps,
	...searchProps,
	...deleteCollectionProps,
];
