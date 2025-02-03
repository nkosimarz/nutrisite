import { render, screen } from '@testing-library/react';
import NutritionResult, { NutritionData } from '../NutritionResult';

describe('NutritionResult Component', () => {
    it('displays "No nutrition data available." if data is null', () => {
        render(<NutritionResult data={null} />);
        expect(screen.getAllByText('No nutrition data available.')[0]).toBeInTheDocument();
    });

    it('displays nutrition data if present', () => {
        const mockData: NutritionData = {
            calories: 250,
            fat: 10,
            protein: 15,
            carbs: 20,
            description: 'Sample description',
            imageUrl: null,
        };
        render(<NutritionResult data={mockData} />);
        expect(screen.getAllByText('Nutrition Information')[0]).toBeInTheDocument();
        expect(screen.getAllByText(/250/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Sample description/)[0]).toBeInTheDocument();
    });
});