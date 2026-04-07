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

                setResponses(res.data.data); // ✅ important
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

                                {/* Answers */}
                                <div className="flex flex-col gap-3">
                                    {response.answers.map((ans: any) => (
                                        <div
                                            key={ans._id}
                                            className="border-b pb-2"
                                        >
                                            <p className="font-medium">
                                                {ans.questionId.questionText}
                                            </p>
                                            <p className="text-gray-700">
                                                {ans.response}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}