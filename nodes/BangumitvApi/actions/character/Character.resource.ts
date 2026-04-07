import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as searchProps } from './search.operation';
import { properties as getSubjectsProps } from './getSubjects.operation';
import { properties as getPersonsProps } from './getPersons.operation';
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
			{ name: 'Collect', value: 'collect', action: 'Collect character', description: 'Collect character' },
			{ name: 'Get', value: 'get', action: 'Get a character', description: 'Get character detail' },
			{ name: 'Get Image', value: 'getImage', action: 'Get image', description: 'Get character image' },
			{ name: 'Get Persons', value: 'getPersons', action: 'Get persons', description: 'Get character related persons' },
			{ name: 'Get Subjects', value: 'getSubjects', action: 'Get subjects', description: 'Get character related subjects' },
			{ name: 'Search', value: 'search', action: 'Search characters', description: 'Search characters' },
			{ name: 'Uncollect', value: 'uncollect', action: 'Uncollect character', description: 'Uncollect character' },
		],
		default: 'get',
		displayOptions: { show: { resource: ['character'] } },
	},
	...getProps,
	...searchProps,
	...getSubjectsProps,
	...getPersonsProps,
	...getImageProps,
	...collectProps,
	...uncollectProps,
];
