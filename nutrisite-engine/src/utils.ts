import { NutritionResponse } from './types';

export function transformResponse(data: any): NutritionResponse {
    const totalCalories = data.dishes.reduce((sum: number, dish: any) => sum + dish.calories, 0);
    const totalProtein = data.dishes.reduce((sum: number, dish: any) => sum + dish.protein, 0);
    const totalCarbs = data.dishes.reduce((sum: number, dish: any) => sum + dish.carbohydrates, 0);
    const totalFat = data.dishes.reduce((sum: number, dish: any) => sum + dish.fat, 0);

    return {
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        description: data.comments
    };
}