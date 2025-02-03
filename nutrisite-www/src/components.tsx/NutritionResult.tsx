import React from 'react';

export interface NutritionData {
    calories: number;
    fat: number;
    protein: number;
    carbs: number;
    description: string;
    imageUrl: string | null;
}

interface NutritionResultProps {
    data: NutritionData | null;
}

const NutritionResult: React.FC<NutritionResultProps> = ({ data }) => {
    if (!data) {
        return <p>No nutrition data available.</p>;
    }

    return (
        <div className="nutrition-result">
            <h2>Nutrition Information</h2>
            <p className="description">{data.description}</p>
            <div className="nutrition-content">
                <div className="nutrition-details">
                    <ul>
                        <li>Calories: {data.calories}</li>
                        <li>Fat: {data.fat}g</li>
                        <li>Protein: {data.protein}g</li>
                        <li>Carbs: {data.carbs}g</li>
                    </ul>
                </div>
                {data.imageUrl && <img src={data.imageUrl} alt="Food" className="result-image" />}
            </div>
        </div>
    );
};

export default NutritionResult;