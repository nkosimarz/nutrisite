import { APIGatewayEvent } from 'aws-lambda';

export const mockHandler = async (event: APIGatewayEvent) => {
    const requestBody = JSON.parse(event.body || '{}');
    const imageBase64 = typeof requestBody !== 'string' ? requestBody.image : JSON.parse(requestBody).image;

    if (!imageBase64) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'No image found in request' }),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            calories: 250,
            fat: 10,
            protein: 15,
            carbs: 20,
            description: 'Sample description',
        }),
    };
}

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

        const result = await mockHandler(event);
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

        const result = await mockHandler(event);
        expect(result.statusCode).toBe(500);
        const body = JSON.parse(result.body);
        expect(body).toHaveProperty('error');
    });
});