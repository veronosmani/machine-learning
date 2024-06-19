import React, { useState, useEffect } from "react";
import Homepage from "./components/Homepage";
import Header from "./components/Header";
import FileDisplay from "./components/FileDisplay";

function App() {
  const [file, setFile] = useState(null)
  const [audioStream, setAudioStream] = useState(null)

  const isAudioAvailable = file || audioStream

  function handleAudioReset () {
    setFile(null)
    setAudioStream(null)
  }

    useEffect(() => {
      console.log(audioStream)
    }, [audioStream])

  return (
    <div className="flex flex-col max-w-[1000px] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <Header />
        {isAudioAvailable ? (
          <FileDisplay handleAudioReset={handleAudioReset} file={file} audioStream={setAudioStream}/>
        ) : (
          <Homepage setFile={setFile} setAudioStream={setAudioStream}/>
        )}
      </section>
      <h1 className="text-green-400"></h1>
      <footer></footer>
    </div>
  );
}

export default App;
