"use client";
import { useState, useEffect } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation"; // For dynamic route params
import { db } from "@/lib/firebase";

const EmbedSingletestimonial = () => {
    const { testimonialid } = useParams();
    const [testimonial, setTestimonial] = useState(null);
    const [videoSource, setVideoSource] = useState(""); // State for video source
    const [currentResolution, setCurrentResolution] = useState("480p"); // State for current resolution

    useEffect(() => {
        const fetchTestimonial = async () => {
            if (testimonialid) {
                try {
                    const testimonialDoc = doc(collection(db, "testimonials"), testimonialid);
                    const docSnap = await getDoc(testimonialDoc);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setTestimonial(data);
                        // Set the initial video source based on network conditions
                        selectVideoSource(data.video); // Pass the video URLs from the fetched testimonial
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching testimonial:", error);
                }
            }
        };

        fetchTestimonial();
    }, [testimonialid]);

    // Function to select the best video resolution based on network conditions
    const selectVideoSource = (video) => {
        console.log(testimonial)
        let selectedSource;
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const effectiveType = connection ? connection.effectiveType : '4g'; // Default to '4g' if no connection info is available
        
        if (effectiveType === '2g') {
            selectedSource = video["360"];
            setCurrentResolution("360p");
            
            
        } else if (effectiveType === '3g') {
            selectedSource = video["480"];
            setCurrentResolution("480p");
            
        } else {
            selectedSource = video["720"];
            setCurrentResolution("720p");
           
        }

        setVideoSource(selectedSource);
        console.log("Selected Video Source:", selectedSource);
    };

    // Auto-bitrating based on network speed
    useEffect(() => {
        const interval = setInterval(() => {
            if (testimonial) {
                selectVideoSource(testimonial.video); // Use the video URLs from the fetched testimonial
            }
        }, 5000); // Check every 5 seconds; adjust as needed

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [testimonial]);

    if (!testimonial) return <div className="w-[100vw] flex justify-center">Loading...</div>;

    return (
        <div className="w-[80vw] flex flex-col items-center pt-5">
            <div className="mansory-card mx-auto">
                <div className="video mb-5">
                    <video width="400" height="300" controls preload="none" className="masonry-card-video">
                        <source src={videoSource} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Display the current resolution */}
                {/* <div className="current-resolution text-center mb-4">
                    <p>Current Resolution: {currentResolution}</p>
                </div> */}

                <div className="mansory-text mt-4 text-italic flex flex-col p-2">
                    <h2 className="text italic font-normal text-gray-800">
                        {testimonial.text}
                        <br /><br />
                    </h2>
                    <h2 className="name ml-auto">
                        - {testimonial.name}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default EmbedSingletestimonial;
