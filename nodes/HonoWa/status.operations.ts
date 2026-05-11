import {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';

export const statusOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['status'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new WhatsApp status',
				action: 'Create a status',
			},
		],
		default: 'create',
	},
];

export const statusProperties: INodeProperties[] = [
	// ── Status: Type ──
	{
		displayName: 'Status Type',
		name: 'statusType',
		type: 'options',
		options: [
			{
				name: 'Media URL',
				value: 'media',
			},
			{
				name: 'Text',
				value: 'text',
			},
		],
		default: 'text',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['create'],
			},
		},
	},
	// ── Status: Text ──
	{
		displayName: 'Text / Caption',
		name: 'statusText',
		type: 'string',
		default: '',
		placeholder: 'My new status update!',
		description: 'Text of the status, or caption if sending a media URL',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['create'],
			},
		},
	},
	// ── Status: Media URL ──
	{
		displayName: 'Media URL',
		name: 'statusMediaUrl',
		type: 'string',
		default: '',
		placeholder: 'https://example.com/image.jpg',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['create'],
				statusType: ['media'],
			},
		},
	},
];

export const executeStatusOperations: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const credentials = await this.getCredentials('honoWaApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
	const sessionId = credentials.sessionId as string;

	let responseData: IDataObject;

	if (operation === 'create') {
		const statusType = this.getNodeParameter('statusType', itemIndex) as string;
		
		const body: IDataObject = {};
		
		// Map `statusText` to `text` field in body. It can act as text status or media caption.
		const statusText = this.getNodeParameter('statusText', itemIndex, '') as string;
		if (statusText) {
			body.text = statusText;
		}

		if (statusType === 'media') {
			const mediaUrl = this.getNodeParameter('statusMediaUrl', itemIndex, '') as string;
			if (mediaUrl) {
				body.mediaUrl = mediaUrl;
			}
		}

		const options: RequestOptions = {
			method: 'POST',
			url: `${baseUrl}/status/${sessionId}`,
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
			`Unknown status operation: ${operation}`,
			{ itemIndex },
		);
	}

	return responseData;
};
