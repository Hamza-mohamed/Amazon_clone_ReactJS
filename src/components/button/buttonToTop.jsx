import React, { useEffect, useState } from "react";
import { IoArrowUpSharp } from "react-icons/io5";
import "./buttonToTop.css";
import { ScrollSpy } from "bootstrap";

export const ButtonToTop = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY =
                window.scrollY || document.documentElement.scrollTop;
            if (scrollY > 500) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
   window.scrollTo({top:0,behavior:'smooth'})
    };
    return (
        <div
            className={`backToTopContainer ${showButton ? "" : "show-button"}`}
        >
            <div className='back-Top py-2' onClick={scrollToTop}>
                <IoArrowUpSharp className='arrow' />
            </div>
        </div>
    );
};
