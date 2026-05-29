'use client'

import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { label: '소개', href: '#about' },
    { label: '강의 특장점', href: '#why' },
    { label: '강의 과정', href: '#courses' },
    { label: '수강 신청', href: '#register' },
    { label: '수강 내역', href: '#my-registrations' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a2744]/95 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IT</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">IT 전문 강사</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-amber-400 px-4 py-2 text-sm font-medium rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#register"
              className="ml-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200"
            >
              수강 신청하기
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴 열기"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-300 hover:text-amber-400 px-4 py-3 text-sm font-medium hover:bg-white/10 transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
