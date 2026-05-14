// nodes/BangumiTv/actions/descriptions.ts
import type { INodeProperties } from 'n8n-workflow';
import { description as characterDescription } from './character/Character.resource';
import { description as personDescription } from './person/Person.resource';
import { description as subjectDescription } from './subject/Subject.resource';
import { description as userDescription } from './user/User.resource';

// Deving
// import { description as collectionDescription } from './collection/Collection.resource';
// import { description as episodeDescription } from './episode/Episode.resource';
// import { description as indexDescription } from './index/Index.resource';
// import { description as revisionDescription } from './revision/Revision.resource';

export const properties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Character', value: 'character' },
			{ name: 'Person', value: 'person' },
			{ name: 'Subject', value: 'subject' },
			{ name: 'User', value: 'user' },
		],
		default: 'subject',
	},
	...characterDescription,
	...personDescription,
	...subjectDescription,
	...userDescription,
];
