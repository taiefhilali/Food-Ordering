import React from 'react'

export default function Footer() {
  return (
    <div className='bg-orange-100'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center rounded-t-3xl'></div>
        <span className='text-3xl text-white font-bold tracking-tight'>Jo3et</span>
        <span className='text-gray-50 font-bold tracking-tight flex gap-4'>
            <span> Privacy Policy</span>
            <span> Terms of service </span>
        </span>
    </div>
  )
}
