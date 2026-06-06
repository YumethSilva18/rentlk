import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
          <FileQuestion className="h-10 w-10 text-purple-600" />
        </div>
        <h1 className="mb-2 text-6xl font-extrabold text-gray-900">404</h1>
        <h2 className="mb-2 text-2xl font-bold text-gray-700">Page Not Found</h2>
        <p className="mb-8 text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild variant="default">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/search">Search Vehicles</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
