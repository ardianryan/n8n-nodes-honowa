import {
	IExecuteFunctions,
	IHttpRequestMethods,
	IDataObject,
} from 'n8n-workflow';

export interface OperationExecutor {
	(this: IExecuteFunctions, operation: string, itemIndex: number): Promise<IDataObject | IDataObject[]>;
}

export interface RequestOptions {
	method: IHttpRequestMethods;
	url: string;
	body?: IDataObject;
	qs?: IDataObject;
	formData?: IDataObject;
	headers?: IDataObject;
}
