import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Get Calendar',
		name: 'getCalendar',
		type: 'hidden',
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/calendar',
			},
		},
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getCalendar'],
			},
		},
	},
];
