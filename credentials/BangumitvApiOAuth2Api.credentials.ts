import type { ICredentialType, INodeProperties, ICredentialTestRequest } from 'n8n-workflow';

export class BangumitvApiOAuth2Api implements ICredentialType {
	name = 'bangumitvApiOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Bangumi.tv OAuth2 API';

	icon = 'file:../nodes/BangumitvApi/bangumiLogo.svg' as const;

	documentationUrl = 'https://github.com/bangumi/api/blob/master/docs-raw/How-to-Auth.md';

	// Test credential validity by querying token status
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://bgm.tv',
			url: '/oauth/token_status',
			method: 'POST',
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://bgm.tv/oauth/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://bgm.tv/oauth/access_token',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}
