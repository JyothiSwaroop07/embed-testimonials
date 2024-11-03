"use client";
import { useState, useEffect, useRef } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation"; // For dynamic route params
import { db } from "@/lib/firebase";
import videojs from "video.js"; // Import video.js
import "video.js/dist/video-js.css"; // Import video.js styles

const EmbedSingletestimonial = () => {
    const { testimonialid } = useParams();
    const [testimonial, setTestimonial] = useState(null);
    const playerRef = useRef(null); // Use useRef for video.js player reference
    const videoNode = useRef(null); // Create a reference for the video DOM element

    useEffect(() => {
        const fetchTestimonial = async () => {
            if (testimonialid) {
                try {
                    const testimonialDoc = doc(collection(db, "testimonials"), testimonialid);
                    const docSnap = await getDoc(testimonialDoc);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log(data);
                        setTestimonial(data);
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

    // Initialize the video.js player after the component mounts
    useEffect(() => {
        if (videoNode.current) {
            // Initialize Video.js
            playerRef.current = videojs(videoNode.current, {
                controls: true,
                autoplay: false,
                preload: "auto",
                sources: [{
                    // src: testimonial ? testimonial.video["720"] + "/index.m3u8" : "",
                    src: `${testimonial.video}`, // Adjust the source based on fetched testimonial
                    type: "application/x-mpegURL",
                }]
            });
        }

        // Cleanup function to dispose of the player
        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
            }
        };
    }, [testimonial]);

    if (!testimonial) return <div className="w-[100vw] flex justify-center">Loading...</div>;

    return (
        <div className="w-[80vw] flex flex-col items-center pt-5">
            <div className="mansory-card mx-auto">
                <div className="video mb-5">
                    <video
                        ref={videoNode} // Attach ref to video element
                        className="video-js vjs-default-skin"
                        width="1000"
                        height="800"
                        controls
                    >
                        <source
                            src="https://s3.us-east-1.amazonaws.com/production.testimonialhub/yjyd3gDXVdKqqOe98DIN/dhaa.mp4/master.m3u8" // Update the source URL
                            type="application/x-mpegURL" />
                        Your browser does not support the video tag.
                    </video>
                </div>

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
