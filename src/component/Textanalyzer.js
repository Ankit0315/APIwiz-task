import React, { useState, useEffect } from "react";
import "./style.css";

const Textanalyzer = () => {
  const [inputText, setInputText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [inputType, setInputType] = useState("");
  const [wordData, setWordData] = useState({ chr: 0, word: 0 });
  const [wordDetails, setWordDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [paragraphData, setParagraphData] = useState({
    chr: 0,
    word: 0,
    sentence: 0,
    paragraph: 0,
    spaces: 0,
    punctuation: 0,
  });

  const handleWordInput = () => {
    setIsActive(true);
    setInputType("word");
    setParagraphData({
      chr: 0,
      word: 0,
      sentence: 0,
      paragraph: 0,
      spaces: 0,
      punctuation: 0,
    });
    setWordDetails(null);
  };

  const handleParagraphInput = () => {
    setIsActive(true);
    setInputType("paragraph");
    setWordData({ chr: 0, word: 0 });
    setWordDetails(null);
  };

  const updateWordCounts = () => {
    const chrs = inputText.replace(/\s/g, "").length;
    const wrd = inputText.split(/\s+/).filter(Boolean).length;
    setWordData({ chr: chrs, word: wrd });
  };

  const updateParagraphCounts = () => {
    const chrs = inputText.length;
    const wrd = inputText.split(/\s+/).filter(Boolean).length;
    const countSentences = inputText.split(/[.?!]/g).filter(Boolean).length;
    const prg = inputText.split("\n").filter((p) => p.trim().length > 0).length;
    const spc = inputText.split(" ").length - 1;

    const punc = (inputText) => {
      const punctRegex = /[!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g;
      const matches = inputText.match(punctRegex);
      return matches ? matches.length : 0;
    };

    setParagraphData({
      chr: chrs,
      word: wrd,
      sentence: countSentences,
      paragraph: prg,
      spaces: spc,
      punctuation: punc(inputText),
    });
  };

  const handleProcessWord = () => {
    updateWordCounts();
    fetchWordDetails();
    setShowDetails(true);
  };

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);

    if (isActive && inputType === "paragraph") {
      updateParagraphCounts();
    }

    if (newText.trim() === "") {
      setWordData({ chr: 0, word: 0 });
      setParagraphData({
        chr: 0,
        word: 0,
        sentence: 0,
        paragraph: 0,
        spaces: 0,
        punctuation: 0,
      });
      
    }


    setShowDetails(false);
  };

  const fetchWordDetails = async () => {
    const url = `https://wordsapiv1.p.rapidapi.com/words/${inputText}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "1ac6e689f4msh63d8f37f909f30fp1212ecjsnb7ab03d52e28",
        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setWordDetails(data);

      if (Array.isArray(data.results) && data.results.length > 0) {
        const firstMeaning = data.results[0];

        setWordDetails({
          definition: firstMeaning?.definition || "No definition available",
          partOfSpeech:firstMeaning.partOfSpeech || "No part of speech available",
          Synonyms:(firstMeaning.synonyms || []).join(", ") ||  "No synonyms available in the response",         
            Antonyms: (firstMeaning.antonyms || []).join(", ") ||"No antonyms available in the response",});
      } 
      else {
        console.error("No meanings found in the response");
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <div className="cont">
      <div className="main-container">
        <h1>Text Analyzer</h1>
        <div>
          Text Analyzer is a simple free online tool for SEO web content
          analysis that helps you find most frequent phrases and words, number
          of characters, words, sentences and paragraphs, and estimated read and
          speak time of your content.
        </div>
        <br />
        <div className="buton-modes">
          <button
            className={`button ${
              inputType === "word" && isActive ? "active-button" : ""
            }`}
            onClick={handleWordInput}
          >
            Word input
          </button>
          <button
            className={`button ${
              inputType === "paragraph" && isActive ? "active-button" : ""
            }`}
            onClick={handleParagraphInput}
          >
            Paragraph
          </button>
        </div>
        <br />
        {isActive && (
          <div>
            {inputType === "paragraph" ? (
              <div className="mains-container">
                <div className="process-word">
                  <textarea
                    rows={15}
                    cols={180}
                    placeholder="Type, or copy/paste your content here."
                    onChange={handleInputChange}
                  />
                </div>

                <br />
                <div className="table">
                  <table>
                    <thead>
                      <tr>
                        <th align="left"> characters</th>
                        <th align="left">Words</th>
                        <th align="left">Sentences</th>
                        <th align="left">Paragraphs</th>
                        <th align="left">Spaces</th>
                        <th align="left">Punctuation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{paragraphData.chr}</td>
                        <td>{paragraphData.word}</td>
                        <td>{paragraphData.sentence}</td>
                        <td>{paragraphData.paragraph}</td>
                        <td>{paragraphData.spaces}</td>
                        <td>{paragraphData.punctuation}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="input-word">
                <input
                  type="text"
                  placeholder="Type a Note..."
                  onChange={handleInputChange}
                />
                &nbsp; &nbsp; &nbsp;
                <button className="button" onClick={handleProcessWord}>
                  Process word
                </button>
                <br />
                <br />
                <div className="table1">
                  <table>
                    <thead>
                      <tr>
                        <th align="left">Characters</th>
                        <th align="left">Words</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{wordData.chr}</td>
                        <td>{wordData.word}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <br />
                <div
                  className={`below-table ${
                    wordDetails && showDetails ? "visible" : "hidden"
                  }`}
                >
                  {wordDetails ? (
                    <>
                      <p>Definition: {wordDetails.definition}</p>
                      <p>Parts of speech: {wordDetails.partOfSpeech}</p>
                      <p>Synonyms: {wordDetails.Synonyms}</p>
                      <p>Antonyms: {wordDetails.Antonyms}</p>
                    </>
                  ) : (
                    <>
                      <p>Definition:</p>
                      <p>Parts of speech:</p>
                      <p>Synonyms:</p>
                      <p>Antonyms: </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Textanalyzer;
