import React, { useEffect, useState } from "react";
import StarRating from "./startRating";
import Loader from "./Loader";
import ListedBoxButton from "./ListedBoxButton";
import { stringToColor } from "../utils/stringToColor";

export default function ModelDetials({selectedId,favourite,setFavourite,onClose,isOpen,setIsOpen}){
  const [models,setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
const [rating, setRating] = useState(0);
// const [isFavorite, setIsFavorite] = useState(false);


const Favouritemodel = favourite.some(model => model.id === selectedId);
useEffect(function(){
const controller = new AbortController();
async function fetchModels(){
  try{setIsLoading(true);
  
  const url= `https://huggingface.co/api/models?search=${encodeURIComponent(selectedId)}&limit=1`;
const response = await fetch(url,
  {signal: controller.signal,
    method: 'GET',
    headers:{
      Authorization: `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`
    }
  });

  const data = await response.json();
setModels(data);}
catch(error){
  if(error.name==="AbortError")return;
  console.error("Error fetching model details:", error);
  setIsLoading(false);
}
}
fetchModels();
return () => controller.abort();
},[selectedId]);
const modelData=models.length>0? models[0]:null;
const [author, modelName] = modelData?.id.includes("/") ? modelData.id.split("/") : ["Unknown", modelData?.id];

useEffect(function(){
if(!modelName)return;
document.title = `Model:${modelName}| useModels`;
return function(){
  document.title = "useModels";
}
},[modelName]);

if(isLoading){
  return <Loader />
}
if(!modelData){
  return <p className="error">🚨Model not found</p>
}

  const boxColor = stringToColor(modelName);
  const firstLetter = modelName ? modelName.charAt(0).toUpperCase() : "🤖";
  const formattedDate = modelData.createdAt 
    ? new Date(modelData.createdAt).toLocaleDateString() : "Unknown";
function AddToFavorites() {
const newFavorite = {
  id: selectedId,
  rating: rating,
  createdAt: modelData.createdAt,
  modelName: modelName,
  author,
  firstLetter,
  boxColor,
  formattedDate,
  likes: modelData.likes || 0
};
setFavourite(newFavorite);
onClose(selectedId);
}

return <div>
{isLoading && <Loader /> }
 
<div className="model-details-card">
  <ListedBoxButton isOpen={isOpen} setIsOpen={setIsOpen} />
  {isOpen && (<>
      <header className="model-header">
        <div className="model-avatar" style={{ backgroundColor: boxColor }}>
          {firstLetter}
        </div>
        <div>
        
          <h2>{modelName}</h2>  <span className="author-tag">By {author}</span>
          {modelData.private && <span className="badge private">Private</span>}
        </div>
        <span ><a 
    href={`https://huggingface.co/${modelData.id}/tree/main`}
    target="_blank" 
    rel="noopener noreferrer" 
    style={{fontSize:"1.8rem"}} 
    title="Open files on Hugging Face"
  >
    🔗
  </a></span>
      </header>

      <main className="model-body">
<div className="model-description">
        <span className="label">📥 Downloads</span>
            <span className="value">{modelData.downloads?.toLocaleString() || 0}</span>
            </div>
          
          <div className="model-description">
            <span className="label">❤️ Likes</span>
            <span className="value"> {modelData.likes?.toLocaleString() || 0}</span>
          </div>
         <div className="model-description">
            <span className="label">📈 Trending Score</span>
            <span className="value"> {modelData.trendingScore || 0}</span>
          </div>
        
       
          <p className="model-description"><strong>🔀 Pipeline Tag:</strong> {modelData.pipeline_tag || "none"}</p>
          <p className="model-description"><strong>📦 Library:</strong> {modelData.library_name || "Unknown"}</p>
          <p className="model-description"><strong> 📅 Created At:</strong> {formattedDate}</p>
        
       <h3>🗂️ Tags</h3>  
       {modelData.tags && modelData.tags.length > 0 && (
          <div className="tags-container">
           
            <div className="tags-flex">
              {modelData.tags.map((tag, index) => (
                <span key={index} className="tag-pill">{tag}</span>
              ))}
            </div>
          </div>
        )}
        <div className="rating-container">
          {Favouritemodel ? (
            <span className="already-favorite">★ Already in Favorites</span>
          ) : (
            <>
              <StarRating maxRating={10}  color="#6366f1" size="24" onSetRating={setRating} />
              {rating>0 && (
                <button
                  className="btn-favorite"
                  onClick={AddToFavorites}
                >
                  ☆ Add to Favorites
                </button>
              )}
            </>
          )}
        </div>
      </main></>)}
    </div>
  </div>
      

}