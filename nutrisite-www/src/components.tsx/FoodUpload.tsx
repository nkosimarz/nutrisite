import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NutritionData } from './NutritionResult';
import { fetchAuthSession } from 'aws-amplify/auth';
import { post } from 'aws-amplify/api';

interface FoodUploadProps {
    setNutritionData: React.Dispatch<React.SetStateAction<NutritionData | null>>;
}

const FoodUpload: React.FC<FoodUploadProps> = ({ setNutritionData }) => {
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!image) return;

        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result?.toString().split(',')[1];
            const isLocal = window.location.hostname === 'localhost';

            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString();

            try {
                if (isLocal) {
                    const response = await fetch('http://localhost:5172/api/nutrition', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ image: base64Image }),
                    })
                    const data = await response.json()
                    setNutritionData({ ...data, imageUrl });
                    navigate('/results');
                    return;
                }
                const response =
                    post({
                        apiName: 'NutriSiteApi',
                        path: '/api/nutrition',
                        options: {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({ image: base64Image }),
                        },
                    }).response;
                const data = await (await response).body.json() as unknown as NutritionData;
                setNutritionData({ ...data, imageUrl });
                navigate('/results');
                return;
            } catch (error) {
                console.error('Error uploading image:', error);
            } finally {
                setLoading(false);
            }
        };
        reader.readAsDataURL(image);
    };

    return (
        <div className="upload">
            <h2>Upload a food photo</h2>
            <div className="image-container">
                {imageUrl ? (
                    <img src={imageUrl} alt="Selected food" className="selected-image" />
                ) : (
                    <div className="placeholder">No image chosen</div>
                )}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                Getting Info ...
                                <span className="spinner"></span>
                            </>
                        ) : (
                            'Get Nutrition Info'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FoodUpload;