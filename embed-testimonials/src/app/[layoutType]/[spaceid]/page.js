"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from 'firebase/firestore';
import styles from './carousel.module.css';
import { db } from '../../../lib/firebase';
import { use } from 'react';

import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

import './index.css'

const EmbedTestimonial = ({ params: paramsPromise }) => {
  const params = use(paramsPromise); // Unwrap params Promise
  const { layoutType, spaceid } = params;
  
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from Firebase
  const fetchTestimonials = async () => {
    try {
      const testimonialsRef = collection(db, 'testimonials');
      const q = query(
        testimonialsRef,
        where('spaceId', '==', spaceid),
        where('isLiked', '==', true)
      );

      const querySnapshot = await getDocs(q);
      const fetchedTestimonials = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestimonials(fetchedTestimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (spaceid) fetchTestimonials();
  }, [spaceid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-gray-900"></div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return <p>No testimonials found.</p>;
  }

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

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  console.log(testimonials)

  const RenderMansoryFixedView = ({ testimonial, index }) => {
    const isEven = index % 2 === 0;
    
    return (
      <div className={`mansory-card ${isEven ? 'row' : 'row-reverse'}`}>
        <div className="mansory-card-text">
          <h4>{testimonial.text}</h4>
        </div>
        <iframe
          className="mansory-card-video"
          src={getYouTubeEmbedUrl(testimonial.video)}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };
  

  return (
    <>
      {layoutType === 'carousels' ? (
        <div className={styles.carouselContainer}>
          <div className={styles.controls}>
            <button onClick={handlePrev} className={styles.controlButton}>
            <FaArrowLeft />
            </button>
            
          </div>
          
          <div className={styles.carouselItem}>
            {testimonials[currentIndex].video && (
              <iframe
                className={styles.video}
                src={getYouTubeEmbedUrl(testimonials[currentIndex].video)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
            {testimonials[currentIndex].text && (
              <div className={styles.textTestimonial}>
                <p>{testimonials[currentIndex].text}</p>
                <p style={{ textAlign: 'right' }}>
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
            <RenderMansoryFixedView testimonial={each} key={each.id} index={index} />
        ))}
  </div>
      )}
    </>
  );
};

export default EmbedTestimonial;
