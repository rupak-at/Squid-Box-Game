"use client";
import {
  changePosition,
  changeShape,
  incrementHeight,
  incrementLength,
  resetGame,
} from "@/lib/squid/squidSlice";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SquidGame = () => {
  const { width, height, backGroundColor, borderRadius, top, left } =
    useSelector((state) => state.game);
  const dispatch = useDispatch();
  const [isOver, setIsOver] = useState(false); //to track does user won?
  const [out, setOut] = useState(false) // to know if user move the box when the doll is in front
  const [time, setTime] = useState(0);
  const [currentImage, setCurrentImage] = useState('/back.jpg') //default image
  let initialMousePosition = useRef(null) // to have mouse in certain position to get started

  //generate random delay of the images
  const timeDelay = ()=>{
    const delay = Math.floor((Math.random()*(3))+1)*1000
    return delay
  }

  useEffect(() => {
    if (isOver || out) return; //check if game is finished or rules are vilated

    //changes the images in random delay
    const imagePicker = setInterval(() => {
      setCurrentImage((prev) => prev === '/back.jpg' ? '/front.jpg' : '/back.jpg')
    }, 3000);

    //tracking the time of the game play
    const timer = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);

    const handleMouseMove = (e) => {
      //at first if initialMousePosition is empty if exectues
      if (!initialMousePosition.current){
        if (e.clientX === 27){ // this is important to have the mouse in correct position to start that game
          initialMousePosition.current = 27
        }//this will set the game after the mouse is in correct position
      }
      //gets executes only when the mouse is in correct position else nothing will happen
      if (initialMousePosition.current){
        //tracking mouse position to check if won
        if (e.clientX > 700){
          setIsOver(true);
          clearInterval(timer);
          clearInterval(imagePicker)
          return
        }
        
        //tracking if user moves mouse when the image is in front side if does ending the game
        if(currentImage === '/front.jpg'){
          if(e.clientX || e.clientY){
            setOut(true)
            clearInterval(timer);
            clearInterval(imagePicker)
            return
          }
        }
  
        //checking the mouse position to know the if usesr has won the game
        if (e.clientX === 700) {
          console.log("winnner");
          setIsOver(true);
          clearInterval(timer);
          clearInterval(imagePicker)
          return;
        }
        // after above condition is not matched then we dispatch mouse position to redux
        if (!isOver && !out) {
          const mousePositioin = {
            X: e.clientX,
            Y: e.clientY,
          };
          dispatch(changePosition(mousePositioin));
        }
      }
      
    };
    // if game is not over we add event listener else it will not be added
    if (!isOver || !out) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(timer);
      clearInterval(imagePicker)
    };
  }, [isOver, currentImage, out, dispatch]);
  //making it back it default state
  const handleReset = ()=>{
    setOut(false)
    setTime(0)
    setCurrentImage('/back.jpg')
    setIsOver(false)
    initialMousePosition.current = null
    dispatch(resetGame())
  }

  return (
    <>
    <div className="bg-slate-400 relative h-screen w-screen flex justify-center">
      <div
        onClick={() => dispatch(changeShape())}
        style={{
          width,
          height,
          backgroundColor: backGroundColor,
          borderRadius,
          position: "absolute",
          top,
          left,
        }}
      />
      <div className="w-2 h-full bg-zinc-800 absolute left-[800px] top-4" />
      <div className="absolute left-[900px] top-5">
        <Image 
          src={currentImage}
          height={300} 
          width={200} 
          alt="img" 
          className="shadow-md rounded border-2 border-zinc-700"
        />
      </div>
    </div>

    {(isOver || out) && (
      <div className="flex flex-col justify-center items-center h-screen w-screen fixed top-0 left-0 backdrop-blur bg-zinc-900/95">
        <div className="text-zinc-100 text-9xl font-mono mb-8">
          {isOver ? <span>Won!! </span> : <span>Out</span>}
        </div>
        <div className="text-zinc-200 text-4xl font-mono mb-12">
          Time: {time}s
        </div>
        <button onClick={()=> handleReset()} className="p-2 bg-green-600 rounded-xl text-white text-xl font-mono">Play Again</button>
      </div>
    )}
  </>
  );
};

export default SquidGame;
