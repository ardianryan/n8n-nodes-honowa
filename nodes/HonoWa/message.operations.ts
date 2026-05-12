import {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';

export const messageOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['message'],
            },
        },
        options: [
            {
                name: 'Send Group',
                value: 'sendGroup',
                description: 'Send a message to a WhatsApp group',
                action: 'Send a group message',
            },
            {
                name: 'Send Media (Binary)',
                value: 'sendMediaBinary',
                description: 'Send a file from n8n binary data',
                action: 'Send media from binary data',
            },
            {
                name: 'Send Media (URL)',
                value: 'sendMediaUrl',
                description: 'Send media from a URL',
                action: 'Send media from URL',
            },
            {
                name: 'Send Text',
                value: 'sendText',
                description: 'Send a text message',
                action: 'Send a text message',
            },
        ],
        default: 'sendText',
    },
];

export const messageProperties: INodeProperties[] = [
	// ── Message: Phone ──
	{
		displayName: 'Phone Number',
		name: 'phone',
		type: 'string',
		required: true,
		default: '',
		placeholder: '628123456789',
		description: 'Recipient phone number in international format without + (e.g. 628123456789)',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendText', 'sendMediaUrl', 'sendMediaBinary'],
			},
		},
	},

	// ── Message: Text ──
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		placeholder: 'Hello from n8n!',
		description: 'The message text to send',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendText', 'sendMediaUrl', 'sendMediaBinary', 'sendGroup'],
			},
		},
	},

	// ── Message: Media URL ──
	{
		displayName: 'Media URL',
		name: 'mediaUrl',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/image.jpg',
		description: 'URL of the media file to send (image, video, audio, document)',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMediaUrl'],
			},
		},
	},

	// ── Message: Binary Property ──
	{
		displayName: 'Binary Property',
		name: 'binaryProperty',
		type: 'string',
		required: true,
		default: 'data',
		description: 'Name of the binary property containing the file to send',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMediaBinary'],
			},
		},
	},

	// ── Message: Group ID ──
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		required: true,
		default: '',
		placeholder: '120363012345678901@g.us',
		description: 'The WhatsApp Group ID (ends with @g.us)',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendGroup'],
			},
		},
	},
];


export const executeMessageOperations: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const credentials = await this.getCredentials('honoWaApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
	const sessionId = credentials.sessionId as string;

	let responseData: IDataObject;

	if (operation === 'sendText') {
		const phone = this.getNodeParameter('phone', itemIndex) as string;
		const message = this.getNodeParameter('message', itemIndex, '') as string;
		
		const body: IDataObject = { phone };
		if (message) {
			body.message = message;
		}

		const options: RequestOptions = {
			method: 'POST',
			url: `${baseUrl}/send/${sessionId}`,
			body,
		};
		responseData = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'honoWaApi',
			options,
		)) as IDataObject;
	} else if (operation === 'sendMediaUrl') {
		const phone = this.getNodeParameter('phone', itemIndex) as string;
		const message = this.getNodeParameter('message', itemIndex, '') as string;
		const mediaUrl = this.getNodeParameter('mediaUrl', itemIndex) as string;
		
		const body: IDataObject = { phone, mediaUrl };
		if (message) {
			body.message = message;
		}

		const options: RequestOptions = {
			method: 'POST',
			url: `${baseUrl}/send/${sessionId}`,
			body,
		};
		responseData = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'honoWaApi',
			options,
		)) as IDataObject;
	} else if (operation === 'sendMediaBinary') {
		const phone = this.getNodeParameter('phone', itemIndex) as string;
		const message = this.getNodeParameter('message', itemIndex, '') as string;
		const binaryProperty = this.getNodeParameter('binaryProperty', itemIndex) as string;

		const binaryData = this.helpers.assertBinaryData(itemIndex, binaryProperty);
		const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryProperty);

		const formData: IDataObject = {
			phone,
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
			url: `${baseUrl}/send/${sessionId}`,
			formData,
		};
		responseData = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'honoWaApi',
			options,
		)) as IDataObject;
	} else if (operation === 'sendGroup') {
		const groupId = this.getNodeParameter('groupId', itemIndex) as string;
		const message = this.getNodeParameter('message', itemIndex) as string;
		
		if (!message) {
			throw new NodeOperationError(
				this.getNode(),
				'Message is required for Send Group operation.',
				{ itemIndex },
			);
		}

		const options: RequestOptions = {
			method: 'POST',
			url: `${baseUrl}/send-group/${sessionId}`,
			body: { groupId, message },
		};
		responseData = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'honoWaApi',
			options,
		)) as IDataObject;
	} else {
		throw new NodeOperationError(
			this.getNode(),
			`Unknown message operation: ${operation}`,
			{ itemIndex },
		);
	}

	return responseData;
};
