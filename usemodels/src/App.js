import React, { useState } from 'react';
import { useEffect } from 'react';
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
    <FoundResults/>
   
    </Navbar>
    <Main>
      <Box>
       {isLoading? <Loader /> : <Modellist models={models} />}
       {error && <p className="error">🚨{error}</p>}
<Modellist models={models} />
      </Box>
      <Box>
<ModelDetials />
        <ModelSummary />
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
function FoundResults(){
  return <p className="found-results">Found X results</p>

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
function Modellist({models}){
  return <ul  className="list modellist">
  {models.map(model => (
  <Model key={model.id} model={model} />
  ))}
</ul>

}


function Model({model}){
     const [author, modelName] = model.id.includes("/") 
    ? model.id.split("/") 
    : ["Unknown", model.id];
 
  const boxColor = stringToColor(modelName);
  
  
  const firstLetter = modelName ? modelName.charAt(0).toUpperCase() : "🤖";
  return <li>
    <div className="model-avatar" style={{ backgroundColor: boxColor }}>{firstLetter}</div>
    <h3 className="model-name">{modelName||model.id}</h3>
        <div className="model-info">
        <h3 className="model-author">by {author||"Anonymous"}</h3>
     <div className="model-stats">
          {model.pipeline_tag && (
            <span>🏷️ {model.pipeline_tag}</span>
          )}
          {model.library_name && (
            <span >📦 {model.library_name}</span>
          )}
          <span >📥 {model.downloads.toLocaleString()}</span>
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
  // Keep the colors in a bright, modern saturation/lightness range
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 65%, 45%)`; 
}

function ModelDetials(){

}
function ModelSummary(){
  
}
