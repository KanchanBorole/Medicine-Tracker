import { useState, useEffect } from "react";

export default function CurrentDateTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
    };
  };

  const { date, time } = formatDateTime(currentTime);

  return (
    <div className="current-datetime">
      <div className="datetime-icon">
        <i className="fas fa-clock"></i>
      </div>
      <div className="datetime-info">
        <div className="current-date">{date}</div>
        <div className="current-time">{time}</div>
      </div>
    </div>
  );
}