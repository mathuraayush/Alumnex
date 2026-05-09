import React from 'react'
import MainLayout from '../layouts/MainLayout'

export default function NotFound(){
  return (
    <MainLayout>
      <div className="text-center py-24">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted mt-2">Page not found</p>
      </div>
    </MainLayout>
  )
}
