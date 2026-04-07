"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";
import Navbar from "@/components/Navbar";
export default function Question() {
    const router = useRouter();
    const [questionText, setQuestionText] = useState("");
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    }, []);

    useEffect(() => {
        if (token === null) return;
        if (!token) {
            router.push("/admin");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await axios.post(
                "http://localhost:5000/api/admin/add-question",
                {
                    questionText,
                    type,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess("Question added successfully!");
            console.log(res.data);
            setTimeout(() => {
                setQuestionText("");
                setType("");
                setSuccess("");
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error adding question";
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar/>
            <AdminNavbar />
            <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-73px)] px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-[var(--background)] to-[var(--background-secondary)]">
                <div className="w-full max-w-md">
                    {/* Card Container */}
                    <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-xl p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Add Question</h2>
                            <p className="text-sm text-[var(--foreground-secondary)]">Create a new question for your event</p>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-700 font-medium">✓ {success}</p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Question Text Input */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                    Question Text
                                </label>
                                <textarea
                                    placeholder="Enter your question here..."
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    className="w-full px-4 py-2.5 border-2 border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--foreground-secondary)] focus:outline-none focus:border-[var(--primary-500)] focus:ring-4 focus:ring-[var(--primary-100)] transition-all resize-none h-24"
                                    required
                                />
                            </div>

                            {/* Type Select */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                    Question Type
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-4 py-2.5 border-2 border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--primary-500)] focus:ring-4 focus:ring-[var(--primary-100)] transition-all bg-[var(--background)] appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" className="bg-[var(--background)]">
                                        -- Select a Type --
                                    </option>
                                    <option value="planner" className="bg-[var(--background)]">
                                        Planner
                                    </option>
                                    <option value="performer" className="bg-[var(--background)]">
                                        Performer
                                    </option>
                                    <option value="crew" className="bg-[var(--background)]">
                                        Crew
                                    </option>
                                </select>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 mt-2 bg-gradient-to-r from-[var(--primary-600)] to-[var(--primary-500)] text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Adding...
                                    </span>
                                ) : (
                                    "Add Question"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
