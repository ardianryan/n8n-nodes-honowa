import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError, NodeApiError } from 'n8n-workflow';

import {
	messageOperations,
	messageProperties,
	executeMessageOperations,
} from './message.operations';

import {
	statusOperations,
	statusProperties,
	executeStatusOperations,
} from './status.operations';

import {
	sessionOperations,
	sessionProperties,
	executeSessionOperations,
} from './session.operations';

import {
	broadcastOperations,
	broadcastProperties,
	executeBroadcastOperations,
} from './broadcast.operations';

import {
	aiOperations,
	aiProperties,
	executeAiOperations,
} from './ai.operations';

export class HonoWa implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HonoWA',
		name: 'honoWa',
		icon: 'file:honowa-logo.svg',
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
						name: 'AI',
						value: 'ai',
						description: 'AI-powered chat and image generation',
					},
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
					{
						name: 'Status',
						value: 'status',
						description: 'Manage WhatsApp Status updates',
					},
				],
				default: 'message',
			},

			// ── Session Operations ──
			...sessionOperations,

			// ── Message Operations ──
			...messageOperations,

			// ── Broadcast Operations ──
			...broadcastOperations,
			// ── AI Operations ──
			...aiOperations,

			// ── Status Operations ──
			...statusOperations,

			// ── Session Properties ──
			...sessionProperties,

			// ── Message Properties ──
			...messageProperties,

			// ── Broadcast Properties ──
			...broadcastProperties,

			// ── AI Properties ──
			...aiProperties,

			// ── Status Properties ──
			...statusProperties,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				// ── AI ──
				if (resource === 'ai') {
					responseData = await executeAiOperations.call(this, operation, i);
				}

				// ── STATUS ──
				else if (resource === 'status') {
					responseData = await executeStatusOperations.call(this, operation, i);
				}

				// ── SESSION ──
				else if (resource === 'session') {
					responseData = await executeSessionOperations.call(this, operation, i);
				}

				// ── MESSAGE ──
				else if (resource === 'message') {
					responseData = await executeMessageOperations.call(this, operation, i);
				}

				// ── BROADCAST ──
				else if (resource === 'broadcast') {
					responseData = await executeBroadcastOperations.call(this, operation, i);
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
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		}

		return [returnData];
	}
}
