import React, { useEffect, useRef, useState } from "react";
import { useKey } from "../CustomHooks/useKey";

export default function Search({query,setQuery,onClose}){
  
   const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const inputEl=useRef(null);
  const placeholders = [
    "Search for Llama-3",
    "Try 'Inception vibes'",
    "Search 'Sci-Fi summarizer'",
    "Try 'Whisper audio tracker'"
  ];
  useKey("escape",onClose);

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
  
  useEffect(function(){
inputEl.current.focus();
function callback(e){
  if(document.activeElement===inputEl.current)return;
  if(e.key==="Enter"){
    inputEl.current.focus();
    setQuery("");
    onClose()
  }
}


document.addEventListener("keydown",callback);
return function(){
  document.removeEventListener("keydown",callback);
}

  },[setQuery,onClose])
  return <input className="search" type="text" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} ref={inputEl} />
}