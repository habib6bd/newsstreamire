export default function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}
