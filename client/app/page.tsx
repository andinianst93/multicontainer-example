import React from 'react'
import Fib from '@/components/Fib'
import Link from 'next/link'
export default function Home() {
  return (
    <main className='mx-auto max-w-7xl py-16'>
      <Link href='/contact'>Contact</Link>
      <section className='text-3xl font-semibold text-center mb-12'>
        <h1>Fib Calculator</h1>
        <div className='border border-blue-700 mt-4 w-[100px] mx-auto'></div>
      </section>
      <Fib/>
    </main>
  )
}
