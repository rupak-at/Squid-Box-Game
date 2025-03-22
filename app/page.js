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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isOver, setIsOver] = useState(false); //to track does user won?
  const [out, setOut] = useState(false); // to know if user move the box when the doll is in front
  const [time, setTime] = useState(0);
  const [currentImage, setCurrentImage] = useState("/back.jpg"); //default image
  let initialMousePosition = useRef(null); // to have mouse in certain position to get started
  const [isPlaying, setIsPlaying] = useState(false);

  //generate random delay of the images
  const timeDelay = () => {
    const delay = Math.floor(Math.random() * 3 + 1) * 1000;
    return delay;
  };

  useEffect(() => {
    if (isOver || out) return; //check if game is finished or rules are vilated
    if (!isPlaying) return; // check for game start ai first false here gets true due to ! and return and when isPaying true it gets false and do not executes
    //changes the images in random delay
    const imagePicker = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage((prev) =>
          prev === "/back.jpg" ? "/front.jpg" : "/back.jpg"
        );
        setIsTransitioning(false);
      }, 0);
    }, timeDelay());

    //tracking the time of the game play
    const timer = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);

    const handleMouseMove = (e) => {
      //at first if initialMousePosition is empty if exectues
      if (!initialMousePosition.current) {
        if (e.clientX < 8 && e.clientY < 90) {
          // this is important to have the mouse in correct position to start that game
          initialMousePosition.current = 27;
        } //this will set the game after the mouse is in correct position
      }
      //gets executes only when the mouse is in correct position else nothing will happen
      if (initialMousePosition.current) {
        //tracking mouse position to check if won
        if (e.clientX > 700) {
          setIsOver(true);
          clearInterval(timer);
          clearInterval(imagePicker);
          return;
        }

        //tracking if user moves mouse when the image is in front side if does ending the game
        if (currentImage === "/front.jpg") {
          if (e.clientX || e.clientY) {
            setOut(true);
            clearInterval(timer);
            clearInterval(imagePicker);
            return;
          }
        }

        //checking the mouse position to know the if usesr has won the game
        if (e.clientX === 700) {
          console.log("winnner");
          setIsOver(true);
          clearInterval(timer);
          clearInterval(imagePicker);
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
      clearInterval(imagePicker);
    };
  }, [isOver, currentImage, out, dispatch, isPlaying]);

  //making it back it default state
  const handleReset = () => {
    setOut(false);
    setTime(0);
    setCurrentImage("/back.jpg");
    setIsOver(false);
    initialMousePosition.current = null;
    dispatch(resetGame());
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 to-slate-800">
      {!isPlaying ? (
        <div className="h-screen flex flex-col justify-center items-center space-y-8">
          <div className="text-6xl font-bold text-white mb-4 animate-pulse">
            Squid Game
          </div>
          <div className="text-slate-300 text-xl max-w-md text-center mb-8">
            Move the shape to the finish line when the doll is turned around.
            Don't move when she's watching!
          </div>
          <button
            onClick={() => setIsPlaying(true)}
            className="group relative px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-2xl font-mono rounded-xl "
          >
            <div className="absolute -inset-1 bg-red-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-all duration-200"></div>
            <span className="relative">PLAY</span>
          </button>
        </div>
      ) : (
        <div className="min-h-screen w-full bg-gradient-to-b from-slate-800 to-slate-600 relative flex justify-center items-center overflow-hidden">
          <div
            onClick={changeShape}
            className="shadow-lg hover:shadow-xl cursor-pointer"
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
          <div className="w-2 h-full bg-zinc-800 absolute left-[800px] top-0 shadow-md" />
          <div className="absolute left-[900px] top-5 perspective-1000">
            <div
              className={`transform transition-transform duration-300 ease-in-out ${
                isTransitioning
                  ? "scale-95 opacity-80"
                  : "scale-100 opacity-100"
              }`}
            >
              <img
                src={currentImage}
                alt="Squid Game Doll"
                className="rounded-lg border-4 border-zinc-700 shadow-2xl h-[300px] w-[200px]"
              />
            </div>
          </div>
        </div>
      )}

      {(isOver || out) && (
        <div className="fixed inset-0 flex flex-col justify-center items-center backdrop-blur-lg bg-zinc-900/90 transition-all duration-500 ease-in-out">
          <div className="text-zinc-100 text-9xl font-mono mb-8 ">
            {isOver ? (
              <span className="text-green-500">Won!!</span>
            ) : (
              <span className="text-red-500">Out</span>
            )}
          </div>
          <div className="text-zinc-200 text-4xl font-mono mb-12">
            Time: <span className="text-yellow-400">{time}s</span>
          </div>
          <button
            onClick={handleReset}
            className="group relative px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-2xl font-mono rounded-xl "
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default SquidGame;
