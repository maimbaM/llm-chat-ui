"use client";
import React from 'react';
import Image from "next/image";
import {useState, useEffect} from "react";
import {Loader2, Send, History, Trash2} from "lucide-react";

interface Place {
    name: string;
    location: string;
    budget: string;
    description: string;
    best_time: string;
    good_for: string;
}

interface ApiResponse {
    answer: {
        places: Place[];
    };
}

interface HistoryItem {
    question: string;
    answer: ApiResponse;
}

export default function Home() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("query_history");
        if (stored) setHistory(JSON.parse(stored));
    }, []);

    const askQuestion = async () => {
        if (!question.trim()) return;
        setLoading(true);
        setAnswer(null);
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({question}),
            });

            const data = await res.json();

            // Handle error response
            if (data.error) {
                console.error("Backend error:", data.error);
                return;
            }

            // Handle successful response
            if (data.answer && typeof data.answer === 'object' && Array.isArray(data.answer.places)) {
                const responseData: ApiResponse = {
                    answer: {
                        places: data.answer.places
                    }
                };
                const newEntry = {question, answer: responseData};
                const updated = [newEntry, ...history];
                setAnswer(responseData);
                setHistory(updated);
                localStorage.setItem("query_history", JSON.stringify(updated));
            } else {
                console.error("Invalid response format:", data);
            }
        } catch (err: unknown) {
            console.error("Error fetching response:", err);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        localStorage.removeItem("query_history");
        setHistory([]);
        setQuestion("");
        setAnswer(null);
    };

    const renderHistoryItem = (item: HistoryItem) => {
        try {
            if (!item.answer?.answer?.places) {
                return "No results found";
            }
            return item.answer.answer.places
                .map(place => place.name)
                .join(", ") || "No places found";
        } catch (err) {
            console.error("Error rendering history item:", err);
            return "No results found";
        }
    };

    const renderAnswer = () => {
        if (!answer?.answer?.places) return null;

        return (
            <div className="bg-white border-l-4 border-cyan-400 p-6 rounded-2xl shadow-lg animate-fade-in">
                <h2 className="text-2xl font-bold text-blue-700 mb-3">
                    💎 Gem Drop Incoming...
                </h2>
                <p className="text-gray-600 mb-4 italic">You asked: {question}</p>
                <div className="grid gap-6">
                    {answer.answer.places.map((place: Place, index: number) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-800">{place.name}</h3>
                                <span className="text-green-600 font-semibold">{place.budget}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mb-3">
                                <span className="text-sm">📍 {place.location}</span>
                            </div>
                            <p className="text-gray-700 mb-3">{place.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold text-blue-600">Best Time:</span>
                                    <p className="text-gray-600">{place.best_time}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-blue-600">Good For:</span>
                                    <p className="text-gray-600">{place.good_for}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-10 font-sans text-gray-800">
            {/* Header */}
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-500 to-teal-400 drop-shadow-lg">
                    🏴‍☠️ Nairobi Gems
                </h1>
                <p className="mt-2 text-lg text-gray-600 italic">
                    Your AI influencer to Nairobi&apos;s Hidden Gems
                </p>
                <p className="mt-2 text-lg text-gray-600 italic">
                    Unadai nini, nikushow base ?
                </p>
                <p className="mt-2 text-4xl text-gray-600">
                    🍕🥂🏌🏾‍♂️💃🏼
                </p>
            </header>

            <main className="flex gap-6 max-w-7xl mx-auto">
                {/* History Sidebar */}
                <aside className="w-1/3 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-200">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div
                            className="w-20 h-20 bg-gradient-to-tr from-blue-400 via-cyan-400 to-teal-300 rounded-full flex items-center justify-center text-4xl shadow-lg">
                            🇰🇪
                        </div>
                        <h3 className="text-lg font-semibold mt-3">Nairobi Gems</h3>
                        <p className="text-sm text-gray-500">@nairobigems</p>
                        <p className="text-sm text-blue-600 mt-2 italic">
                            Your AI bestie for secret Nairobi spots
                        </p>
                        <div className="flex justify-around gap-4 mt-5 text-xs text-gray-600 font-medium w-full">
                            <div className="flex flex-col items-center">
                                <span className="text-neutral-800 text-sm font-bold flex items-center gap-1">
                                    <Image
                                        src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg"
                                        alt="IG" width={16} height={16} className="w-4 h-4"/>
                                    30K
                                </span>
                                <span>Instagram</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-neutral-800 text-sm font-bold flex items-center gap-1">
                                    <Image src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg"
                                           alt="TikTok" width={16} height={16} className="w-4 h-4"/>
                                    50K
                                </span>
                                <span>TikTok</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-neutral-800 text-sm font-bold flex items-center gap-1">
                                    <Image src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg"
                                           alt="X" width={16} height={16} className="w-4 h-4"/>
                                    15.6K
                                </span>
                                <span>X</span>
                            </div>
                        </div>
                    </div>

                    {/* Query History */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <History className="w-5 h-5 text-blue-600"/>
                            Past Vibes
                        </h2>
                        {history.length > 0 && (
                            <button
                                onClick={clearHistory}
                                className="text-cyan-600 hover:text-cyan-700 flex items-center gap-1 text-sm"
                            >
                                <Trash2 className="w-4 h-4"/>
                                Clear All
                            </button>
                        )}
                    </div>

                    <ul className="space-y-4 pr-2 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300">
                        {history.length === 0 ? (
                            <p className="text-gray-400 italic">No gems explored yet...</p>
                        ) : (
                            history.map((item, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => {
                                        setQuestion(item.question);
                                        setAnswer(item.answer);
                                    }}
                                    className={`border-l-4 pl-3 p-3 rounded-md cursor-pointer transition-all duration-200 ${
                                        item.question === question
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-cyan-300 hover:bg-blue-100"
                                    }`}
                                >
                                    <p className="font-medium">{item.question}</p>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                        {renderHistoryItem(item)}
                                    </p>
                                </li>
                            ))
                        )}
                    </ul>
                </aside>

                {/* Q&A Main */}
                <section className="flex-1 flex flex-col">
                    {/* Question Form */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="✨ Ask about hidden restaurants, vibes, views, music, spots..."
                            className="w-full p-4 border border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                            rows={4}
                        />
                        <button
                            onClick={askQuestion}
                            disabled={loading}
                            className={`px-6 py-2 rounded-lg font-semi-bold flex items-center gap-2 transition-all ${
                                loading
                                    ? "bg-blue-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            } text-white shadow-md`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-4 h-4"/>
                            ) : (
                                <Send className="w-4 h-4"/>
                            )}
                            Ask Nairobi Gems
                        </button>
                    </div>

                    {/* Answer Section */}
                    {/* Answer Section */}
                    {answer && renderAnswer()}
                </section>
            </main>
        </div>
    );
}