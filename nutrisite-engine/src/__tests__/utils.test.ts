import { NutritionResponse } from "../types";
import { transformResponse } from "../utils";


describe('transformResponse', () => {
  it('should transform the response correctly', () => {
    const data = {
      dishes: [
        { calories: 300, protein: 25, carbohydrates: 0, fat: 20 },
        { calories: 365, protein: 4, carbohydrates: 54, fat: 17 },
        { calories: 50, protein: 2, carbohydrates: 8, fat: 2 },
      ],
      comments: 'Test comments',
    };

    const expected: NutritionResponse = {
      calories: 715,
      protein: 31,
      carbs: 62,
      fat: 39,
      description: 'Test comments',
    };

    const result = transformResponse(data);
    expect(result).toEqual(expected);
  });
});