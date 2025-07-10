"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function TriviaQuiz() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizFinished, setQuizFinished] = useState(false)
  const [score, setScore] = useState(0)

//fetchind data and mapping through results
  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://opentdb.com/api.php?amount=10")
      const data = await response.json()

      if (data.response_code === 0) {
        const formattedQuestions = data.results.map((q) => ({
          ...q,
          question: decodeHtml(q.question),
          correct_answer: decodeHtml(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map(decodeHtml),
          answers: shuffleArray([
            decodeHtml(q.correct_answer),
            ...q.incorrect_answers.map(decodeHtml),
          ]),
          selectedAnswer: null,
          isCorrect: null,
        }))
        setQuestions(formattedQuestions)
      } else {
        setError("Failed to fetch questions")
      }
    } catch (err) {
      setError("Error fetching questions")
    } finally {
      setLoading(false)
    }
  }

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea")
    txt.innerHTML = html
    return txt.value
  }
 //generating 
 
 //shuffling
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const handleAnswerSelect = (questionIndex, answer) => {
    if (quizFinished) return

    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].selectedAnswer = answer
    updatedQuestions[questionIndex].isCorrect =
      answer === updatedQuestions[questionIndex].correct_answer
    setQuestions(updatedQuestions)
  }

  const handleFinish = () => {
    const finalScore = questions.reduce(
      (acc, q) => acc + (q.isCorrect ? 1 : 0),
      0
    )
    setScore(finalScore)
    setQuizFinished(true)
  }

  const resetQuiz = () => {
    setQuizFinished(false)
    setScore(0)
    fetchQuestions()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading questions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <Button onClick={fetchQuestions}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {quizFinished && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-700 mb-4">
              Your Score is {score}/{questions.length}!
            </h1>
            <Button onClick={resetQuiz} className="mb-8">
              Take Quiz Again
            </Button>
          </div>
        )}

        {!quizFinished && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-700">Trivia Quiz</h1>
            <p className="text-gray-600 mt-2">
              Answer all questions and click Finish to see your score
            </p>
          </div>
        )}

        <div className="space-y-8">
          {questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Question {questionIndex + 1}:
              </h2>
              <p className="text-lg text-gray-600 mb-6">{question.question}</p>

              <div className="space-y-3">
                {question.answers.map((answer, answerIndex) => {
                  const isSelected = question.selectedAnswer === answer
                  const isCorrect =
                    quizFinished && answer === question.correct_answer
                  const isWrong =
                    quizFinished &&
                    isSelected &&
                    answer !== question.correct_answer

                  let borderColor = "border-gray-200"
                  let bgColor = "bg-white hover:bg-gray-50"

                  if (quizFinished) {
                    if (isCorrect) {
                      borderColor = "border-green-400"
                      bgColor = "bg-green-50"
                    } else if (isWrong) {
                      borderColor = "border-red-400"
                      bgColor = "bg-red-50"
                    }
                  } else if (isSelected) {
                    borderColor = "border-blue-400"
                    bgColor = "bg-blue-50"
                  }

                  return (
                    <button
                      key={answerIndex}
                      onClick={() =>
                        handleAnswerSelect(questionIndex, answer)
                      }
                      disabled={quizFinished}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${borderColor} ${bgColor} ${
                        !quizFinished ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                            isSelected
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <span className="text-gray-700">{answer}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {!quizFinished && (
          <div className="text-center mt-8">
            <Button
              onClick={handleFinish}
              className="px-8 py-3 text-lg"
              disabled={questions.some((q) => q.selectedAnswer === null)}
            >
              Finish
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
