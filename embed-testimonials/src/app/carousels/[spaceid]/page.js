"use client";

import { useState, useEffect, useRef } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation"; // For dynamic route params
import { db } from "@/lib/firebase"; // Adjusted path for 'src' alias
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import videojs from "video.js";
import "video.js/dist/video-js.css"; // Import video.js styles
import styles from "./carousel.module.css";
import "./index.css"; // Styles for the carousel and masonry views

const Carousels = () => {
  const { spaceid } = useParams(); // Extract route params dynamically

  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state
  const videoRef = useRef(null); // Ref for video element

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

  // Initialize video.js player
  useEffect(() => {
    if (videoRef.current && testimonials.length > 0) {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: "auto",
      });

      player.src({ src: testimonials[currentIndex].video, type: 'application/x-mpegURL' });

      // Clean up player on component unmount
      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, [testimonials, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
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
    <>
    
        <div className={styles.carouselContainer}>
          <div className={styles.controls}>
            <button onClick={handlePrev} className={styles.controlButton}>
              <FaArrowLeft />
            </button>
          </div>

          <div className={styles.carouselItem}>
            <video
              ref={videoRef}
              className="video-js vjs-default-skin"
              controls
              preload="none"
              width="400"
              height="300"

            />
            {testimonials[currentIndex].text && (
              <div className={styles.textTestimonial}>
                <p>{testimonials[currentIndex].text}</p>
                <p style={{ textAlign: "right" }}>
                  — {testimonials[currentIndex].name}
                </p>
              </div>
            )}
          </div>

          <div className={styles.controls}>
            <button onClick={handleNext} className={styles.controlButton}>
              <FaArrowRight />
            </button>
          </div>
        </div>
      
    </>
  );
};

export default Carousels;
