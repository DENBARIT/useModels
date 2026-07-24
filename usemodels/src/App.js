import React, { useState } from 'react';
import { useEffect } from 'react';
import starRating from './startRating';
import StarRating from './startRating';
const MOCK_MODELS = [
  {
    "id": "meta-llama/Meta-Llama-3-8B-Instruct",
    "author": "meta-llama",
    "gated": "auto",
    "lastModified": "2024-04-18T12:34:56.000Z",
    "likes": 4820,
    "downloads": 1250340,
    "pipeline_tag": "text-generation",
    "library_name": "transformers",
    "siblings": [
      {"rpath": "README.md"},
      {"rpath": "config.json"},
      {"rpath": "model.safetensors"}
    ]
  },
  {
    "id": "black-forest-labs/FLUX.1-schnell",
    "author": "black-forest-labs",
    "gated": false,
    "lastModified": "2024-08-01T09:15:22.000Z",
    "likes": 3210,
    "downloads": 890450,
    "pipeline_tag": "text-to-image",
    "library_name": "diffusers",
    "siblings": [
      {"rpath": "README.md"},
      {"rpath": "flux1-schnell.safetensors"}
    ]
  },
  {
    "id": "openai/whisper-large-v3",
    "author": "openai",
    "gated": false,
    "lastModified": "2023-11-05T16:40:00.000Z",
    "likes": 1945,
    "downloads": 620100,
    "pipeline_tag": "automatic-speech-recognition",
    "library_name": "transformers",
    "siblings": [
      {"rpath": "README.md"},
      {"rpath": "config.json"},
      {"rpath": "model.safetensors"}
    ]
  }
];

export default function App() {
  const [query,setQuery] = useState("");
   const [models, setModels] = useState([]); 
  const [selectedId, setSelectedId] = useState(null);
   const [debouncedQuery, setDebouncedQuery] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");
   const [favourite, setFavourite] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
  function handleSelectModel(id){
    if(id===selectedId){
      setIsOpen((open) => !open);
    }else{
      setSelectedId(id);
      setIsOpen(true);
    }
  }
  function handleFavourite(newModel){
  setFavourite((prev) => [...prev, newModel]);
  }
  console.log("Favourite models:", favourite);
  
  function handleClose(id){
    setSelectedId(null);
  }
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(handler); 
  }, [query]);

   useEffect(function(){
 const controller = new AbortController();
async function fetchModels(){
 try{
  setIsLoading(true);
  setError("");
  const url=debouncedQuery.length>2
    ?`https://huggingface.co/api/models?search=${encodeURIComponent(debouncedQuery)}&limit=10`
    :`https://huggingface.co/api/models?limit=10`;

const response = await fetch(url,
  {signal: controller.signal,
    method: 'GET',
    headers:{
      Authorization: `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`
    }
  }
);
if(!response.ok){
  throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
}
const data = await response.json();
if (data.length===0){setModels([]); 
  throw new Error("Model not found");}
console.log("Fetched models:", data);
setModels(data);
 }catch(err){
if(err.name === 'AbortError'){
  console.log('Fetch aborted');
}else{
  setError(err.message);
}
 }finally{
  setIsLoading(false);
 }
}fetchModels();

return () => controller.abort();
  },[debouncedQuery])
  return <div>
    <Navbar >
    <Search query={query} setQuery={setQuery} />
    <FoundResults  models={models}/>
   
    </Navbar>
    <Main>
      <Box>
       {error && <p className="error">🚨{error}</p>}
<Modellist models={models} onSelect={handleSelectModel} selectedId={selectedId} onClose={handleClose} />
      </Box>
      <Box>
{selectedId&&isOpen ? <ModelDetials  selectedId={selectedId}  favourite={favourite} setFavourite={handleFavourite} onClose={handleClose} isOpen={isOpen} setIsOpen={setIsOpen}/>
        :
        <>
        <ModelSummaryBox favourite={favourite} />
        <ModelSummary  favourite={favourite} />
        </>
        }
      </Box>
    </Main>

  </div>  
}
function Navbar({children}) {
  return <div className="navbar">
    <Logo />
{children}
  </div>
}
function Logo(){
  return <div className="logo">
    
 
<span className="logo-emoji">🤖</span>
  <h1 className="logo-text">useModels</h1>
 </div>
}
function Search({query,setQuery}){
  
   const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const placeholders = [
    "Search for Llama-3",
    "Try 'Inception vibes'",
    "Search 'Sci-Fi summarizer'",
    "Try 'Whisper audio tracker'"
  ];
 useEffect(() => {
    const i = loopNum % placeholders.length;
    const fullText = placeholders[i];

    const handleTyping = () => {
      setPlaceholder(
        isDeleting
          ? fullText.substring(0, placeholder.length - 1)
          : fullText.substring(0, placeholder.length + 1)
      );

      // Determine speed variations
      if (!isDeleting && placeholder === fullText) {
        // Pause at the end of the full word
        setTypingSpeed(2000); 
        setIsDeleting(true);
      } else if (isDeleting && placeholder === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(400); // Pause briefly before typing next word
      } else {
        setTypingSpeed(isDeleting ? 50 : 150); // Deleting is faster than typing
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, loopNum, typingSpeed]);
  
  
  return <input className="search" type="text" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} />
}
function FoundResults({models}){
  return <p className="found-results">Found {models.length} results</p>

}

function Loader(){
return <div>  
<div className="spinner"></div>
  
  </div>

}
function Main({children}){
  return <div className="main">
    {children}
  </div>
}

function Box({children}){
  return <div className="box">
    {children}

  </div>
}
function ListedBoxButton({ isOpen, setIsOpen }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
      {isOpen ? "–" : "+"}
    </button>
  );
}
function Modellist({models,onSelect,selectedId,onClose}) {
  return <ul  className="list modellist">
  {models.map(model => (
  <Model key={model.id} model={model} onSelect={onSelect} selectedId={selectedId} onClose={onClose} />
  ))}
</ul>

}


