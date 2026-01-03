import { useState, useEffect, useRef, useCallback } from "react";

const useSessionTimeout = ({
  timeoutMinutes = 30,
  warningMinutes = 1,
  onLogout,
  onWarning,
}) => {
  const [isWarning, setIsWarning] = useState(false);
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = warningMinutes * 60 * 1000;

  const logoutTimer = useRef(null);
  const warningTimer = useRef(null);

  const clearTimers = useCallback(() => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
  }, []);

  const resetTimers = useCallback(() => {
    clearTimers();
    setIsWarning(false);

    // Set warning timer
    warningTimer.current = setTimeout(() => {
      setIsWarning(true);
      if (onWarning) onWarning();
    }, timeoutMs - warningMs);

    // Set logout timer
    logoutTimer.current = setTimeout(() => {
      if (onLogout) onLogout();
    }, timeoutMs);
  }, [timeoutMs, warningMs, onLogout, onWarning, clearTimers]);

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const handleActivity = () => {
      resetTimers();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    resetTimers();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimers();
    };
  }, [resetTimers, clearTimers]);

  return { isWarning, resetTimers };
};

export default useSessionTimeout;
