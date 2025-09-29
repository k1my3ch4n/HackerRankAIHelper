import { useEffect, useRef } from "react";

const FIXED_SCROLL_AMOUNT = 200;

const useControlScroll = (
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const prevScrollHeightRef = useRef<number>(0);

  useEffect(() => {
    const containerElement = containerRef.current;

    if (!containerElement) {
      return;
    }

    prevScrollHeightRef.current = containerElement.scrollHeight;

    const observer = new MutationObserver(() => {
      const currentScrollY = window.scrollY;

      const newScrollY = currentScrollY + FIXED_SCROLL_AMOUNT;

      window.scrollTo({
        top: newScrollY,
        behavior: "smooth",
      });
    });

    observer.observe(containerElement, { childList: true });

    return () => observer.disconnect();
  }, [containerRef]);
};

export default useControlScroll;
