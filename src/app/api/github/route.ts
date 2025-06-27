import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

const fetchStargazers = unstable_cache(
  async () => {
    const res = await fetch("https://api.github.com/repos/nutlope/roomgpt", {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "csvtochat-app",
      },
      // Revalidate every hour (3600 seconds)
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch GitHub repo info");
    }
    const data = await res.json();
    return data.stargazers_count;
  },
  [],
  { revalidate: 3600 }
);

export async function GET() {
  try {
    const stargazers_count = await fetchStargazers();
    return new Response(JSON.stringify({ stargazers_count }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
