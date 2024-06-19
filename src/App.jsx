import React, { useState, useEffect, useRef } from "react";
import Homepage from "./components/Homepage";
import Header from "./components/Header";
import FileDisplay from "./components/FileDisplay";
import Information from "./components/Information";
import Transcribing from "./components/Transcribing";
import { MessageTypes } from "./utils/presets";

function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const isAudioAvailable = file || audioStream;

  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
  }

  const worker = useRef(null);

  // Highlighted change: Initializing worker and setting up event listener
  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("./utils/whisper.worker.js", import.meta.url, {
          type: "module",
        })
      );

      const onMessageReceived = async (e) => {
        switch (e.data.type) {
          case "DOWNLOADING":
            setDownloading(true);
            console.log("DOWNLOADING");
            break;
          case "LOADING":
            setLoading(true);
            console.log("LOADING");
            break;
          case "RESULT":
            setOutput(e.data.results);
            break;
          case "INTERFERENCE":
            setFinished(true);
            console.log("DONE");
            break;
          default:
            break;
        }
      };

      worker.current.addEventListener("message", onMessageReceived);

      // Highlighted change: Ensuring the event listener is cleaned up
      return () => {
        if (worker.current) {
          worker.current.removeEventListener("message", onMessageReceived);
        }
      };
    }
  }, []); // Highlighted change: Ensuring the effect runs only once

  useEffect(() => {
    console.log(audioStream);
  }, [audioStream]);

  async function readAudioFrom(file) {
    try {
      const sampling_rate = 16000;
      const audioCTX = new AudioContext({ sampleRate: sampling_rate });
      const response = await file.arrayBuffer();
      const decoded = await audioCTX.decodeAudioData(response);
      const audio = decoded.getChannelData(0);
      return audio;
    } catch (error) {
      console.error("Error reading audio file:", error);
      return null;
    }
  }

  async function handleFormSubmission() {
    if (!file && !audioStream) {
      return;
    }

    let audio = await readAudioFrom(file ? file : audioStream);
    if (!audio) {
      return;
    }

    const model_name = "openai/whisper-tiny.en";

    // Highlighted change: Checking if worker exists before posting message
    if (worker.current) {
      worker.current.postMessage({
        type: MessageTypes.INFERENCE_REQUEST,
        audio,
        model_name,
      });
    }
  }

  return (
    <div className="flex flex-col max-w-[1000px] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <Header />
        {output ? (
          <Information />
        ) : loading ? (
          <Transcribing />
        ) : isAudioAvailable ? (
          <FileDisplay
            handleAudioReset={handleAudioReset}
            file={file}
            audioStream={audioStream} // Highlighted change: Using audioStream here
          />
        ) : (
          <Homepage setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <h1 className="text-green-400"></h1>
      <footer></footer>
    </div>
  );
}

export default App;
