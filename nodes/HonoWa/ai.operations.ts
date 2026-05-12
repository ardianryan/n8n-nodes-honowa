import {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';

export const aiOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ai'],
			},
		},
		options: [
			{
				name: 'Chat',
				value: 'chat',
				description: 'Chat with AI (OpenAI, Gemini, Claude)',
				action: 'Chat with ai',
			},
			{
				name: 'Delete History',
				value: 'deleteHistory',
				description: 'Delete your chat history',
				action: 'Delete ai history',
			},
			{
				name: 'Generate Image',
				value: 'image',
				description: 'Generate image from prompt',
				action: 'Generate an ai image',
			},
		],
		default: 'chat',
	},
];

export const aiProperties: INodeProperties[] = [
	// ── AI: Provider ──
	{
		displayName: 'Provider',
		name: 'provider',
		type: 'options',
		options: [
			{
				name: 'Claude (Anthropic)',
				value: 'claude',
			},
			{
				name: 'Gemini (Google)',
				value: 'gemini',
			},
			{
				name: 'OpenAI (GPT-4o)',
				value: 'openai',
			},
		],
		default: 'gemini',
		description: 'The AI provider to use',
		displayOptions: {
			show: {
				resource: ['ai'],
				operation: ['chat', 'image'],
			},
		},
	},

	// ── AI: Chat Message ──
	{
		displayName: 'Message',
		name: 'aiMessage',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'How can you help me today?',
		description: 'The message to send to the AI',
		displayOptions: {
			show: {
				resource: ['ai'],
				operation: ['chat'],
			},
		},
	},

	// ── AI: Image Prompt ──
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'A futuristic city at sunset',
		description: 'The image description for AI to generate',
		displayOptions: {
			show: {
				resource: ['ai'],
				operation: ['image'],
			},
		},
	},
];

export const executeAiOperations: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const credentials = await this.getCredentials('honoWaApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

	let responseData: IDataObject;

	if (operation === 'chat') {
		const message = this.getNodeParameter('aiMessage', itemIndex) as string;
		const provider = this.getNodeParameter('provider', itemIndex) as string;

		const options: RequestOptions = {
			method: 'POST',
			url: `${baseUrl}/api/ai/chat`,
			body: { message, provider },
		};
		responseData = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'honoWaApi',
			options,
		)) as IDataObject;
	} else if (operation === 'image') {
		const prompt = this.getNodeParameter('prompt', itemIndex) as string;
		const provider = this.getNodeParameter('provider', itemIndex) as string;

		const options: RequestOptions = {
			method: 'POST',
			url: `${baseUrl}/api/ai/image`,
			body: { prompt, provider },
		};
		responseData = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'honoWaApi',
			options,
		)) as IDataObject;
	} else if (operation === 'deleteHistory') {
		const options: RequestOptions = {
			method: 'DELETE',
			url: `${baseUrl}/api/ai/history`,
		};
		responseData = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'honoWaApi',
			options,
		)) as IDataObject;
	} else {
		throw new NodeOperationError(
			this.getNode(),
			`Unknown AI operation: ${operation}`,
			{ itemIndex },
		);
	}

	return responseData;
};
