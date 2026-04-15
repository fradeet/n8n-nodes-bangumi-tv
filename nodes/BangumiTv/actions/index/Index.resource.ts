import type { INodeProperties } from 'n8n-workflow';
import { properties as createProps } from './create.operation';
import { properties as getProps } from './get.operation';
import { properties as updateProps } from './update.operation';
import { properties as addendSubjectProps } from './addendSubject.operation';
import { properties as updateSubjectProps } from './updateSubject.operation';
import { properties as deleteSubjectProps } from './deleteSubject.operation';
import { properties as getManySubjectsProps } from './getManySubjects.operation';
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
				name: 'Append Subject',
				value: 'addendSubject',
				action: 'Append subject to index',
				description: 'Append a subject into an index',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create index',
				description: 'Create a new index',
			},
			{
				name: 'Create Collection',
				value: 'createCollection',
				action: 'Create index collection',
				description: 'Create a new index collection',
			},
			{
				name: 'Delete Collection',
				value: 'deleteCollection',
				action: 'Delete index collection',
				description: 'Delete an index collection',
			},
			{
				name: 'Delete Subject',
				value: 'deleteSubject',
				action: 'Delete subject from index',
				description: 'Delete a subject inside an index',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get index',
				description: 'Retrieve an index detail',
			},
			{
				name: 'Get Subjects',
				value: 'getManySubjects',
				action: 'Get subjects in index',
				description: 'List all subjects in an index',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update index',
				description: 'Update a index',
			},
			{
				name: 'Update Subject',
				value: 'updateSubject',
				action: 'Update subject in index',
				description: 'Update subject inside a index',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['index'] } },
	},
	...addendSubjectProps,
	...createProps,
	...createCollectionProps,
	...deleteCollectionProps,
	...deleteSubjectProps,
	...getProps,
	...getManySubjectsProps,
	...updateProps,
	...updateSubjectProps,
];
