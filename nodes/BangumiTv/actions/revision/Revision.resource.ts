import type { INodeProperties } from 'n8n-workflow';
import { properties as getSubjectRevisionsProps } from './getSubjectRevisions.operation';
import { properties as getEpisodeRevisionsProps } from './getEpisodeRevisions.operation';
import { properties as getCharacterRevisionsProps } from './getCharacterRevisions.operation';
import { properties as getPersonRevisionsProps } from './getPersonRevisions.operation';
import { properties as getSubjectRevisionProps } from './getSubjectRevision.operation';
import { properties as getEpisodeRevisionProps } from './getEpisodeRevision.operation';
import { properties as getCharacterRevisionProps } from './getCharacterRevision.operation';
import { properties as getPersonRevisionProps } from './getPersonRevision.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get Character Revision',
				value: 'getCharacterRevision',
				action: 'Get character revision',
				description: 'Retrieve a character revision by ID',
			},
			{
				name: 'Get Episode Revision',
				value: 'getEpisodeRevision',
				action: 'Get episode revision',
				description: 'Retrieve an episode revision by ID',
			},
			{
				name: 'Get Many Character Revisions',
				value: 'getCharacterRevisions',
				action: 'Get many character revisions',
				description: 'Retrieve revision history for a character',
			},
			{
				name: 'Get Many Episode Revisions',
				value: 'getEpisodeRevisions',
				action: 'Get many episode revisions',
				description: 'Retrieve revision history for an episode',
			},
			{
				name: 'Get Many Person Revisions',
				value: 'getPersonRevisions',
				action: 'Get many person revisions',
				description: 'Retrieve revision history for a person',
			},
			{
				name: 'Get Many Subject Revisions',
				value: 'getSubjectRevisions',
				action: 'Get many subject revisions',
				description: 'Retrieve revision history for a subject',
			},
			{
				name: 'Get Person Revision',
				value: 'getPersonRevision',
				action: 'Get person revision',
				description: 'Retrieve a person revision by ID',
			},
			{
				name: 'Get Subject Revision',
				value: 'getSubjectRevision',
				action: 'Get subject revision',
				description: 'Retrieve a subject revision by ID',
			},
		],
		default: 'getSubjectRevisions',
		displayOptions: {
			show: {
				resource: ['revision'],
			},
		},
	},
	...getSubjectRevisionsProps,
	...getEpisodeRevisionsProps,
	...getCharacterRevisionsProps,
	...getPersonRevisionsProps,
	...getSubjectRevisionProps,
	...getEpisodeRevisionProps,
	...getCharacterRevisionProps,
	...getPersonRevisionProps,
];
