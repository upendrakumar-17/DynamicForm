"use client";

import { useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

export default function BookPage() {
  const [selected, setSelected] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const options = [
    { value: "planner", label: "Planner", icon: "📋", color: "from-blue-500 to-blue-600" },
    { value: "performer", label: "Performer", icon: "🎭", color: "from-purple-500 to-purple-600" },
    { value: "crew", label: "Crew", icon: "👷", color: "from-orange-500 to-orange-600" },
  ];

  const handleClick = async (type: string) => {
    try {
      setLoading(true);
      setSelected(type);
      setAnswers({});

      const res = await axios.get(
        `http://localhost:5000/api/questions?type=${type}`
      );
      console.log("res data:", res.data);

      setQuestions(res.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        type: selected,
        answers: questions.map((q: any) => ({
          questionId: q._id,
          response: answers[q._id] || "",
        })),
      };

      const res = await axios.post(
        "http://localhost:5000/api/answers",
        payload
      );
      console.log("Response:", res.data);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelected("");
        setQuestions([]);
        setAnswers({});
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-73px)] px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-[var(--background)] to-[var(--background-secondary)]">
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-4">
              Book Your Event
            </h1>
            <p className="text-lg text-[var(--foreground-secondary)]">
              Select your role and fill in the event details
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6 text-center">Select Your Role</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {options.map((option) => {
                const isSelected = selected === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleClick(option.value)}
                    disabled={loading}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      isSelected
                        ? `bg-gradient-to-br ${option.color} text-white border-transparent shadow-lg`
                        : "bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary-400)]"
                    } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    
                    <h3 className="text-lg font-semibold">{option.label}</h3>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Questions Section */}
          {questions.length > 0 && (
            <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-lg p-8">
              {/* Success Message */}
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium">✓ Form submitted successfully!</p>
                </div>
              )}

              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">
                Questions for {selected?.charAt(0).toUpperCase()}{selected?.slice(1)}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((q: any, index: number) => (
                  <div key={q._id} className="pb-6 border-b border-[var(--border)] last:border-b-0">
                    <label className="block mb-3">
                      <span className="text-sm font-semibold text-[var(--primary-600)] mb-1 block">
                        Question {index + 1} of {questions.length}
                      </span>
                      <span className="block text-base font-medium text-[var(--foreground)] mb-3">
                        {q.questionText}
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your answer here..."
                      value={answers[q._id] || ""}
                      onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--foreground-secondary)] focus:outline-none focus:border-[var(--primary-500)] focus:ring-4 focus:ring-[var(--primary-100)] transition-all"
                      required
                    />
                  </div>
                ))}

                {/* Submit Button */}
                <div className="pt-6 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-[var(--primary-600)] to-[var(--primary-500)] text-white font-semibold rounded-lg hover:shadow-lg hover:scale-101 transition-all duration-200"
                  >
                    Submit Response
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected("");
                      setQuestions([]);
                      setAnswers({});
                    }}
                    className="px-6 py-3 bg-[var(--background-secondary)] text-[var(--foreground)] font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--border)] transition-all duration-200  "
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Empty State */}
          {!questions.length && selected && !loading && (
            <div className="text-center p-8 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl">
              <p className="text-[var(--foreground-secondary)]">No questions available for this role yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
