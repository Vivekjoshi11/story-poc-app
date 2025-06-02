'use client';

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const response = await axios.post('/api/generate-image', { prompt });
      setImage(response.data.image);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        GoEnhance AI Image Generator
      </h1>
      <div className="mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter image description (e.g., 'A futuristic city at sunset')"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      {image && (
        <div className="mt-4">
          <Image
            src={image}
            alt="Generated Image"
            width={512}
            height={512}
            className="w-full rounded"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/OhfPQAJ/wP/6N4lZAAAAABJRU5ErkJggg=="
          />
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;