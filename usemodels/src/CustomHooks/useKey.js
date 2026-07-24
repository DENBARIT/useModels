import {useEffect} from "react";

export function useKey(key,callback ){
    useEffect(function(){
  function handle(e){
    if(e.code.toLowerCase()===key.toLowerCase()){
      callback();
    }}
   document.addEventListener("keydown",handle);
   return function(){
    document.removeEventListener("keydown",handle);  
}
},[callback,key]);}