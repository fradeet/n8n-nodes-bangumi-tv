import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as getAvatarProps } from './getAvatar.operation';

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
				action: 'Get user',
				description: 'Retrieve user profile by username',
			},
			{
				name: 'Get Avatar',
				value: 'getAvatar',
				action: 'Get user avatar',
				description: 'Retrieve user avatar by username',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['user'] } },
	},
	...getProps,
	...getAvatarProps,
];
