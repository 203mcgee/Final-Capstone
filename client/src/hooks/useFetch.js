// https://api.github.com/users/203mcgee/repos
import { useState,useEffect } from "react";

export default function Fetch (url){
    const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
        try{
            const response = await fetch(url);
            if(!response.ok){
                throw new Error('Failed to get the projects');
            }

            const projects = await response.json();

            setData(projects);


        }catch(err){
            setError(err.message);
        }finally{
            setIsLoading(false);
        }
    };
    fetchProjects();
  },[url]) 
  

  return { data, isLoading, error };
  
}