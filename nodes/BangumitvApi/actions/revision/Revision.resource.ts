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
				description: 'Get a character revision by ID',
			},
			{
				name: 'Get Character Revisions',
				value: 'getCharacterRevisions',
				action: 'Get character revisions',
				description: 'List character revisions',
			},
			{
				name: 'Get Episode Revision',
				value: 'getEpisodeRevision',
				action: 'Get episode revision',
				description: 'Get an episode revision by ID',
			},
			{
				name: 'Get Episode Revisions',
				value: 'getEpisodeRevisions',
				action: 'Get episode revisions',
				description: 'List episode revisions',
			},
			{
				name: 'Get Person Revision',
				value: 'getPersonRevision',
				action: 'Get person revision',
				description: 'Get a person revision by ID',
			},
			{
				name: 'Get Person Revisions',
				value: 'getPersonRevisions',
				action: 'Get person revisions',
				description: 'List person revisions',
			},
			{
				name: 'Get Subject Revision',
				value: 'getSubjectRevision',
				action: 'Get subject revision',
				description: 'Get a subject revision by ID',
			},
			{
				name: 'Get Subject Revisions',
				value: 'getSubjectRevisions',
				action: 'Get subject revisions',
				description: 'List subject revisions',
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
