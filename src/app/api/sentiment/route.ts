import { analyzeSentiment } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const reviews = body.reviews;

    if (!reviews || reviews.length === 0) {
      return Response.json({
        sentiment: "No reviews available to analyze.",
      });
    }

    const sentiment = await analyzeSentiment(reviews);

    return Response.json({ sentiment });
  } catch (error) {
    console.error("Sentiment API Error:", error);
    return Response.json(
      { sentiment: "Failed to analyze sentiment." },
      { status: 500 }
    );
  }
}