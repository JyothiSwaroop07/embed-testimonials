"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from 'firebase/firestore';
import styles from './carousel.module.css';
import { db } from '../../../lib/firebase';
import { use } from 'react'; // Import React's use()

const EmbedTestimonial = ({ params: paramsPromise }) => {
    const params = use(paramsPromise); // Unwrap params promise
    const { layoutType, spaceid } = params; 
    console.log(layoutType);

    const [testimonials, setTestimonials] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); 
    const [loading, setLoading] = useState(true);

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
            console.log(fetchedTestimonials);
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

    if (loading) 
        return <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-gray-900"></div>
        </div>;

    if (testimonials.length === 0) 
        return <p>No testimonials found.</p>;

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

    return (
        <>
            {layoutType === 'carousels' ? (
                <div className={styles.carouselContainer}>
                    <div className={styles.carouselItem}>
                        {testimonials[currentIndex].video && (
                            <iframe
                                className={styles.video}
                                src={getYouTubeEmbedUrl(testimonials[currentIndex].video)}
                                title="YouTube video player"
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
                        <button onClick={handlePrev} className={styles.controlButton}>
                            Previous
                        </button>
                        <button onClick={handleNext} className={styles.controlButton}>
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Masonry fixed testimonials</h1>
                </div>
            )}
        </>
    );
};

export default EmbedTestimonial;
