import { NextResponse } from "next/server";
import GNews from "@gnews-io/gnews-io-js";

const client = new GNews(process.env.GNEWS_API_KEY as string);

export async function GET() {
  try {
    const data = await client.topHeadlines({
      lang: "en",
      country: "us",
      max: 5,
      category: "technology",
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
