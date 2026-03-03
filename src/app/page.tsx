"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [imdbId, setImdbId] = useState("");
  const [movie, setMovie] = useState<any>(null);
  const [sentiment, setSentiment] = useState("");
  const [loading, setLoading] = useState(false);

  const getSentimentLabel = () => {
    const lower = sentiment.toLowerCase();
    if (lower.includes("negative")) return "Negative";
    if (lower.includes("mixed")) return "Mixed";
    if (lower.includes("positive")) return "Positive";
    return "Analyzed";
  };

  const getSentimentColor = () => {
    const lower = sentiment.toLowerCase();
    if (lower.includes("negative")) return "bg-red-500";
    if (lower.includes("mixed")) return "bg-yellow-500";
    if (lower.includes("positive")) return "bg-green-500";
    return "bg-gray-500";
  };

  const handleSearch = async (customId?: string) => {
    const idToUse = (customId || imdbId).trim().toLowerCase();
    const isValidImdb = /^tt\d{7,8}$/.test(idToUse);
    if (!isValidImdb) {
      alert("Please enter a valid IMDb ID (e.g., tt0133093)");
      return;
    }

    setLoading(true);
    setMovie(null);
    setSentiment("");

    try {
      // 🔹 Fetch Movie
      const movieRes = await fetch(`/api/movie?id=${idToUse}`);
      if (!movieRes.ok) throw new Error("Movie API failed");

      const movieData = await movieRes.json();

      if (!movieData || movieData.Response === "False") {
        alert("Movie not found. Please check IMDb ID.");
        return;
      }

      setMovie(movieData);

      // 🔹 Fetch TMDB ID
      const findRes = await fetch(
        `https://api.themoviedb.org/3/find/${idToUse}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&external_source=imdb_id`
      );

      const findData = await findRes.json();
      let reviews: any[] = [];

      if (findData.movie_results?.length > 0) {
        const movieId = findData.movie_results[0].id;

        const reviewRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );

        const reviewData = await reviewRes.json();
        reviews = reviewData.results || [];
      }

      // 🔹 AI Sentiment
      const sentimentRes = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviews: reviews.map((r: any) => r.content),
        }),
      });

      const sentimentData = await sentimentRes.json();

      const cleanText = sentimentData.sentiment
        ?.replace(/\*\*/g, "")
        ?.replace(/###/g, "")
        ?.replace(/---/g, "") || "Sentiment analysis failed.";

      setSentiment(cleanText);

    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-12">

      {/* HERO */}
      <div className="text-center mb-12">
        <h1
          onClick={() => {
            setMovie(null);
            setSentiment("");
            setImdbId("");
          }}
          className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text cursor-pointer"
        >
          AI Movie Insight Builder
        </h1>

        <p className="text-gray-400 mt-4">
          Enter an IMDb ID and get AI-powered audience sentiment analysis.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <input
            className="px-4 py-3 w-72 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="tt0133093"
            value={imdbId}
            onChange={(e) => setImdbId(e.target.value)}
          />


          <button
            onClick={() => handleSearch()}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition-all duration-300 shadow-lg cursor-pointer flex items-center gap-2"
          >
            {loading && (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Analyzing..." : "Search"}
          </button>

        </div>

        {!movie && (
          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm mb-6">
              Try popular examples:
            </p>

            <div className="flex flex-wrap justify-center gap-10">

              {/* The Matrix */}
              <div
                onClick={() => handleSearch("tt0133093")}
                className="cursor-pointer transform hover:scale-105 transition duration-300"
              >
                <img
                  src="https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
                  alt="The Matrix"
                  className="w-50 h-80 object-cover rounded-2xl shadow-2xl hover:shadow-purple-500/40"
                />
                <p className="mt-3 text-gray-300">The Matrix</p>
              </div>

              {/* Eternals */}
              <div
                onClick={() => handleSearch("tt9032400")}
                className="cursor-pointer transform hover:scale-105 transition duration-300"
              >
                <img
                  src="https://image.tmdb.org/t/p/w500/6AdXwFTRTAzggD2QUTt5B7JFGKL.jpg"
                  alt="Eternals"
                  className="w-50 h-80 object-cover rounded-2xl shadow-2xl hover:shadow-purple-500/40"
                />
                <p className="mt-3 text-gray-300">Eternals</p>
              </div>

              {/* Inception */}
              <div
                onClick={() => handleSearch("tt1375666")}
                className="cursor-pointer transform hover:scale-105 transition duration-300"
              >
                <img
                  src="https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
                  alt="Inception"
                  className="w-50 h-80 object-cover rounded-2xl shadow-2xl hover:shadow-purple-500/40"
                />
                <p className="mt-3 text-gray-300">Inception</p>
              </div>

            </div>
          </div>
        )}
      </div>


      {/* MOVIE CARD */}
      {movie && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="rounded-xl shadow-lg"
            />

            <div>
              <h2 className="text-3xl font-bold">{movie.Title}</h2>
              <p className="text-gray-400 mt-2">{movie.Plot}</p>

              <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <div>
                  <span className="text-gray-500">Year</span>
                  <p className="font-semibold">{movie.Year}</p>
                </div>
                <div>
                  <span className="text-gray-500">IMDb Rating</span>
                  <p className="font-semibold">{movie.imdbRating}</p>
                </div>
                <div>
                  <span className="text-gray-500">Cast</span>
                  <p className="font-semibold">{movie.Actors}</p>
                </div>
                <div>
                  <span className="text-gray-500">Genre</span>
                  <p className="font-semibold">{movie.Genre}</p>
                </div>
              </div>
            </div>
          </div>

          {/* LOADER BELOW CARD */}
          {loading && (
            <div className="mt-8 text-purple-400 animate-pulse">
              🤖 Analyzing audience sentiment...
            </div>
          )}

          {/* AI RESULT */}
          {sentiment && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 p-6 bg-gray-900 rounded-xl border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  🤖 AI Audience Insight
                </h3>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold text-black ${getSentimentColor()}`}
                >
                  {getSentimentLabel()}
                </span>
              </div>

              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {sentiment}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}