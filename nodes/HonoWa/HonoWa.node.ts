import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class HonoWa implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HonoWA',
		name: 'honoWa',
		icon: 'file:honowa.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with HonoWA — Unofficial WhatsApp API for multi-session messaging, broadcast, and media.',
		defaults: {
			name: 'HonoWA',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'honoWaApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Broadcast',
						value: 'broadcast',
						description: 'Send bulk messages to multiple contacts',
					},
					{
						name: 'Message',
						value: 'message',
						description: 'Send messages to contacts or groups',
					},
					{
						name: 'Session',
						value: 'session',
						description: 'Manage WhatsApp sessions',
					},
				],
				default: 'message',
			},

			// ── Session Operations ──
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['session'],
					},
				},
				options: [
					{
						name: 'Delete',
						value: 'delete',
						description: 'Logout and delete a session',
						action: 'Delete a session',
					},
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Get status of a specific session',
						action: 'Get session status',
					},
					{
						name: 'List',
						value: 'list',
						description: 'Get all WhatsApp sessions',
						action: 'List all sessions',
					},
				],
				default: 'list',
			},

			// ── Message Operations ──
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

			// ── Broadcast Operations ──
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
						name: 'Send Bulk',
						value: 'sendBulk',
						description: 'Send message to multiple phone numbers',
						action: 'Send bulk messages',
					},
				],
				default: 'sendBulk',
			},

			// ── Message: Phone ──

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

			// ── Broadcast: Phones ──
			{
				displayName: 'Phone Numbers',
				name: 'phones',
				type: 'string',
				required: true,
				default: '',
				placeholder: '628123456789,628987654321',
				description: 'Comma-separated list of phone numbers in international format',
				displayOptions: {
					show: {
						resource: ['broadcast'],
						operation: ['sendBulk'],
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
				required: true,
				default: '',
				placeholder: 'Hello everyone!',
				description: 'The broadcast message text',
				displayOptions: {
					show: {
						resource: ['broadcast'],
						operation: ['sendBulk'],
					},
				},
			},

			// ── Broadcast: Delay ──
			{
				displayName: 'Delay (Ms)',
				name: 'delayMs',
				type: 'number',
				default: 5000,
				description: 'Delay in milliseconds between each message to avoid rate limiting (minimum 5000 recommended)',
				displayOptions: {
					show: {
						resource: ['broadcast'],
						operation: ['sendBulk'],
					},
				},
			},

			// ── Broadcast: Media URL (Optional) ──
			{
				displayName: 'Media URL (Optional)',
				name: 'mediaUrl',
				type: 'string',
				default: '',
				placeholder: 'https://example.com/image.jpg',
				description: 'Optional media URL to include with the broadcast',
				displayOptions: {
					show: {
						resource: ['broadcast'],
						operation: ['sendBulk'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('honoWaApi');
		const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
		const sessionId = credentials.sessionId as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject;

				// ── SESSION ──
				if (resource === 'session') {
					if (operation === 'list') {
						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseUrl}/sessions`,
						};
						responseData = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'honoWaApi',
							options,
						)) as IDataObject;
					} else if (operation === 'getStatus') {
						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `${baseUrl}/session/status/${sessionId}`,
						};
						responseData = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'honoWaApi',
							options,
						)) as IDataObject;
					} else if (operation === 'delete') {
						const options: IHttpRequestOptions = {
							method: 'DELETE',
							url: `${baseUrl}/session/${sessionId}`,
						};
						responseData = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'honoWaApi',
							options,
						)) as IDataObject;
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Unknown session operation: ${operation}`,
							{ itemIndex: i },
						);
					}
				}

				// ── MESSAGE ──
				else if (resource === 'message') {
					if (operation === 'sendText') {
						const phone = this.getNodeParameter('phone', i) as string;
						const message = this.getNodeParameter('message', i) as string;
						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseUrl}/send/${sessionId}`,
							body: { phone, message },
						};
						responseData = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'honoWaApi',
							options,
						)) as IDataObject;
					} else if (operation === 'sendMediaUrl') {
						const phone = this.getNodeParameter('phone', i) as string;
						const message = this.getNodeParameter('message', i) as string;
						const mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseUrl}/send/${sessionId}`,
							body: { phone, message, mediaUrl },
						};
						responseData = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'honoWaApi',
							options,
						)) as IDataObject;
					} else if (operation === 'sendMediaBinary') {
						const phone = this.getNodeParameter('phone', i) as string;
						const message = this.getNodeParameter('message', i) as string;
						const binaryProperty = this.getNodeParameter('binaryProperty', i) as string;

						const binaryData = this.helpers.assertBinaryData(i, binaryProperty);
						const buffer = await this.helpers.getBinaryDataBuffer(i, binaryProperty);

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseUrl}/send/${sessionId}`,
							headers: {
								'Content-Type': 'multipart/form-data',
							},
							body: {
								phone,
								message,
								media: {
									value: buffer,
									options: {
										filename: binaryData.fileName || 'file',
										contentType: binaryData.mimeType,
									},
								},
							},
						};
						responseData = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'honoWaApi',
							options,
						)) as IDataObject;
					} else if (operation === 'sendGroup') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const message = this.getNodeParameter('message', i) as string;
						const options: IHttpRequestOptions = {
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
							{ itemIndex: i },
						);
					}
				}

				// ── BROADCAST ──
				else if (resource === 'broadcast') {
					if (operation === 'sendBulk') {
						const phonesRaw = this.getNodeParameter('phones', i) as string;
						const message = this.getNodeParameter('message', i) as string;
						const delayMs = this.getNodeParameter('delayMs', i) as number;
						const mediaUrl = this.getNodeParameter('mediaUrl', i) as string;

						const phones = phonesRaw.split(',').map((p) => p.trim()).filter((p) => p.length > 0);

						const body: IDataObject = { phones, message, delayMs };
						if (mediaUrl) {
							body.mediaUrl = mediaUrl;
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseUrl}/broadcast/${sessionId}`,
							body,
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
							{ itemIndex: i },
						);
					}
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`Unknown resource: ${resource}`,
						{ itemIndex: i },
					);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
