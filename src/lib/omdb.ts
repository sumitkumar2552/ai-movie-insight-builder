export async function fetchMovieByImdbId(imdbId: string) {
  const res = await fetch(
    `http://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movie");
  }

  return res.json();
}