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
				// eslint-disable-next-line n8n-nodes-base/node-param-operation-option-action-miscased
				action: "Get user's profile",
				description: 'Retrieve user profile by username',
			},
			{
				name: 'Get Avatar',
				value: 'getAvatar',
				// eslint-disable-next-line n8n-nodes-base/node-param-operation-option-action-miscased
				action: "Get user's avatar",
				description: 'Retrieve user avatar by username',
			},
			{
				name: 'Get Me',
				value: 'getMe',
				action: 'Get current user',
				description: 'Retrieve current authenticated user profile',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['user'] } },
	},
	...getProps,
	...getAvatarProps,
	...getMeProps,
];
