import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AdminDashboard } from '@/components/admin-dashboard'

export default async function AdminPage() {
  // Check for admin session
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin_session')

  if (!adminSession) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/logo.jpg"
              alt="MGDZ Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="font-bold text-xl text-slate-900">MGDZ</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              Store
            </Link>
            <span className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium">
              Admin Panel
            </span>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdminDashboard />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="MGDZ"
                className="h-6 w-6 object-contain"
              />
              <span className="font-bold text-slate-900">MGDZ Gaming Store</span>
            </div>
            <p className="text-slate-600 text-sm">
              Premium Graphics Cards for Gamers & Professionals
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
