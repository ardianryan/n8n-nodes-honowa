import {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';

export const broadcastOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['broadcast'],
			},
		},
		options: [
			{
				name: 'Send Bulk Media (Binary)',
				value: 'sendBulkMediaBinary',
				description: 'Send media to multiple numbers from n8n binary data',
				action: 'Send bulk media from binary data',
			},
			{
				name: 'Send Bulk Media (URL)',
				value: 'sendBulkMediaUrl',
				description: 'Send media to multiple numbers from a URL',
				action: 'Send bulk media from url',
			},
			{
				name: 'Send Bulk Text',
				value: 'sendBulkText',
				description: 'Send text message to multiple phone numbers',
				action: 'Send bulk text messages',
			},
		],
		default: 'sendBulkText',
	},
];

export const broadcastProperties: INodeProperties[] = [
	// ── Broadcast: Phones ──
	{
		displayName: 'Phone Numbers',
		name: 'phones',
		type: 'string',
		required: true,
		default: '',
		placeholder: '628123456789,628987654321',
		description: 'Comma-separated list of phone numbers in international format (max 200 numbers)',
		displayOptions: {
			show: {
				resource: ['broadcast'],
				operation: ['sendBulkText', 'sendBulkMediaUrl', 'sendBulkMediaBinary'],
			},
		},
	},

	// ── Broadcast: Message ──
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		placeholder: 'Hello everyone!',
		description: 'The broadcast message text (optional if sending media)',
		displayOptions: {
			show: {
				resource: ['broadcast'],
				operation: ['sendBulkText', 'sendBulkMediaUrl', 'sendBulkMediaBinary'],
			},
		},
	},

	// ── Broadcast: Delay ──
	{
		displayName: 'Delay (Ms)',
		name: 'delayMs',
		type: 'number',
		typeOptions: {
			minValue: 5000,
		},
		default: 5000,
		description: 'Delay in milliseconds between each message to avoid rate limiting (minimum 5000 recommended)',
		displayOptions: {
			show: {
				resource: ['broadcast'],
				operation: ['sendBulkText', 'sendBulkMediaUrl', 'sendBulkMediaBinary'],
			},
		},
	},

	// ── Broadcast: Media URL ──
	{
		displayName: 'Media URL',
		name: 'mediaUrl',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/image.jpg',
		description: 'URL of the media file to include with the broadcast',
		displayOptions: {
			show: {
				resource: ['broadcast'],
				operation: ['sendBulkMediaUrl'],
			},
		},
	},

	// ── Broadcast: Binary Property ──
	{
		displayName: 'Binary Property',
		name: 'binaryProperty',
		type: 'string',
		required: true,
		default: 'data',
		description: 'Name of the binary property containing the file to send',
		displayOptions: {
			show: {
				resource: ['broadcast'],
				operation: ['sendBulkMediaBinary'],
			},
		},
	},
];

export const executeBroadcastOperations: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const credentials = await this.getCredentials('honoWaApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
	const sessionId = credentials.sessionId as string;

	let responseData: IDataObject;

	const phonesRaw = this.getNodeParameter('phones', itemIndex) as string;
	const delayMs = this.getNodeParameter('delayMs', itemIndex) as number;
	const message = this.getNodeParameter('message', itemIndex, '') as string;
	
	const phones = phonesRaw.split(',').map((p) => p.trim()).filter((p) => p.length > 0);

	if (phones.length > 200) {
		throw new NodeOperationError(
			this.getNode(),
			`Too many phone numbers: ${phones.length}. Maximum allowed per request is 200.`,
			{ itemIndex },
		);
	}

	if (delayMs < 5000) {
		throw new NodeOperationError(
			this.getNode(),
			`Delay too low: ${delayMs}ms. Minimum allowed is 5000ms.`,
			{ itemIndex },
		);
	}

	if (operation === 'sendBulkText' || operation === 'sendBulkMediaUrl') {
		const body: IDataObject = { phones, delayMs };
		
		if (message) {
			body.message = message;
		}

		if (operation === 'sendBulkMediaUrl') {
			body.mediaUrl = this.getNodeParameter('mediaUrl', itemIndex) as string;
		} else if (!message) {
			throw new NodeOperationError(
				this.getNode(),
				'Message is required for Send Bulk Text operation.',
				{ itemIndex },
			);
		}

		const options: RequestOptions = {
			method: 'POST',
			url: `${baseUrl}/broadcast/${sessionId}`,
			body,
		};
		responseData = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'honoWaApi',
			options,
		)) as IDataObject;

	} else if (operation === 'sendBulkMediaBinary') {
		const binaryProperty = this.getNodeParameter('binaryProperty', itemIndex) as string;
		const binaryData = this.helpers.assertBinaryData(itemIndex, binaryProperty);
		const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryProperty);

		// Sending an array in multipart/form-data often requires JSON stringification or repeating keys.
		// For Hono backend, JSON stringifying is safest if it parses the field as JSON. 
		// Since we don't know the exact Hono parser used, passing it as a comma-separated string
		// or as the parsed array (n8n might serialize it automatically) is best. Let's send the array.
		const formData: IDataObject = {
			phones: JSON.stringify(phones), // Stringifying ensures it transmits safely as a single field
			delayMs,
			media: {
				value: buffer,
				options: {
					filename: binaryData.fileName || 'file',
					contentType: binaryData.mimeType,
				},
			},
		};

		if (message) {
			formData.message = message;
		}

		const options: RequestOptions = {
			method: 'POST',
			url: `${baseUrl}/broadcast/${sessionId}`,
			formData,
		};
		
		responseData = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'honoWaApi',
			options,
		)) as IDataObject;
	} else {
		throw new NodeOperationError(
			this.getNode(),
			`Unknown broadcast operation: ${operation}`,
			{ itemIndex },
		);
	}

	return responseData;
};
