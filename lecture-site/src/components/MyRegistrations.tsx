'use client'

import { useState } from 'react'
import { CourseRegistration } from '@/lib/supabase'

type CourseSummary = {
  course_id: string
  course_name: string
  price: number
  count: number
  subtotal: number
}

export default function MyRegistrations() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [registrations, setRegistrations] = useState<CourseRegistration[] | null>(null)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('이메일을 입력해주세요.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.')
      return
    }
    setError('')
    setLoading(true)
    setSearched(false)

    try {
      const res = await fetch(`/api/registrations?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '조회 중 오류가 발생했습니다.')
      } else {
        setRegistrations(data.data)
        setSearched(true)
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const getCourseSummary = (): CourseSummary[] => {
    if (!registrations) return []
    const map: Record<string, CourseSummary> = {}
    for (const reg of registrations) {
      if (map[reg.course_id]) {
        map[reg.course_id].count += 1
        map[reg.course_id].subtotal += reg.price
      } else {
        map[reg.course_id] = {
          course_id: reg.course_id,
          course_name: reg.course_name,
          price: reg.price,
          count: 1,
          subtotal: reg.price,
        }
      }
    }
    return Object.values(map)
  }

  const grandTotal = registrations?.reduce((sum, r) => sum + r.price, 0) ?? 0
  const summary = getCourseSummary()

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <section id="my-registrations" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-50 rounded-full px-4 py-1.5 mb-4">
            <span className="text-purple-700 text-sm font-semibold">My Registrations</span>
          </div>
          <h2 className="text-4xl font-extrabold text-[#1a2744] mb-4">수강 내역 조회</h2>
          <p className="text-gray-600">신청 시 사용한 이메일로 수강 내역을 확인하세요.</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="등록하신 이메일 주소를 입력하세요"
              className={`w-full px-4 py-3.5 rounded-xl border ${error ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all text-gray-900 placeholder-gray-400`}
            />
            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1a2744] hover:bg-[#0f1a33] disabled:bg-gray-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-all whitespace-nowrap"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : '조회하기'}
          </button>
        </form>

        {/* Results */}
        {searched && registrations !== null && (
          <div>
            {registrations.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">해당 이메일로 등록된 수강 내역이 없습니다.</p>
                <p className="text-gray-400 text-sm mt-1">이메일 주소를 다시 확인해주세요.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-[#1a2744] rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-5 text-amber-300">과정별 수강 요약</h3>
                  <div className="space-y-3">
                    {summary.map((item) => (
                      <div key={item.course_id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                        <div>
                          <div className="font-medium text-white text-sm">{item.course_name}</div>
                          <div className="text-gray-400 text-xs mt-0.5">
                            {item.price.toLocaleString()}원 × {item.count}회
                          </div>
                        </div>
                        <div className="text-amber-300 font-bold">{item.subtotal.toLocaleString()}원</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                    <span className="text-gray-300 font-semibold">총 합계</span>
                    <span className="text-2xl font-extrabold text-amber-400">{grandTotal.toLocaleString()}원</span>
                  </div>
                </div>

                {/* Individual Registrations */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    전체 신청 내역 ({registrations.length}건)
                  </h3>
                  <div className="space-y-3">
                    {registrations.map((reg) => (
                      <div key={reg.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm">{reg.course_name}</div>
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                              <span className="text-xs text-gray-500">{reg.name}</span>
                              <span className="text-xs text-gray-400">·</span>
                              <span className="text-xs text-gray-500">{reg.phone}</span>
                              <span className="text-xs text-gray-400">·</span>
                              <span className="text-xs text-gray-400">{formatDate(reg.created_at)}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-bold text-[#1a2744] text-sm">{reg.price.toLocaleString()}원</div>
                            <div className="mt-1">
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                신청완료
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
