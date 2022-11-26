import React, { useEffect, useRef, useState } from "react";

export const useLoader = () => {
  const timeoutRef = useRef(0);
  const [loading, setLoading] = useState(false);

  const loadingOn = () => {
    setLoading(true);
  };

  const loadingOff = (wait) => {
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
    }, wait);
  };

  const clearLoaderTimeout = () => {
    clearTimeout(timeoutRef.current);
  };

  return {
    loadingOn,
    loadingOff,
    clearLoaderTimeout,
    loading,
  };
};
