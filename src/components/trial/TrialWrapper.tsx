
import { getTrialStatus } from "@/utils/trial";
import { TrialExpiredOverlay } from "./TrialExpiredOverlay";

export default function TrialWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const trialStartDate = process.env.NEXT_PUBLIC_TRIAL_START_DATE || "";

  const { isExpired } = getTrialStatus(trialStartDate);

  if (isExpired) {
    return <TrialExpiredOverlay />
  }

  return children;
}