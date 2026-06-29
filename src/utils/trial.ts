export function getTrialStatus(startDateString?: string): {
  daysLeft: number;
  isExpired: boolean;
} {
  if (startDateString) {
    const startDate = new Date(startDateString);
    const currentDate = new Date();
    
    // Calculate difference in milliseconds
    const diffTime = currentDate.getTime() - startDate.getTime();
    // Convert to days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const daysLeft = 14 - diffDays;
    
    return {
      daysLeft: Math.max(0, daysLeft),
      isExpired: diffDays >= 14,
    };
  }
  
  return {
    daysLeft: 1,
    isExpired: false,
  };
}