import type { INodeProperties } from 'n8n-workflow';
import { properties as getManyCharacterRevisionsProps } from './getManyCharacterRevisions.operation';
import { properties as getManyEpisodeRevisionsProps } from './getManyEpisodeRevisions.operation';
import { properties as getManyPersonRevisionsProps } from './getManyPersonRevisions.operation';
import { properties as getManySubjectRevisionsProps } from './getManySubjectRevisions.operation';
import { properties as getCharacterRevisionProps } from './getCharacterRevision.operation';
import { properties as getEpisodeRevisionProps } from './getEpisodeRevision.operation';
import { properties as getPersonRevisionProps } from './getPersonRevision.operation';
import { properties as getSubjectRevisionProps } from './getSubjectRevision.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get Character',
				value: 'getCharacterRevision',
				action: 'Get character revision',
				description: 'Retrieve a character revision',
			},
			{
				name: 'Get Episode',
				value: 'getEpisodeRevision',
				action: 'Get episode revision',
				description: 'Retrieve an episode revision',
			},
			{
				name: 'Get Many Character',
				value: 'getManyCharacterRevisions',
				action: 'Get many character revisions',
				description: 'List all revisions in a character',
			},
			{
				name: 'Get Many Episode',
				value: 'getManyEpisodeRevisions',
				action: 'Get many episode revisions',
				description: 'List all revisions in an episode',
			},
			{
				name: 'Get Many Person',
				value: 'getManyPersonRevisions',
				action: 'Get many person revisions',
				description: 'List all revisions in a person',
			},
			{
				name: 'Get Many Subject',
				value: 'getManySubjectRevisions',
				action: 'Get many subject revisions',
				description: 'List all revisions in a subject',
			},
			{
				name: 'Get Person',
				value: 'getPersonRevision',
				action: 'Get person revision',
				description: 'Retrieve a person revision',
			},
			{
				name: 'Get Subject',
				value: 'getSubjectRevision',
				action: 'Get subject revision',
				description: 'Retrieve a subject revision',
			},
		],
		default: 'getSubjectRevision',
		displayOptions: {
			show: {
				resource: ['revision'],
			},
		},
	},
	...getManyCharacterRevisionsProps,
	...getManyEpisodeRevisionsProps,
	...getManyPersonRevisionsProps,
	...getManySubjectRevisionsProps,
	...getCharacterRevisionProps,
	...getEpisodeRevisionProps,
	...getPersonRevisionProps,
	...getSubjectRevisionProps,
];
