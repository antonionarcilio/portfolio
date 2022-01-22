import React from 'react';
// types

export const useInfiniteScroll = ({ sentinelRef }) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  // settings to IntersectionObserver
  const callbackFunction = (entries:any) => {
    if (entries.some((entry: IntersectionObserverEntry) => entry.isIntersecting)) {
      setCurrentPage((currentValue) => currentValue + 1);
    }
  };
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  };

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const checkReadyState = setInterval(() => {
      if (document.readyState === 'complete') {
        clearInterval(checkReadyState);

        timer = setTimeout(() => {
          const element = document.getElementById(`${sentinelRef || 'js-sentinel'}`);
          const intersectionObserver = new IntersectionObserver(callbackFunction, options);
          intersectionObserver.observe(element);
          return () => intersectionObserver.disconnect();
        }, 1000);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return { currentPage };
};
