export function formatDate(dateString) {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function getDaysUntilExpiry(expiryDate) {
  if (!expiryDate) return 0;
  
  const expiry = new Date(expiryDate);
  const today = new Date();
  
  // Reset time to compare only dates
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function isExpired(expiryDate) {
  return getDaysUntilExpiry(expiryDate) < 0;
}

export function isExpiringSoon(expiryDate, daysThreshold = 7) {
  const days = getDaysUntilExpiry(expiryDate);
  return days >= 0 && days <= daysThreshold;
}
