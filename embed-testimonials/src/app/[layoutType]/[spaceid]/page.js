// This makes the component render only on the client side
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
      console.log(fetchedTestimonials)
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (spaceid) fetchTestimonials(); // Fetch only if spaceid is available
  }, [spaceid]);

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

  // const RenderMasonryCard = ({ testimonial, index }) => {
  //   const isEven = index % 2 === 0;

  //   return (
  //     <div className="mansory-card">
  //     <div className={`${isEven ? "row" : "row-reverse"}`}>
  //       <div className="masonry-card-text">
  //         <h4>{testimonial.text}</h4>
  //       </div>
  //       {/* <iframe
  //         className="masonry-card-video"
  //         src={testimonial.video}
  //         title="YouTube video player"
  //         frameBorder="0"
  //         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  //         allowFullScreen
  //       ></iframe> */}
  //       <video width="320" height="240" controls preload="none" className="masonry-card-video">
  //               <source src={testimonial.video} type="video/mp4" />
  //       </video>
  //     </div>
  //     </div>
  //   );
  // };

  const RenderMasonryCard = ({ testimonial, index }) => {
    const isEven = index % 2 === 0;

    return (
      <div className={`mansory-card ${isEven ? "row" : "row-reverse"}`}>
          <div className="mansory-text">
                <h2 className="text">{testimonial.text}
                <br/><br/>
                </h2>
                <h2 className="name">
                  - {testimonial.name}
                </h2>
          </div>

          <div className="video">
          <video width="400" height="300" controls preload="none" className="masonry-card-video">
               <source src={testimonial.video} type="video/mp4" />
          </video>
          </div>
      </div>
    );
  }

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
                >
                <source src={testimonials[currentIndex].video} type="video/mp4" />
                
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
