"use client";

import{ useState }from "react";


const API_KEY= process.env.NEXT_PUBLIC_YT_API_KEY; 

function extractChannelId(url){
    try{
      const u= new URL(url.trim());
      const channelMatch= u.pathname.match(/\/channel\/([a-zA-Z0-9_-]+)/);
      if(channelMatch)return channelMatch[1];
  
      const handleMatch= u.pathname.match(/^\/(@[a-zA-Z0-9._-]+)/);
      if(handleMatch)return handleMatch[1];
    }catch(err){
      if(/^[a-zA-Z0-9_-]{24}$/.test(url.trim()))return url.trim();
    }
    return null;
  }

async function getChannelIdFromHandle(handle){
  const url= `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${handle}&key=${API_KEY}`;

  try{
    const res= await fetch(url);
    const data= await res.json();

    if(data.error)throw new Error(data.error.message);

    if(data.items && data.items.length > 0){
      return data.items[0].id.channelId;
    }

    throw new Error('Channel not found');
  }catch(err){
    console.error('Error fetching channel ID:', err.message);
    throw err;
  }
}

async function getVideoIds(channelId){
  const channelUrl= `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`;
  const channelRes= await fetch(channelUrl);
  const channelData= await channelRes.json();
  if(channelData.error)throw new Error(channelData.error.message);
  if(!channelData.items || channelData.items.length=== 0){
    throw new Error("wrong channel url");
  }
  const playlistId= channelData.items[0].contentDetails.relatedPlaylists.uploads;
  const playlistUrl= `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`;
  const playlistRes= await fetch(playlistUrl);
  const playlistData= await playlistRes.json();
  if(playlistData.error)throw new Error(playlistData.error.message);
  const videoIds=(playlistData.items || []).map(
   (item)=> item.contentDetails.videoId
  );
  return videoIds;
}



async function downloadImage(url, filename){
    try{
      const response= await fetch(url);
      const blob= await response.blob();
      const link= document.createElement('a');
      link.href= URL.createObjectURL(blob);
      link.download= filename;
      link.click();
      URL.revokeObjectURL(link.href);
    }catch(err){
      alert('Failed to download image.');
    }
  }

  
export default function Main(){
  const [channelUrl, setChannelUrl]=useState("");
  const [loading, setLoading]=useState(false);
  const [error, setError]=useState(null);
  const [thumbnails, setThumbnails]=useState([]);
  const [sortBy, setSortBy]= useState('newest');

  function handleSortChange(value){
    setSortBy(value);
    setThumbnails((prev)=>{
      if (value==='newest'){
        return [...prev].slice().reverse();
      }else if (value=== 'oldest'){
        return [...prev].slice().reverse();
      }
      return prev;
    });
  }

  const handleFetchThumbnails= async(e)=>{
    e.preventDefault();
    setError(null);
    setThumbnails([]);
    setLoading(true);

    const rawId= extractChannelId(channelUrl);

    if(!rawId){
      setError("enter valid channel id ");
      setLoading(false);
      return;
    }

    try{
      const channelId= rawId.startsWith('@')? await getChannelIdFromHandle(rawId): rawId;
      const videoIds= await getVideoIds(channelId);
      let thumbs= videoIds.map(
        (id)=> `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
      );
      if (sortBy=== 'oldest'){
        thumbs= thumbs.slice().reverse();
      }
      setThumbnails(thumbs);
    }catch(err){
      setError(err.message || "Something went wrong");                          
    }

    setLoading(false);
  };

  return(
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
          onChange={(e)=> setChannelUrl(e.target.value)}
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

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="sort-select" style={{ marginRight: '0.5rem' }}>Sort by:</label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={e=> handleSortChange(e.target.value)}
          className="bg-gray-50 text-black px-2 py-1 rounded border border-gray-400 focus:outline-none"
          >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
        </select>
        <span style={{ marginLeft: '1rem', color: '#666' }}>
         {thumbnails.length}videos found
        </span>
      </div>

     {error &&(
        <div className="text-red-500 font-medium mb-4">{error}</div>
      )}

     {thumbnails.length > 0 &&(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">

{thumbnails.map((thumb, idx)=> (
   <div key={idx}className="relative group">
     <img
       src={thumb}
       alt={`Thumbnail ${idx + 1}`}
       className="w-[980px] h-auto rounded-md border border-white shadow-md hover:opacity-80 transition-all duration-300 cursor-pointer"
       onClick={()=> downloadImage(thumb, `thumbnail-${idx + 1}.jpg`)}
       loading="lazy"
     />
     <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-black bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
       Click to download
     </span>
   </div>
 ))}
</div>

      )}
    </div>
  );
}
