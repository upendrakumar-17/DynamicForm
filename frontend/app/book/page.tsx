"use client";

import { useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

const API_BASE_URL = "http://localhost:5000/api";

const ROLE_OPTIONS = [
  { value: "planner", label: "Planner", icon: "📋", color: "from-blue-500 to-blue-600" },
  { value: "performer", label: "Performer", icon: "🎭", color: "from-purple-500 to-purple-600" },
  { value: "crew", label: "Crew", icon: "👷", color: "from-orange-500 to-orange-600" },
];

interface CommonData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  fromDate: string;
  toDate: string;
}

interface Question {
  _id: string;
  questionText: string;
}

const INITIAL_FORM_DATA: CommonData = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  fromDate: "",
  toDate: "",
};

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [commonData, setCommonData] = useState<CommonData>(INITIAL_FORM_DATA);

  const validateCommonData = (): boolean => {
    const { name, email, phone, fromDate, toDate } = commonData;

    // Check empty fields
    if (!name || !email || !phone || !fromDate || !toDate) {
      setError("Please fill all required fields");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate phone (basic: at least 10 digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
      setError("Please enter a valid phone number (at least 10 digits)");
      return false;
    }

    // Validate date range
    if (new Date(fromDate) > new Date(toDate)) {
      setError("End date must be after start date");
      return false;
    }

    return true;
  };

  const isFieldInvalid = (fieldName: keyof CommonData): boolean => {
    const value = commonData[fieldName];
    if (!value) return true;

    if (fieldName === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(value);
    }

    if (fieldName === "phone") {
      const phoneRegex = /^\d{10,}$/;
      return !phoneRegex.test(value.replace(/\D/g, ""));
    }

    if (fieldName === "toDate" && commonData.fromDate) {
      return new Date(value) < new Date(commonData.fromDate);
    }

    return false;
  };

  const resetForm = () => {
    setSelected("");
    setQuestions([]);
    setAnswers({});
    setCommonData(INITIAL_FORM_DATA);
    setError("");
  };

  const buildCommonAnswers = () =>
    Object.entries(commonData).map(([key, value]) => ({
      question: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (c) => c.toUpperCase())
        .trim(),
      response: value,
    }));

  const handleSelectRole = async (type: string) => {
    try {
      setError("");
      setLoading(true);
      setSelected(type);
      setAnswers({});

      const { data } = await axios.get(
        `${API_BASE_URL}/questions?type=${type}`
      );
      setQuestions(data);
      setStep(2);
    } catch (err) {
      setError("Failed to load questions. Please try again.");
      setSelected("");
    } finally {
      setLoading(false);
    }
  };

  const handleCommonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCommonData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error on user input
    if (error) setError("");
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        type: selected,
        commonAnswers: buildCommonAnswers(),
        answers: questions.map((q) => ({
          questionId: q._id,
          response: answers[q._id] || "",
        })),
      };

      await axios.post(`${API_BASE_URL}/answers/answers`, payload);
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        resetForm();
        setStep(1);
      }, 2000);
    } catch (err) {
      setError("Failed to submit form. Please try again.");
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
            <p className="text-center mb-6 text-sm text-[var(--foreground-secondary)]">
              Step {step} of 3
            </p>
          </div>

          {/* Role Selection */}
          {step === 1 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6 text-center">Select Your Role</h2>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {ROLE_OPTIONS.map((option) => {
                  const isSelected = selected === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSelectRole(option.value)}
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
          )}

          {step === 2 && (
            <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Basic Details</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <input
                  name="name"
                  placeholder="Full Name *"
                  value={commonData.name}
                  onChange={handleCommonChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid("name")
                      ? "border-red-500 focus:ring-red-300"
                      : "focus:ring-[var(--primary-500)]"
                  }`}
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email *"
                  value={commonData.email}
                  onChange={handleCommonChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid("email")
                      ? "border-red-500 focus:ring-red-300"
                      : "focus:ring-[var(--primary-500)]"
                  }`}
                />

                <input
                  name="phone"
                  placeholder="Phone (10+ digits) *"
                  value={commonData.phone}
                  onChange={handleCommonChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid("phone")
                      ? "border-red-500 focus:ring-red-300"
                      : "focus:ring-[var(--primary-500)]"
                  }`}
                />

                <input
                  name="eventType"
                  placeholder="Event Type *"
                  value={commonData.eventType}
                  onChange={handleCommonChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    isFieldInvalid("eventType")
                      ? "border-red-500 focus:ring-red-300"
                      : "focus:ring-[var(--primary-500)]"
                  }`}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">From Date *</label>
                    <input
                      type="date"
                      name="fromDate"
                      value={commonData.fromDate}
                      onChange={handleCommonChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        isFieldInvalid("fromDate")
                          ? "border-red-500 focus:ring-red-300"
                          : "focus:ring-[var(--primary-500)]"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">To Date *</label>
                    <input
                      type="date"
                      name="toDate"
                      value={commonData.toDate}
                      onChange={handleCommonChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        isFieldInvalid("toDate")
                          ? "border-red-500 focus:ring-red-300"
                          : "focus:ring-[var(--primary-500)]"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    resetForm();
                    setStep(1);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
                >
                  Back
                </button>

                <button
                  onClick={() => {
                    const isValid = validateCommonData();
                    if (isValid) {
                      setStep(3);
                    }
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Questions Section */}
          {step === 3 && questions.length > 0 && (
            <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-lg p-8">
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium">✓ Form submitted successfully!</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">
                Questions for {selected?.charAt(0).toUpperCase()}{selected?.slice(1)}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((q, index) => (
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
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-[var(--background-secondary)] text-[var(--foreground)] font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--border)] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-[var(--primary-600)] to-[var(--primary-500)] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Response"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers({});
                    }}
                    className="px-6 py-3 bg-[var(--background-secondary)] text-[var(--foreground)] font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--border)] transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Empty State */}
          {!questions.length && selected && !loading && step === 3 && (
            <div className="text-center p-8 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl">
              <p className="text-[var(--foreground-secondary)] mb-4">No questions available for this role yet.</p>
              <button
                onClick={() => {
                  resetForm();
                  setStep(1);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Selection
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
