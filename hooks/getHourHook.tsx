const getHourHook = () => {
  const gethour = (date: Date): string => {
    return date.toLocaleTimeString("es-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getElapsedTime = (value: Date): string => {
    const date = new Date(value);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();

    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffWeeks / 4);
    const diffYears = Math.floor(diffMonths / 12);

    if (diffSeconds < 1) {
      return "Justo ahora";
    } else if (diffSeconds < 60) {
      return `Hace ${diffSeconds} segundo${diffSeconds !== 1 ? "s" : ""}`;
    } else if (diffMinutes < 60) {
      return `Hace ${diffMinutes} minuto${diffMinutes !== 1 ? "s" : ""}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} hora${diffHours !== 1 ? "s" : ""}`;
    } else if (diffDays < 30) {
      return `Hace ${diffDays} día${diffDays !== 1 ? "s" : ""}`;
    } else if (diffWeeks < 4) {
      return `Hace ${diffWeeks} semana${diffWeeks !== 1 ? "s" : ""}`;
    } else if (diffMonths < 12) {
      return `Hace ${diffMonths} me${diffMonths !== 1 ? "ses" : "s"}`;
    } else {
      return `Hace ${diffYears} año${diffYears !== 1 ? "s" : ""}`;
    }
  };

  const formatDuration = (duration: number | null): string => {
    if (!duration) return "00:00";
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return {
    gethour,
    getElapsedTime,
    formatDuration,
  };
};

export default getHourHook;
