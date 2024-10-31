"use client";
import { useState, useEffect } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation"; // For dynamic route params
import { db } from "@/lib/firebase";

// import '../../[layoutType]/[spaceid]/index.css';

const EmbedSingletestimonial = () => {
    const { testimonialid } = useParams();
    const [testimonial, setTestimonial] = useState(null);

    useEffect(() => {
        const fetchTestimonial = async () => {
            if (testimonialid) {
                try {
                    const testimonialDoc = doc(collection(db, "testimonials"), testimonialid);
                    const docSnap = await getDoc(testimonialDoc);

                    if (docSnap.exists()) {
                        setTestimonial(docSnap.data());
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

    if (!testimonial) return <div className="w-[100vw] flex justify-center">Loading...</div>;

    return (
        <div className="w-[80vw] flex justify-center pt-5">
        <div className="mansory-card mx-auto ">

        <div className="video mb-5">
            <video width="400" height="300" controls preload="none" className="masonry-card-video">
               <source src={testimonial.video} type="video/mp4" />
            </video>
          </div>

          <div className="mansory-text mt-4 text-italic flex flex-col p-2">
                <h2 className="text italic font-normal text-gray-800">
                    {testimonial.text}
                    <br/><br/>
                </h2>
                <h2 className="name ml-auto">
                  - {testimonial.name}
                </h2>
          </div>

          
      </div>
      </div>
    );
}

export default EmbedSingletestimonial;
