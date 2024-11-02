"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation"; // For dynamic route params
import { db } from "@/lib/firebase"; // Adjusted path for 'src' alias
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import styles from "./carousel.module.css";
import "./index.css"; // Styles for the carousel and masonry views

const EmbedTestimonial = () => {
  const { layoutType, spaceid } = useParams(); // Extract route params dynamically

  console.log(layoutType);

  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state
  const [videoSource, setVideoSource] = useState(""); // State for video source
  const [currentResolution, setCurrentResolution] = useState("480p"); // State for current resolution

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
      selectVideoSource(fetchedTestimonials[0]); // Set the initial video source
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (spaceid) fetchTestimonials(); // Fetch only if spaceid is available
  }, [spaceid]);

  // Function to select the best video resolution based on network conditions
  const selectVideoSource = (testimonial) => {
    let selectedSource;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const effectiveType = connection ? connection.effectiveType : '4g'; // Default to '4g' if no connection info is available

    if (effectiveType === '2g') {
      selectedSource = testimonial.video["360"];
      setCurrentResolution("360p");
    } else if (effectiveType === '3g') {
      selectedSource = testimonial.video["480"];
      setCurrentResolution("480p");
    } else {
      selectedSource = testimonial.video["720"];
      setCurrentResolution("720p");
    }

    setVideoSource(selectedSource);
    console.log("Selected Video Source:", selectedSource);
  };

  // Auto-bitrating based on network speed
  useEffect(() => {
    const interval = setInterval(() => {
      if (testimonials.length > 0) {
        selectVideoSource(testimonials[currentIndex]); // Use the current testimonial
      }
    }, 5000); // Check every 5 seconds; adjust as needed

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [testimonials, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    selectVideoSource(testimonials[(currentIndex + 1) % testimonials.length]); // Update video source on next
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    selectVideoSource(testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length]); // Update video source on previous
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
      {layoutType === "carousels" ? (
        <div className={styles.carouselContainer}>
          <div className={styles.controls}>
            <button onClick={handlePrev} className={styles.controlButton}>
              <FaArrowLeft />
            </button>
          </div>

          <div className={styles.carouselItem}>
            {testimonials[currentIndex].video && (
              <video 
                key={testimonials[currentIndex].video}
                controls preload="none"
                className={styles.video}
                onPlay={(e) => (e.target.currentTime = 0)}
                src={videoSource}
              >
                <source src={videoSource} type="video/mp4" />
              </video>
            )}
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
      ) : (
        <div className="mansory-container">
          {testimonials.map((each, index) => (
            <RenderMasonryCard testimonial={each} key={each.id} index={index} />
          ))}
        </div>
      )}
    </>
  );
};

export default EmbedTestimonial;
