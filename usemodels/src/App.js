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
   useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(handler); // Clears timer if user types another letter immediately
  }, [query]);
   useEffect(function(){
 const controller = new AbortController();
async function fetchModels(){
 try{
  setIsLoading(true);
  const proxyUrl = "https://herokuapp.com";
const url=debouncedQuery.length>2?`https://huggingface.co/${debouncedQuery}`:`https://huggingface.co`;

const response = await fetch(url+proxyUrl,
  {signal: controller.signal,
    method: 'GET',
    headers:{
      Authorization: `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json"
    }
  }
);
const data = await response.json();
console.log(data);
 }catch(err){
if(err.name === 'AbortError'){
  console.log('Fetch aborted');
}
 }




}fetchModels();

  },[debouncedQuery])
  return <div>
    <Navbar >
    <Search query={query} setQuery={setQuery} />
    <FoundResults/>
    </Navbar>
    <Main>
      <Box>
        <Modellist />

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
  return <p>Found X results</p>

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
function Modellist({MockModels=MOCK_MODELS}){
  return <div className="modellist">
<ul>
  {MockModels.map(model => (
  <Model key={model.id} model={model} />
  ))}
</ul>
  </div>
}
function Model({model}){
return <li>
  
</li>
}
function ModelDetials(){

}
function ModelSummary(){
  
}