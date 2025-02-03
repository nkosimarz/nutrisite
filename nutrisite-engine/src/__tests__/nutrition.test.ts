import { handler } from '../nutrition';
import { APIGatewayEvent } from 'aws-lambda';

describe('nutrition handler', () => {
    it('should return a successful response with mock data', async () => {
        const event: APIGatewayEvent = {
            body: JSON.stringify({ image: 'base64Image' }),
            headers: {},
            httpMethod: 'POST',
            path: '/api/nutrition',
            isBase64Encoded: false,
            queryStringParameters: null,
            requestContext: {} as any,
            resource: '/api/nutrition',
            multiValueHeaders: {},
            pathParameters: null,
            multiValueQueryStringParameters: null,
            stageVariables: null,
        };

        const result = await handler(event);
        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body).toHaveProperty('calories');
        expect(body).toHaveProperty('protein');
        expect(body).toHaveProperty('carbs');
        expect(body).toHaveProperty('fat');
        expect(body).toHaveProperty('description');
    });

    it('should return an error response when an exception occurs', async () => {
        const event: APIGatewayEvent = {
            body: null,
            headers: {},
            httpMethod: 'POST',
            path: '/api/nutrition',
            isBase64Encoded: false,
            queryStringParameters: null,
            requestContext: {} as any,
            resource: '/api/nutrition',
            multiValueHeaders: {},
            pathParameters: null,
            multiValueQueryStringParameters: null,
            stageVariables: null,
        };

        const result = await handler(event);
        expect(result.statusCode).toBe(500);
        const body = JSON.parse(result.body);
        expect(body).toHaveProperty('error');
    });
});