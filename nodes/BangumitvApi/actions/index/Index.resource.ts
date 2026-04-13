import type { INodeProperties } from 'n8n-workflow';
import { properties as createProps } from './create.operation';
import { properties as getProps } from './get.operation';
import { properties as updateProps } from './update.operation';
import { properties as getSubjectsProps } from './getSubjects.operation';
import { properties as addSubjectProps } from './addSubject.operation';
import { properties as updateSubjectProps } from './updateSubject.operation';
import { properties as deleteSubjectProps } from './deleteSubject.operation';
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
				name: 'Append Subject',
				value: 'addSubject',
				action: 'Append subject to index',
				description: 'Insert a subject into an index',
			},
			{
				name: 'Collect',
				value: 'collect',
				action: 'Collect index',
				description: 'Add index to your collection',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create index',
				description: 'Create a new index',
			},
			{
				name: 'Delete Subject',
				value: 'deleteSubject',
				action: 'Delete subject from index',
				description: 'Remove a subject from an index',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get index',
				description: 'Retrieve an index by ID',
			},
			{
				name: 'Get Many Subjects',
				value: 'getSubjects',
				action: 'Get many subjects in index',
				description: 'Retrieve subjects in an index',
			},
			{
				name: 'Uncollect',
				value: 'uncollect',
				action: 'Uncollect index',
				description: 'Remove index from your collection',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update index',
				description: 'Update index information',
			},
			{
				name: 'Update Subject',
				value: 'updateSubject',
				action: 'Update subject in index',
				description: 'Update subject information in an index',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['index'] } },
	},
	...createProps,
	...getProps,
	...updateProps,
	...getSubjectsProps,
	...addSubjectProps,
	...updateSubjectProps,
	...deleteSubjectProps,
	...collectProps,
	...uncollectProps,
];
