import express from 'express';
import type { APIGatewayEvent } from 'aws-lambda';
import { handler as nutritionHandler } from './nutrition';
import cors from 'cors';

const app = express();
const port = 5172;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.info(`Server running on http://localhost:${port}`);
});

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
        stageVariables: null
    };

    try {
        const result = await nutritionHandler(event);
        res.status(result.statusCode).json(JSON.parse(result.body));
    } catch (error) {
        console.error('Error getting nutrition data (local):', error);
        res.status(500).json({ error: 'Error getting nutrition data (local)' });
    }
});