function Model({model,onSelect,selectedId,onClose}) {
     const [author, modelName] = model.id.includes("/") 
    ? model.id.split("/") 
    : ["Unknown", model.id];
 
  const boxColor = stringToColor(modelName);
  const firstLetter = modelName ? modelName.charAt(0).toUpperCase() : "🤖";
 useEffect(function(){
if(!modelName)return;
document.title = `Model:${modelName}| useModels`;
return function(){
  document.title = "useModels";
}
 },[modelName
 ]); 
 return <li onClick={()=>onSelect(model.id)}  className={`model-item ${selectedId === model.id ? "selected" : ""}`}>
    <div className="model-avatar" style={{ backgroundColor: boxColor }}>{firstLetter}</div>
    <h3 className="model-name">{modelName||model.id}</h3>
        <div className="model-info">
        <h3 className="model-author">by {author||"Anonymous"}</h3>
     <div className="model-stats">
          {model.pipeline_tag && (
            <span className="stat-pill">🏷️ {model.pipeline_tag}</span>
          )}
          {model.library_name && (
            <span className="stat-pill">📦 {model.library_name}</span>
          )}
          <span className="stat-count">📥 {model.downloads.toLocaleString()}</span>
        </div>
  
  </div>
  </li>

}

function stringToColor(str) {
  if (!str) return "var(--primary-color, #7289da)";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 65%, 45%)`; 

}

function ModelDetials({selectedId,favourite,setFavourite,onClose,isOpen,setIsOpen}){
  const [models,setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
const [rating, setRating] = useState(0);
const [isFavorite, setIsFavorite] = useState(false);



useEffect(function(){
const controller = new AbortController();
async function fetchModels(){
  setIsLoading(true);
  
  const url= `https://huggingface.co/api/models?search=${encodeURIComponent(selectedId)}&limit=1`;
const response = await fetch(url,
  {signal: controller.signal,
    method: 'GET',
    headers:{
      Authorization: `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`
    }
  });

  const data = await response.json();
setModels(data);
setIsLoading(false); 
console.log("Fetched model details:", data);
 }
fetchModels();




},[selectedId]);
const modelData=models.length>0? models[0]:null;

if(isLoading){
  return <Loader />
}
if(!modelData){
  return <p className="error">🚨Model not found</p>
}
const [author, modelName] = modelData?.id.includes("/") ? modelData.id.split("/") : ["Unknown", modelData?.id];
 
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
        
   {/* Metadata Details */}
       
          <p className="model-description"><strong>🔀 Pipeline Tag:</strong> {modelData.pipeline_tag || "none"}</p>
          <p className="model-description"><strong>📦 Library:</strong> {modelData.library_name || "Unknown"}</p>
          <p className="model-description"><strong> 📅 Created At:</strong> {formattedDate}</p>
        
        {/* Dynamic Tag Pills list */}
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
          <StarRating maxRating={10}  color="#6366f1" size="24" onSetRating={setRating} />
          {rating>0 && (
            <button
              className={`btn-favorite ${isFavorite ? "is-favorite" : ""}`}
              onClick={() => {
                setIsFavorite((fav) => !fav);
                AddToFavorites();
              }}
            >
              {isFavorite ? "★ Added to Favorites" : "☆ Add to Favorites"}
            </button>
          )}
        </div>
      </main></>)}
    </div>
  </div>
      

}
function ModelSummaryBox({favourite}){
  const numberOfFavorites = favourite.length;
  const mostlikedModel = favourite.reduce((max, model) => (model.likes > max.likes ? model : max), { likes: 0 });
  return <div className="model-summary-box">
    <h3>📊 Model Summary</h3>
    <p>Total Favourites: <span className="summary-highlight">{numberOfFavorites}</span></p>
    {numberOfFavorites > 0 && (
      <p>Most Liked: <span className="summary-highlight">{mostlikedModel.modelName}</span> by {mostlikedModel.author} with {mostlikedModel.likes.toLocaleString()} ❤️</p>
    )}
  </div>;


}
function ModelSummary({favourite}){
  return <div className="model-summary">

<span className="logo-emoji summary-emoji">🤖</span>
  
      <h2>Welcome to useModels</h2>
      <p className="summary-tagline">Search for models above and click one to view its details.</p>
  {  (
    favourite.length > 0 ? (
      <div className="favourite-section">
        <h3>⭐ Favourite Models</h3>
        <ul className="favourite-list">
          {favourite.map((model, index) => (
            <li key={index} className="favourite-item">
              <div className="model-avatar" style={{ backgroundColor: model.boxColor }}>
                {model.firstLetter}
              </div>
              <div>
                <h4>{model.modelName}</h4>
                <span className="author-tag">By {model.author}</span>
                <span className="rating-tag">★ {model.rating}/10</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <p className="summary-hint">✨ No favourites yet — add one from a model's details page.</p>
    )
  ) }

  </div>;
  
}
