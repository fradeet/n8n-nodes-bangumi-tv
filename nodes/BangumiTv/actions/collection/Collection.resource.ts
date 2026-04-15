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
				action: 'Get user character collection',
				description: "Retrieve a user's character collection",
			},
			{
				name: 'Get Many Characters',
				value: 'getManyCharacters',
				action: 'Get many user character collections',
				description: "Retrieve a list of user's character collections",
			},
			{
				name: 'Get Many Persons',
				value: 'getManyPersons',
				action: 'Get many user person collections',
				description: 'Retrieve a list of person collections',
			},
			{
				name: 'Get Many Subjects',
				value: 'getManySubjects',
				action: 'Get many user subject collections',
				description: "Retrieve a list of user's subject collections",
			},
			{
				name: 'Get Person',
				value: 'getPerson',
				action: 'Get user person collection',
				description: 'Retrieve a person collection',
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
