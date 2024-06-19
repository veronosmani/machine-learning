import React, { useState } from "react";
import Transcription from "./Transcription";
import Translation from "./Translation";

export default function Information() {
  const [tab, setTab] = useState("transcription");
  return (
    <main className="flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 md:gap-5 justify-center pb-20 sm:w-96 w-72 max-w-prose w-full mx-auto">
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap">
        Your <span className="text-blue-300 bold">Transcription</span>
      </h1>

      <div className="grid grid-cols-2 mx-auto bg-white shadow rounded-full overflow-hidden items-center ">
        <button
          onClick={() => {
            setTab("transcription");
          }}
          className={
            "px-4 duration-200 py-1" +
            (tab === "transcription"
              ? " bg-blue-300 text-white"
              : " text-blue-400 hover:text-blue-600")
          }
        >
          Transcription
        </button>
        <button
          onClick={() => {
            setTab("translation");
          }}
          className={
            "px-4 duration-200 py-1" +
            (tab === "translation"
              ? " bg-blue-300 text-white"
              : " text-blue-400 hover:text-blue-600")
          }
        >
          Translation
        </button>
      </div>

          {tab === 'transcription' ? (
            <Transcription />
          ) : (
            <Translation />
          ) 
        }

    </main>
  );
}
