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

    const title = scrapeData('span[itemprop="name"]').last().text();

    const content = scrapeData('div[class="hackdown-content"]');

    content.find("script, style, link").remove();

    content.find("*").each((_, element) => {
      scrapeData(element).removeAttr("class");
      scrapeData(element).removeAttr("id");
      scrapeData(element).removeAttr("style");
      scrapeData(element).removeAttr("data-testid");
    });

    console.log("Server side HTML content successfully fetched!");

    return NextResponse.json({
      message: "성공적으로 데이터를 추출했습니다.",
      title,
      content: content.html(),
    });
  } catch (error) {
    console.error("An error occurred during scraping:", error);

    return NextResponse.json(
      {
        error: `웹사이트 스크래핑 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        } `,
      },
      {
        status: 500,
      }
    );
  }
}
