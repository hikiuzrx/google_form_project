'use client';
import { useState, useEffect, useRef } from 'react';
import FormCard from './FormCard';
import { formCardProps, forms, Session } from 'next-auth';
import { SessionContextValue, useSession } from 'next-auth/react';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const InfiniteScrollForms = (session: any) => {
  const [forms, setForms] = useState<forms[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
// Track if there are more forms to load
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      if (loading || !hasMore ) return; // Prevent fetching if already loading or no more forms
      if(session){
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/forms/recent-forms?offset=${offset}&limit=5`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${session.refreshToken}`
            }
          });
          const data = await response.json();
          
          if (data.forms.length === 0) {
            setHasMore(false); // No more forms to load
          } else {
            setForms((prevForms) => [...prevForms, ...data.forms]);
            setHasMore(data.hasMore) // Add new forms to the list
            console.log(forms)
          }
        } catch (error) {
          console.error('Error fetching forms:', error);
          setHasMore(false); // Stop loading on error
        } finally {
  
         if(!hasMore){
          setLoading(false)
         } // Ensure loading stops
        }
      };
      }
 

    fetchForms();
  }, [offset]);

  // Set up IntersectionObserver to detect when the user reaches the end
  useEffect(() => {
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prevOffset) => prevOffset + 5); // Load 5 more forms
        }
      });
    }

    const target = document.querySelector("#load-more-trigger");
    if (target) observer.current.observe(target);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [hasMore]);

  return (
    <div>
      <h1>Recent Forms</h1>

      {forms.map((form:forms) =>( <FormCard key={form.formId} title={form.title} date={form.dateCreation}/>))}

      {loading && <p>Loading more forms...</p>}
      
      {/* Display message when no more forms */}
      {!hasMore && <>...</>}

      {/* The div where the observer will trigger more loading */}
      <div id="load-more-trigger" />
    </div>
  );
};

export default InfiniteScrollForms;
