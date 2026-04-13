import type { INodeProperties } from 'n8n-workflow';
import { properties as collectProps } from './collect.operation';
import { properties as getProps } from './get.operation';
import { properties as getCharactersProps } from './getCharacters.operation';
import { properties as getImageProps } from './getImage.operation';
import { properties as getSubjectsProps } from './getSubjects.operation';
import { properties as searchProps } from './search.operation';
import { properties as uncollectProps } from './uncollect.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Collect',
				value: 'collect',
				action: 'Collect person',
				description: 'Add person to your collection',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get person',
				description: 'Retrieve a person by ID',
			},
			{
				name: 'Get Image',
				value: 'getImage',
				action: 'Get person image',
				description: 'Retrieve person image',
			},
			{
				name: 'Get Many Characters',
				value: 'getCharacters',
				action: 'Get related characters for person',
				description: 'Retrieve related characters for a person',
			},
			{
				name: 'Get Many Subjects',
				value: 'getSubjects',
				action: 'Get related subjects for person',
				description: 'Retrieve related subjects for a person',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search persons',
				description: 'Search persons by keyword',
			},
			{
				name: 'Uncollect',
				value: 'uncollect',
				action: 'Uncollect person',
				description: 'Remove person from your collection',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['person'] } },
	},
	...collectProps,
	...getProps,
	...getCharactersProps,
	...getImageProps,
	...getSubjectsProps,
	...searchProps,
	...uncollectProps,
];
