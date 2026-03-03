import { fetchMovieByImdbId } from "@/lib/omdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imdbId = searchParams.get("id");

  if (!imdbId) {
    return Response.json({ error: "IMDb ID required" }, { status: 400 });
  }

  try {
    const movie = await fetchMovieByImdbId(imdbId);
    return Response.json(movie);
  } catch (err) {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}