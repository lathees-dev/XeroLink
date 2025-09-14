import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded shadow p-8">
        <h1 className="text-2xl font-semibold mb-2">Welcome to XeroLink</h1>
        <p className="text-sm text-gray-600 mb-6">
          Manage print orders, services, and payments.
        </p>

        <div className="grid gap-3">
          <div className="flex gap-3">
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-block bg-gray-100 text-gray-900 px-4 py-2 rounded text-sm hover:bg-gray-200"
            >
              Register
            </Link>
          </div>

          <div className="border-t my-4" />

          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/student/dashboard"
              className="block border rounded p-4 hover:shadow transition text-sm"
            >
              <p className="font-medium">Student Dashboard</p>
              <p className="text-xs text-gray-500">
                Create and track your print orders, manage payments.
              </p>
            </Link>

            <Link
              href="/shop/dashboard"
              className="block border rounded p-4 hover:shadow transition text-sm"
            >
              <p className="font-medium">Shop Dashboard</p>
              <p className="text-xs text-gray-500">
                Manage services and process incoming orders.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
