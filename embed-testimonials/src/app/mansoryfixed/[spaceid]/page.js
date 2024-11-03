"use client";

import { useState, useEffect, useRef } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation"; // For dynamic route params
import { db } from "@/lib/firebase"; // Adjusted path for 'src' alias
import "video.js/dist/video-js.css"; // Video.js styles
import videojs from "video.js"; // Import Video.js
import styles from "./carousel.module.css";
import "./index.css"; // Styles for the carousel and masonry views

const EmbedTestimonial = () => {
  const { spaceid } = useParams(); // Extract route params dynamically

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch testimonials from Firebase
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const testimonialsRef = collection(db, "testimonials");
      const q = query(
        testimonialsRef,
        where("spaceId", "==", spaceid),
        where("isLiked", "==", true)
      );

      const querySnapshot = await getDocs(q);
      const fetchedTestimonials = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestimonials(fetchedTestimonials);
      console.log(fetchedTestimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (spaceid) fetchTestimonials(); // Fetch only if spaceid is available
  }, [spaceid]);

  const RenderMasonryCard = ({ testimonial, index }) => {
    const videoRef = useRef(null); // Reference for Video.js player
    const playerRef = useRef(null); // Store the Video.js player instance
    const [isMounted, setIsMounted] = useState(false); // Track mount status
  
    useEffect(() => {
      setIsMounted(true); // Set to true when the component mounts
      return () => setIsMounted(false); // Cleanup on unmount
    }, []);
  
    useEffect(() => {
      if (isMounted && videoRef.current) {
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          autoplay: false,
          preload: "auto",
        });
  
        playerRef.current.src({ src: testimonial.video, type: 'application/x-mpegURL' });
  
        return () => {
          if (playerRef.current) {
            playerRef.current.dispose();
          }
        };
      }
    }, [isMounted, testimonial.video]); // Depend on mount status
  
    const isEven = index % 2 === 0;
  
    return (
      <div className={`mansory-card ${isEven ? "row" : "row-reverse"}`}>
        <div className="mansory-text">
          <h2 className="text">{testimonial.text}<br /><br /></h2>
          <h2 className="name">- {testimonial.name}</h2>
        </div>
        <div className="video">
          <video
            ref={videoRef} // Attach the ref to the video element
            className="video-js"
            controls
            preload="none"
            width="400"
            height="300"
            onError={(e) => {
              console.error("Video loading error:", e);
              alert("There was an error loading the video.");
            }}
          >
            <source src={testimonial.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="mansory-container">
      {testimonials.map((each, index) => (
        <RenderMasonryCard testimonial={each} key={each.id} index={index} />
      ))}
    </div>
  );
};

export default EmbedTestimonial;
