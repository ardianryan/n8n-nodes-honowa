import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HonoWaApi implements ICredentialType {
	name = 'honoWaApi';

	displayName = 'HonoWA API';

	icon: Icon = 'file:../nodes/HonoWa/honowa.svg';

	documentationUrl = 'https://github.com/elianhardyy/hono-wa-web-multidevice';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://localhost:3000',
			placeholder: 'http://your-server:3000',
			description: 'Base URL of your HonoWA server',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API Key from HonoWA Dashboard (Settings page)',
			required: true,
		},
		{
			displayName: 'Session ID',
			name: 'sessionId',
			type: 'string',
			default: 'session1',
			description: 'The WhatsApp Session ID you want to use for this credential',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/sessions',
			method: 'GET',
		},
	};
}
