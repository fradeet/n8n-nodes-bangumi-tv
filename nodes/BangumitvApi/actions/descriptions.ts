import type { INodeProperties } from 'n8n-workflow';
import { description as subjectDescription } from './subject/Subject.resource';
import { description as episodeDescription } from './episode/Episode.resource';
import { description as characterDescription } from './character/Character.resource';
import { description as personDescription } from './person/Person.resource';
import { description as userDescription } from './user/User.resource';
import { description as collectionDescription } from './collection/Collection.resource';
import { description as revisionDescription } from './revision/Revision.resource';
import { description as indexDescription } from './index/Index.resource';

export const properties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Character', value: 'character', description: 'Fictional person in story' },
			{ name: 'Collection', value: 'collection', description: 'Items saved by the user' },
			{ name: 'Episode', value: 'episode', description: 'A part of a series' },
			{ name: 'Index', value: 'index', description: 'Personalized collection saved by the user' },
			{ name: 'Person', value: 'person', description: 'Real-life individual' },
			{ name: 'Revision', value: 'revision', description: 'Wiki edit history' },
			{ name: 'Subject', value: 'subject', description: 'An individual entry or item' },
			{ name: 'User', value: 'user' },
		],
		default: 'subject',
	},
	...subjectDescription,
	...episodeDescription,
	...characterDescription,
	...personDescription,
	...userDescription,
	...collectionDescription,
	...revisionDescription,
	...indexDescription,
];
