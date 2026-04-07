"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";
import Navbar from "@/components/Navbar";

export default function ResponsesPage() {
    const [responses, setResponses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/admin");
                    return;
                }

                const res = await axios.get(
                    "http://localhost:5000/api/answers/answers",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setResponses(res.data.data);
                console.log("Fetched responses:", res.data.data);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch responses");
            } finally {
                setLoading(false);
            }
        };

        fetchResponses();
    }, []);

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <>
            <Navbar />
            <AdminNavbar />
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-6">User Responses</h2>

                {responses.length === 0 ? (
                    <p>No responses found</p>
                ) : (
                    <div className="flex flex-col gap-6">
                        {responses.map((response) => (
                            <div
                                key={response._id}
                                className="border p-5 rounded-2xl shadow-md"
                            >
                                {/* Header */}
                                <div className="mb-4">
                                    <p className="font-semibold">
                                        Type:{" "}
                                        <span className="capitalize text-blue-600">
                                            {response.type}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Submitted:{" "}
                                        {new Date(response.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                {/* Answers: Two Columns */}
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left: Common Answers */}
                                    <div className="flex-1 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-2">Common Answers</h3>
                                        {response.commonAnswers.length === 0 ? (
                                            <p className="text-gray-400">No common answers</p>
                                        ) : (
                                            response.commonAnswers.map((c:any, idx:number) => (
                                                <div key={idx} className="mb-2 border-b pb-1">
                                                    <span className="font-medium">{c.question}:</span>{" "}
                                                    <span>{c.response}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Right: Category-Specific Answers */}
                                    <div className="flex-1  p-4 rounded-lg">
                                        <h3 className="font-semibold mb-2">Category-Specific Answers</h3>
                                        {response.answers.length === 0 ? (
                                            <p className="text-gray-400">No category answers</p>
                                        ) : (
                                            response.answers.map((a: any, idx: number) => (
                                                <div key={idx} className="mb-2 border-b pb-1">
                                                    <span className="font-medium">
                                                        {a.questionId?.questionText || "[Deleted question]"}:
                                                    </span>{" "}
                                                    <span>{a.response}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}