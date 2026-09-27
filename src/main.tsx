import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'

// Home ships in the main bundle; everything else is split and loaded on demand.
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/rooms', lazy: async () => ({ Component: (await import('@/pages/RoomsPage')).default }) },
      { path: '/rooms/:slug', lazy: async () => ({ Component: (await import('@/pages/RoomPage')).default }) },
      { path: '/gallery', lazy: async () => ({ Component: (await import('@/pages/GalleryPage')).default }) },
      { path: '/book', lazy: async () => ({ Component: (await import('@/pages/BookPage')).default }) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
