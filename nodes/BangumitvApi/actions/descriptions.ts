import type { INodeProperties } from 'n8n-workflow';
import { description as subjectDescription } from './subject/Subject.resource';

// Will be populated as resources are implemented
export const properties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Character', value: 'character' },
			{ name: 'Collection', value: 'collection' },
			{ name: 'Episode', value: 'episode' },
			{ name: 'Index', value: 'index' },
			{ name: 'Person', value: 'person' },
			{ name: 'Revision', value: 'revision' },
			{ name: 'Subject', value: 'subject' },
			{ name: 'User', value: 'user' },
		],
		default: 'subject',
	},
	...subjectDescription,
];
