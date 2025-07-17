"use client";

import { useState } from "react";

export default function Main() {
  const [channelUrl, setChannelUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);

  const handleFetchThumbnails = (e) => {
    e.preventDefault();
    setError(null);
    setThumbnails([]);
    setLoading(true);

  
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        YouTube Channel Thumbnails
      </h1>

      <form
        onSubmit={handleFetchThumbnails}
        className="w-full max-w-md flex gap-2 mb-6"
      >
        <input
          type="text"
          placeholder="Enter YouTube channel URL"
          value={channelUrl}
          onChange={(e) => setChannelUrl(e.target.value)}
          required
          className="flex-1 px-4 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-black text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch"}
        </button>
      </form>

      {error && (
        <div className="text-red-500 font-medium mb-4">{error}</div>
      )}

      {thumbnails.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl">
          {thumbnails.map((thumb, idx) => (
            <img
              key={idx}
              src={thumb}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full rounded-md border border-white"
            />
          ))}
        </div>
      )}
    </div>
  );
}
