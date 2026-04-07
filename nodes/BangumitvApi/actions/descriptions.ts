import type { INodeProperties } from 'n8n-workflow';
import { description as subjectDescription } from './subject/Subject.resource';
import { description as episodeDescription } from './episode/Episode.resource';
import { description as characterDescription } from './character/Character.resource';
import { description as personDescription } from './person/Person.resource';

// Will be populated as resources are implemented
export const properties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{ name: 'Subject', value: 'subject' },
			{ name: 'Episode', value: 'episode' },
			{ name: 'Character', value: 'character' },
			{ name: 'Person', value: 'person' },
			{ name: 'User', value: 'user' },
			{ name: 'Collection', value: 'collection' },
			{ name: 'Revision', value: 'revision' },
			{ name: 'Index', value: 'index' },
		],
		default: 'subject',
	},
	...subjectDescription,
	...episodeDescription,
	...characterDescription,
	...personDescription,
];
