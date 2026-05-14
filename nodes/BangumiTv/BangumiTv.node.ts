import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { properties } from './actions/descriptions';

export class BangumiTv implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bangumi.tv',
		name: 'bangumiTv',
		icon: 'file:bangumiLogo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Bangumi.tv API',
		defaults: {
			name: 'Bangumi',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'bangumiTvOAuth2Api', required: false }],
		requestDefaults: {
			baseURL: 'https://api.bgm.tv',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'User-Agent': 'fradeet/n8n-nodes-bangumi-tv/0.1.0 (https://github.com/fradeet/n8n-nodes-bangumi-tv)',
			},
		},
		properties,
	};
}
