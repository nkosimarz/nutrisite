import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { transformResponse } from './utils';
dotenv.config();

export async function handler(
    event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
    try {
        const dietagramApiKey = process.env.DIETAGRAM_API_KEY;

        const requestBody = JSON.parse(event.body || '{}');
        const imageBase64 = typeof requestBody !== 'string' ? requestBody.image : JSON.parse(requestBody).image;

        if (!imageBase64) {
            throw new Error('No image found in request');
        }

        const response = dietagramApiKey ? await axios.post('https://dietagram.p.rapidapi.com/apiFoodImageRecognition.php',
            new URLSearchParams({
                lang: 'en',
                image_base64: imageBase64
            }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-rapidapi-host': 'dietagram.p.rapidapi.com',
                'x-rapidapi-key': dietagramApiKey
            }
        }) : {
            data: {
                dishes: [
                    {
                        orderNumber: 1,
                        dishName: 'Grilled Lamb Chop',
                        weight: 200,
                        calories: 300,
                        fat: 20,
                        protein: 25,
                        carbohydrates: 0
                    },
                    {
                        orderNumber: 1,
                        dishName: 'Chips (French Fries)',
                        weight: 150,
                        calories: 365,
                        fat: 17,
                        protein: 4,
                        carbohydrates: 54
                    },
                    {
                        orderNumber: 1,
                        dishName: 'Vegetable Salsa',
                        weight: 100,
                        calories: 50,
                        fat: 2,
                        protein: 2,
                        carbohydrates: 8
                    }
                ],
                comments: `THIS IS A MOCK RESPONSE: 
                The image shows a plate with grilled lamb chop, chips, and a vegetable salsa. 
                The lamb chop is likely seasoned and grilled, while the chips are fried potatoes. 
                The vegetable salsa appears to contain various vegetables, possibly including tomatoes and peppers.`
            }
        };

        const result = transformResponse(response.data);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error })
        };
    }
}