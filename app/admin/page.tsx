import StatCard from "@/components/admin/StatCard";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-5">
        <h2 className="text-xl font-bold text-gray-900">ড্যাশবোর্ড</h2>
        <p className="text-sm text-gray-600 mt-1">
          নিউজ এবং ইউজার ম্যানেজমেন্ট
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="মোট নিউজ" value="—" />
        <StatCard title="পাবলিশড" value="—" />
        <StatCard title="ফিচারড" value="—" />
        <StatCard title="ইউজার" value="—" />
      </div>
    </div>
  );
}
