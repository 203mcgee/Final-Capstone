import { useEffect, useState } from "react";
import React from 'react';
import '../../src/index.css';
import PText from "./PText";
import Button from "./Button";
import prof_photo from "../assets/images/prof_profile.jpeg";
// max-w-4xl mx-auto dark:border-gray-700
function Hero() {
  return (
    <section className=" relative py-12 px-4 ">
      {/* 
        flex-col: Stacks image and text vertically on mobile 
        md:flex-row: Places image and text side-by-side on tablet/desktop 
      */}
      <div className="flex flex-col md:flex-row md:items-stretch justify-center gap-6 md:gap-8  min-h-[50vh] h-full">
        
        {/* Left: Profile Picture */}
        <div className="shrink-0 flex-1 flex  w-full  h-inherit">
          <img
            className="w-full h-inherit block flex-1  object-cover border-4 border-white  rounded-2xl shadow-lg"
            src={prof_photo} /* Uses your imported image variable */
            alt="Profile picture of Zoe McGee"
          />
        </div>

        {/* Right: Intro Text & CTA */}
        <div className="flex flex-col items-center justify-center  md:text-left z-10 flex-1 pt-5">
          <h1 className="flex flex-row gap-4 text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            <span className="hero-intro opacity-0 animate-fade-in">Hi, I'm </span>
            <span id="highlightName" className="hero-intro text-blue-600 dark:text-blue-400 opacity-0 animate-fade-in-delay-1">Zoe </span>
            <span className="hero-intro text-gradient opacity-0 animate-fade-in-delay-2">McGee</span>
          </h1>

          <div className="opacity-0 animate-fade-in-delay-3 space-y-4  items-center pt-2">
            <PText>
              I am a junior web developer passionate about building clean, responsive, and user-friendly websites.
            </PText>
            
            <div >
              <Button  btnLink="/projects" btnText="Projects" outline={false} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;