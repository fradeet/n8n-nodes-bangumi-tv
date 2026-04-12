import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as searchProps } from './search.operation';
import { properties as getSubjectsProps } from './getSubjects.operation';
import { properties as getPersonsProps } from './getPersons.operation';
import { properties as getImageProps } from './getImage.operation';

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
				action: 'Get character',
				description: 'Retrieve a character by ID',
			},
			{
				name: 'Get Image',
				value: 'getImage',
				action: 'Get character image',
				description: 'Retrieve character image',
			},
			{
				name: 'Get Many Persons',
				value: 'getPersons',
				action: 'Get related persons for character',
				description: 'Retrieve related persons for a character',
			},
			{
				name: 'Get Many Subjects',
				value: 'getSubjects',
				action: 'Get related subjects for character',
				description: 'Retrieve related subjects for a character',
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
	...getSubjectsProps,
	...getPersonsProps,
	...getImageProps,
];
