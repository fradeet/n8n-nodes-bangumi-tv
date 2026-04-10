import type { INodeProperties } from 'n8n-workflow';
import { properties as createProps } from './create.operation';
import { properties as getProps } from './get.operation';
import { properties as editProps } from './edit.operation';
import { properties as getSubjectsProps } from './getSubjects.operation';
import { properties as addSubjectProps } from './addSubject.operation';
import { properties as editSubjectProps } from './editSubject.operation';
import { properties as removeSubjectProps } from './removeSubject.operation';
import { properties as collectProps } from './collect.operation';
import { properties as uncollectProps } from './uncollect.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Add Subject',
				value: 'addSubject',
				action: 'Add a subject to an index',
				description: 'Add subject to index',
			},
			{
				name: 'Collect',
				value: 'collect',
				action: 'Collect an index',
				description: 'Collect index',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an index',
				description: 'Create a new index',
			},
			{ name: 'Edit', value: 'edit', action: 'Edit an index', description: 'Edit index info' },
			{
				name: 'Edit Subject',
				value: 'editSubject',
				action: 'Edit a subject in an index',
				description: 'Edit subject in index',
			},
			{ name: 'Get', value: 'get', action: 'Get an index', description: 'Get index by ID' },
			{
				name: 'Get Subjects',
				value: 'getSubjects',
				action: 'Get subjects in an index',
				description: 'Get subjects in index',
			},
			{
				name: 'Remove Subject',
				value: 'removeSubject',
				action: 'Remove a subject from an index',
				description: 'Remove subject from index',
			},
			{
				name: 'Uncollect',
				value: 'uncollect',
				action: 'Uncollect an index',
				description: 'Uncollect index',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['index'] } },
	},
	...createProps,
	...getProps,
	...editProps,
	...getSubjectsProps,
	...addSubjectProps,
	...editSubjectProps,
	...removeSubjectProps,
	...collectProps,
	...uncollectProps,
];
