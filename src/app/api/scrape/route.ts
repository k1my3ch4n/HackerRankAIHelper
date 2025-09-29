import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

const CACHE_STORE = new Map();
const TTL = 60 * 5 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { error: "스크래핑할 URL이 누락되었습니다." },
      { status: 400 }
    );
  }

  const now = Date.now();
  const cacheKey = targetUrl;
  const cachedItem = CACHE_STORE.get(cacheKey);

  if (cachedItem && now - cachedItem.timestamp < TTL) {
    return NextResponse.json(cachedItem);
  }

  try {
    const response = await fetch(targetUrl, {
      next: { revalidate: TTL },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const htmlContent = await response.text();

    const scrapeData = cheerio.load(htmlContent);

    // 문제 제목
    const title = scrapeData('span[itemprop="name"]').last().text();

    // 문제
    const content = scrapeData('div[class="hackdown-content"]');

    // todo : svg 임시 삭제 처리
    content.find("script, style, link, svg").remove();

    content.find("*").each((_, element) => {
      scrapeData(element).removeAttr("class");
      scrapeData(element).removeAttr("id");
      scrapeData(element).removeAttr("style");
      scrapeData(element).removeAttr("data-testid");
    });

    CACHE_STORE.set(cacheKey, {
      message: "성공적으로 데이터를 추출했습니다.",
      title,
      content: content.html(),
      timestamp: now,
    });

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
