import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { error: "스크래핑할 URL이 누락되었습니다." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const htmlContent = await response.text();

    const scrapeData = cheerio.load(htmlContent);

    const productNames: string[] = [];

    scrapeData('span[itemprop="name"]').each((_, element) => {
      const name = scrapeData(element).text().trim();
      if (name) {
        productNames.push(name);
      }
    });

    console.log("Server side HTML content successfully fetched!");

    return new Response(
      JSON.stringify({
        message: "Successfully fetched HTML. Check the console.",
        html: productNames,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("An error occurred during scraping:", error);

    return new Response(
      JSON.stringify({
        error: "An error occurred during website scraping.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
