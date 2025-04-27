"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  coverUrl?: string | null;
  audioUrl?: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

interface Question {
  id: string;
  categoryId: string;
  question: string;
  options: string[];
  answer: string;
  songId: string;
  songs: Song;
}

interface GameClientProps {
  questions: Question[];
  category: Category;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function GameClient({ questions, category }: GameClientProps) {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string, selectedAnswer: string, isCorrect: boolean }[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    const shuffledQs = shuffleArray(
      questions.map(q => ({
        ...q,
        options: shuffleArray(q.options) // also shuffle each question's options
      }))
    );
    setShuffledQuestions(shuffledQs);
  }, [questions]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);

    const isCorrect = option === currentQuestion.answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selectedAnswer: option,
      isCorrect: isCorrect,
    }]);

    setTimeout(() => {
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setGameComplete(true);
      }
    }, 1000);
  };

  useEffect(() => {
    if (gameComplete) {
      saveGameResults();
    }
  }, [gameComplete]); // only when game is complete

  const saveGameResults = async () => {
    try {
      const finalScore = Math.round((answers.filter(a => a.isCorrect).length / shuffledQuestions.length) * 100);
  
      const response = await fetch("/api/save-round", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: category.id,
          score: finalScore,
          answers: answers,
        }),
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          console.info("User not logged in. Skipping save game."); 
        } else {
          console.error(`Server returned error for saving game: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error("Network or unexpected error for saving game:", error);
    }
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // If no questions
  if (!shuffledQuestions || shuffledQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#faf8f6]">
        <div className="w-full max-w-3xl bg-gray-100 rounded-2xl p-10 shadow-md text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">No Questions Available</h2>
          <p className="mb-6 text-xl text-gray-700">There are no questions available for this category.</p>
          <Link href="/" className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg font-medium">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] py-10 bg-[#faf8f6]">
      {/* Game Container */}
      <div className="w-[95%] max-w-3xl bg-[#e8e4e0] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-10">
          {!gameComplete ? (
            <>
              {/* Progress and bookmark */}
              <div className="flex justify-between items-center mb-8">
                <div className="text-lg font-medium text-gray-700">
                  {currentQuestionIndex + 1}/{shuffledQuestions.length}
                </div>
                <button onClick={toggleBookmark} className="focus:outline-none" aria-label="Bookmark">
                  {isBookmarked ? (
                    <svg className="w-7 h-7 fill-current text-gray-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  ) : (
                    <svg className="w-7 h-7 stroke-current text-gray-800" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  )}
                </button>
              </div>

              {/* Question */}
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`text-center py-5 px-6 rounded-full border-2 transition-all duration-200 text-lg font-medium
                      ${selectedOption === option
                        ? option === currentQuestion.answer
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : 'bg-red-100 border-red-500 text-red-800'
                        : 'bg-white border-gray-300 hover:border-gray-400 text-gray-800 hover:bg-gray-50'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Game Complete!</h2>
              <p className="text-2xl mb-8 text-gray-700">Your Score: <span className="font-bold">{Math.round((score / shuffledQuestions.length) * 100)}</span></p>
              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                <Link href="/" className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-lg font-medium">
                  Return Home
                </Link>
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    setSelectedOption(null);
                    setGameComplete(false);
                    setAnswers([]);
                  }}
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg font-medium"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}