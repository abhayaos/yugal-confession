import React from 'react'
import { Link } from 'react-router-dom'

function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-center px-4">
      <h1 className="text-7xl font-extrabold text-white tracking-tight">
        404
      </h1>

      <p className="mt-4 text-lg text-zinc-400 max-w-md">
        You wandered off the map. This page doesn’t exist or got moved.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200 transition"
      >
        Go back home →
      </Link>

      <span className="mt-10 text-xs text-zinc-600">
        Lost, but still stylish.
      </span>
    </div>
  )
}

export default PageNotFound
