import {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';

export const sessionOperations: INodeProperties[] = [
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
];

export const sessionProperties: INodeProperties[] = [
	// Saat ini tidak ada input parameter khusus (properties) tambahan untuk session.
	// Karena parameter sessionId sudah diambil secara global dari credentials.
];

export const executeSessionOperations: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const credentials = await this.getCredentials('honoWaApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
	const sessionId = credentials.sessionId as string;

	let responseData: IDataObject;

	if (operation === 'list') {
		const options: RequestOptions = {
			method: 'GET',
			url: `${baseUrl}/sessions`,
		};
		responseData = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'honoWaApi',
			options,
		)) as IDataObject;
	} else if (operation === 'getStatus') {
		const options: RequestOptions = {
			method: 'GET',
			url: `${baseUrl}/session/status/${sessionId}`,
		};
		responseData = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'honoWaApi',
			options,
		)) as IDataObject;
	} else if (operation === 'delete') {
		const options: RequestOptions = {
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
			{ itemIndex },
		);
	}

	return responseData;
};
