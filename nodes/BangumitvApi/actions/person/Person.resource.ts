import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as searchProps } from './search.operation';
import { properties as getSubjectsProps } from './getSubjects.operation';
import { properties as getCharactersProps } from './getCharacters.operation';
import { properties as getImageProps } from './getImage.operation';
import { properties as collectProps } from './collect.operation';
import { properties as uncollectProps } from './uncollect.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Collect', value: 'collect', action: 'Collect person', description: 'Collect person' },
			{ name: 'Get', value: 'get', action: 'Get a person', description: 'Get person detail' },
			{ name: 'Get Characters', value: 'getCharacters', action: 'Get characters', description: 'Get person related characters' },
			{ name: 'Get Image', value: 'getImage', action: 'Get image', description: 'Get person image' },
			{ name: 'Get Subjects', value: 'getSubjects', action: 'Get subjects', description: 'Get person related subjects' },
			{ name: 'Search', value: 'search', action: 'Search persons', description: 'Search persons' },
			{ name: 'Uncollect', value: 'uncollect', action: 'Uncollect person', description: 'Uncollect person' },
		],
		default: 'get',
		displayOptions: { show: { resource: ['person'] } },
	},
	...getProps,
	...searchProps,
	...getSubjectsProps,
	...getCharactersProps,
	...getImageProps,
	...collectProps,
	...uncollectProps,
];
