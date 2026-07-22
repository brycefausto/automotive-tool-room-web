import { getTrialStatus } from "@/utils/trial";

export function TrialBanner() {
const trialStartDate = process.env.NEXT_PUBLIC_TRIAL_START_DATE || "";

  const { daysLeft, isExpired } = getTrialStatus(trialStartDate);
  
  if (daysLeft > 0 && !isExpired) {
    return (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-medium">
        You have <strong>{daysLeft} days</strong> left in your free trial. Upgrade now to keep access!
        </div>
    );
  }

  return;
}