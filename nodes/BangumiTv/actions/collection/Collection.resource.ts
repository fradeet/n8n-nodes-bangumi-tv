import type { INodeProperties } from 'n8n-workflow';
import { properties as getCharacterProps } from './getCharacter.operation';
import { properties as getManySubjectsProps } from './getManySubjects.operation';
import { properties as getManyCharactersProps } from './getManyCharacters.operation';
import { properties as getManyPersonsProps } from './getManyPersons.operation';
import { properties as getPersonProps } from './getPerson.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get Character',
				value: 'getCharacter',
				action: 'Get character collection',
				description: "View a user's collected character",
			},
			{
				name: 'Get Many Characters',
				value: 'getManyCharacters',
				action: 'Get character collections',
				description: "View a user's collected characters",
			},
			{
				name: 'Get Many Persons',
				value: 'getManyPersons',
				action: 'Get person collections',
				description: "View a user's collected persons",
			},
			{
				name: 'Get Many Subjects',
				value: 'getManySubjects',
				action: 'Get subject collections',
				description: "View a user's collected subjects",
			},
			{
				name: 'Get Person',
				value: 'getPerson',
				action: 'Get person collection',
				description: "View a user's collected person",
			},
		],
		default: 'getManySubjects',
		displayOptions: { show: { resource: ['collection'] } },
	},
	...getCharacterProps,
	...getManyCharactersProps,
	...getManyPersonsProps,
	...getManySubjectsProps,
	...getPersonProps,
];
