export default function StaffPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-white">Staff</h1>
      <p className="text-gray-400 text-sm mb-6">
        Staff management is handled via the dashboard API key. All key holders have admin access.
      </p>

      <div className="border border-[#1E3A5F]/50 bg-[#111] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full border border-[#1E3A5F] bg-[#1E3A5F]/30 flex items-center justify-center text-[#5BB8F5] font-bold">
            A
          </div>
          <div>
            <div className="font-semibold text-white">Admin</div>
            <div className="text-xs text-[#5BB8F5] uppercase">Full Access</div>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          To add or remove staff, update the <span className="text-[#5BB8F5] font-mono">DASHBOARD_API_KEY</span> secret in your Replit project settings, then redeploy.
        </p>
      </div>
    </div>
  );
}
