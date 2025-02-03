import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import FoodUpload from '../FoodUpload';

describe('FoodUpload Component', () => {
    it('renders the heading "Upload a food photo"', () => {
        const mockSetData = jest.fn();
        render(
            <Router>
                <FoodUpload setNutritionData={mockSetData} />
            </Router>
        );
        expect(screen.getByText('Upload a food photo')).toBeInTheDocument();
    });

    it('renders "No image chosen" by default', () => {
        const mockSetData = jest.fn();
        render(
            <Router>
                <FoodUpload setNutritionData={mockSetData} />
            </Router>
        );
        expect(screen.getByText('No image chosen')).toBeInTheDocument();
    });
});