import { useState } from "react";

const useScrapeURL = () => {
  const [data, setData] = useState<any>();

  const scrapeUrl = async (url?: string) => {
    try {
      const response = await fetch(`/api/scrape?url=${url}`);
      const responseData = await response.json();

      setData(responseData.content);
    } catch (error) {
      setData(
        new Response(
          JSON.stringify({
            error: "웹사이트 스크래핑 중 오류가 발생했습니다.",
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      );
    }
  };

  return {
    data,
    scrapeUrl,
  };
};

export default useScrapeURL;
