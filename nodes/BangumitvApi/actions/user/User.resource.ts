import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as getMyselfProps } from './getMyself.operation';
import { properties as getAvatarProps } from './getAvatar.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Get', value: 'get', action: 'Get a user', description: 'Get user by username' },
			{
				name: 'Get Myself',
				value: 'getMyself',
				action: 'Get current user',
				description: 'Get current authenticated user',
			},
			{
				name: 'Get Avatar',
				value: 'getAvatar',
				action: 'Get user avatar',
				description: 'Get user avatar',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['user'] } },
	},
	...getProps,
	...getMyselfProps,
	...getAvatarProps,
];
