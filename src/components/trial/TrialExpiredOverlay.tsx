export function TrialExpiredOverlay() {
  return (
    <div className="fixed inset-0 bg-slate-900 text-white flex flex-col items-center justify-center p-6 z-50">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Your free trial has expired</h1>
        <p className="text-slate-400">
          Your 14-day trial has come to an end. To continue using the platform and keep your data, please contact the developer.
        </p>
      </div>
    </div>
  );
}