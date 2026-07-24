import React, { useState } from 'react';
import { useEffect } from 'react';
import {useLocalStorageState} from './CustomHooks/useLocalStorage';
import logo from "./assets/logo.svg";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import LandingScreen from './Components/LandingScreen';
import Search from './Components/Search';
import ModelDetials from './Components/MovieDetails';
import Loader from './Components/Loader';
import { stringToColor } from './utils/stringToColor';
export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [query,setQuery] = useState("");
   const [models, setModels] = useState([]); 
  const [selectedId, setSelectedId] = useState(null);
   const [debouncedQuery, setDebouncedQuery] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");
  //  const [favourite, setFavourite] = useState([]);
  const [favourite, setFavourite] = useLocalStorageState([], "favouriteModels");
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
  function handleRemoveFavourite(id){
  setFavourite((prev) => prev.filter((model) => model.id !== id));
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
    {showLanding && <LandingScreen onFinish={() => setShowLanding(false)} />}
    <Navbar >
    <Search query={query} setQuery={setQuery} onClose={handleClose} />
    <FoundResults  models={models}/>
   
    </Navbar>
    <Main>
      <Box>
       {error && <p className="error">🚨{error}</p>}
       {isLoading ? <Loader /> : !error && <Modellist models={models} onSelect={handleSelectModel} selectedId={selectedId} onClose={handleClose} />}
      </Box>
      <Box>
{selectedId&&isOpen  ? <ModelDetials  selectedId={selectedId}  favourite={favourite} setFavourite={handleFavourite} onClose={handleClose} isOpen={isOpen} setIsOpen={setIsOpen}/>
        :
        <>
        <ModelSummaryBox favourite={favourite} />
        <ModelSummary  favourite={favourite} onRemove={handleRemoveFavourite} />
        </>
        }
      </Box>
    </Main>
<Footer/>
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


function FoundResults({models}){
  return <p className="found-results">Found {models.length} results</p>

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
          <span className="stat-count">📥 {model.downloads?.toLocaleString() || 0}</span>
        </div>
  
  </div>
  </li>

}

function ModelSummaryBox({favourite}){
  const numberOfFavorites = favourite.length;
  const topRatedModel = favourite.reduce((max, model) => (model.rating > max.rating ? model : max), { rating: 0 });
  return <div className="model-summary-box">
    <h3>📊 Model Summary</h3>
    <p>Total Favourites: <span className="summary-highlight">{numberOfFavorites}</span></p>
    {numberOfFavorites > 0 && (
      <p>Top Rated: <span className="summary-highlight">{topRatedModel.modelName}</span> by {topRatedModel.author} {topRatedModel.rating}/10</p>
    )}
  </div>;


}
function ModelSummary({favourite,onRemove}){
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
              <div className="favourite-item-info">
                <h4>{model.modelName}</h4>
                <span className="author-tag">By {model.author}</span>

              </div>
              <span className="rating-tag">★ {model.rating}/10</span>
                 <span className="file-link"><a
    href={`https://huggingface.co/${model.id}/tree/main`}
    target="_blank"
    rel="noopener noreferrer"
    style={{fontSize:"1.8rem"}}
    title="Open files on Hugging Face"
  >
    🔗
  </a></span>
              <button
                className="btn-remove-favorite"
                onClick={() => onRemove(model.id)}
                title="Remove from favorites"
                aria-label={`Remove ${model.modelName} from favorites`}
              >
                ✕
              </button>
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
function Footer(){
  return <footer className="footer">
    <img src={logo} alt="Denbarit technologies Logo" className="logo-image" />
    <span className="contact-email">
      <a href="mailto:leulethiopia05@gmail.com">
        <span className="email-logo" role="img" aria-label="Email"><MdEmail /></span>
        leulethiopia05@gmail.com
      </a>
    </span>
    <a className="social-link" href="https://www.linkedin.com/in/leul-gebremariam-930810354" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
      <FaLinkedin />
    </a>
    <a className="social-link" href="https://github.com/DENBARIT/useModels" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
      <FaGithub />
    </a>
    </footer>
}
