import request from 'supertest';
import express from 'express';
import { handler as nutritionHandler } from '../nutrition';
import cors from 'cors';
import { APIGatewayEvent } from 'aws-lambda';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/nutrition', async (req, res) => {
    const base64Image = req.body.image;

    const event: APIGatewayEvent = {
        body: JSON.stringify({ image: base64Image }),
        headers: req.headers as any,
        httpMethod: 'POST',
        path: '/api/nutrition',
        isBase64Encoded: true,
        queryStringParameters: null,
        requestContext: {} as any,
        resource: '/api/nutrition',
        multiValueHeaders: {},
        pathParameters: null,
        multiValueQueryStringParameters: null,
        stageVariables: null,
    };

    try {
        const result = await nutritionHandler(event);
        res.status(result.statusCode).json(JSON.parse(result.body));
    } catch (error) {
        console.error('Error getting nutrition data (local):', error);
        res.status(500).json({ error: 'Error getting nutrition data (local)' });
    }
});

describe('local server', () => {
    it('should return a successful response with mock data', async () => {
        const response = await request(app)
            .post('/api/nutrition')
            .send({ image: 'base64Image' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('calories');
        expect(response.body).toHaveProperty('protein');
        expect(response.body).toHaveProperty('carbs');
        expect(response.body).toHaveProperty('fat');
        expect(response.body).toHaveProperty('description');
    });

    it('should return an error response when an exception occurs', async () => {
        const response = await request(app)
            .post('/api/nutrition')
            .send({});

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });
});