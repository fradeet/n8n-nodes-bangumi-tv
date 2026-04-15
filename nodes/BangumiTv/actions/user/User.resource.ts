import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as getAvatarProps } from './getAvatar.operation';
import { properties as getMeProps } from './getMe.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get user profile',
				description: 'Retrieve user profile',
			},
			{
				name: 'Get Avatar',
				value: 'getAvatar',
				action: 'Get user avatar',
				description: 'Retrieve user avatar',
			},
			{
				name: 'Get Me',
				value: 'getMe',
				action: 'Get current user',
				description: 'Retrieve current user profile',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['user'] } },
	},
	...getProps,
	...getAvatarProps,
	...getMeProps,
];
