"use client";

import {useState, useEffect} from "react";
import {Loader2, Send, History, Trash2} from "lucide-react";

export default function Home() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [selectedQnA, setSelectedQnA] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("query_history");
        if (stored) setHistory(JSON.parse(stored));
    }, []);

    const askQuestion = async () => {
        if (!question.trim()) return;
        setLoading(true);
        setAnswer("");
        try {
            const res = await fetch("http://localhost:8000/ask", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({question}),
            });

            const data = await res.json();
            const newEntry = {question, answer: data.answer};
            const updated = [newEntry, ...history];

            setAnswer(data.answer);
            setHistory(updated);
            localStorage.setItem("query_history", JSON.stringify(updated));
            setSelectedQnA(newEntry);
        } catch (err: unknown) {
            setAnswer("Oops! Nairobi’s vibes got interrupted. Try again 💔");
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        localStorage.removeItem("query_history");
        setHistory([]);
        setSelectedQnA(null);
        setQuestion("");
        setAnswer("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-10 font-sans text-gray-800">
            {/* Header */}
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-500 to-teal-400 drop-shadow-lg">
                    🏴‍☠️ Nairobi Gems
                </h1>
                <p className="mt-2 text-lg text-gray-600 italic">
                    Your AI influencer guide to Nairobi's best-kept secrets
                </p>
                <p className="mt-2 text-4xl text-gray-600">
                    🍕🥂🏌🏾‍♂️
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
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="IG"
                       className="w-4 h-4"/>
                  12K
                </span>
                                <span>Instagram</span>
                            </div>
                            <div className="flex flex-col items-center">
                <span className="text-neutral-800 text-sm font-bold flex items-center gap-1">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg" alt="TikTok"
                       className="w-4 h-4"/>
                  9.8K
                </span>
                                <span>TikTok</span>
                            </div>
                            <div className="flex flex-col items-center">
                <span className="text-neutral-800 text-sm font-bold flex items-center gap-1">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" alt="X"
                       className="w-4 h-4"/>
                  6.3K
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
                                        setSelectedQnA(item);
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
                                        {item.answer}
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
                placeholder="✨ Ask about hidden restaurants, views, art spots..."
                className="w-full p-4 border border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                rows={4}
            />
                        <button
                            onClick={askQuestion}
                            disabled={loading}
                            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
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
                    {answer && (
                        <div className="bg-white border-l-4 border-cyan-400 p-6 rounded-2xl shadow-lg animate-fade-in">
                            <h2 className="text-2xl font-bold text-blue-700 mb-3">
                                💎 Gem Drop Incoming...
                            </h2>
                            <p className="text-gray-600 mb-2 italic">You asked: {question}</p>
                            <p className="text-lg text-gray-800 leading-relaxed">{answer}</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
