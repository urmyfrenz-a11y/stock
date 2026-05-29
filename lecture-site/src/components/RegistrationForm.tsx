'use client'

import { useState } from 'react'
import { COURSES } from '@/lib/courses'

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course_id: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.'
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.'
    }
    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력해주세요.'
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '010-XXXX-XXXX 형식으로 입력해주세요.'
    }
    if (!formData.course_id) newErrors.course_id = '강의를 선택해주세요.'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setLoading(true)
    setServerError('')

    const selectedCourse = COURSES.find((c) => c.id === formData.course_id)!

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          course_id: formData.course_id,
          course_name: selectedCourse.name,
          price: selectedCourse.price,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setServerError(data.error || '오류가 발생했습니다.')
      } else {
        setSuccess(true)
        setFormData({ name: '', email: '', phone: '', course_id: '' })
      }
    } catch {
      setServerError('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="register" className="py-24 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 rounded-full px-4 py-1.5 mb-4">
            <span className="text-green-700 text-sm font-semibold">Registration</span>
          </div>
          <h2 className="text-4xl font-extrabold text-[#1a2744] mb-4">수강 신청</h2>
          <p className="text-gray-600">아래 양식을 작성하여 원하시는 과정에 신청해주세요.</p>
        </div>

        {success ? (
          <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">신청이 완료되었습니다!</h3>
            <p className="text-gray-600 mb-8">
              수강 신청이 성공적으로 접수되었습니다.<br />
              빠른 시일 내에 안내 연락을 드리겠습니다.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setSuccess(false)}
                className="bg-[#1a2744] hover:bg-[#0f1a33] text-white font-semibold px-8 py-3 rounded-xl transition-all"
              >
                추가 신청하기
              </button>
              <a
                href="#my-registrations"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-xl transition-all"
              >
                수강 내역 확인
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-10">
            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="홍길동"
                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all text-gray-900 placeholder-gray-400`}
              />
              {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all text-gray-900 placeholder-gray-400`}
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                전화번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                placeholder="010-0000-0000"
                maxLength={13}
                className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all text-gray-900 placeholder-gray-400`}
              />
              {errors.phone && <p className="mt-1.5 text-sm text-red-500">{errors.phone}</p>}
              <p className="mt-1 text-xs text-gray-400">010으로 시작하는 11자리 번호 (예: 010-1234-5678)</p>
            </div>

            {/* Course Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                강의 선택 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {COURSES.map((course) => (
                  <label
                    key={course.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.course_id === course.id
                        ? 'border-[#1a2744] bg-[#1a2744]/5'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="course"
                      value={course.id}
                      checked={formData.course_id === course.id}
                      onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                      className="w-4 h-4 text-[#1a2744] accent-[#1a2744]"
                    />
                    <div className="text-2xl">{course.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{course.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{course.duration} · {course.level}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-[#1a2744] text-sm">{course.price.toLocaleString()}원</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.course_id && <p className="mt-2 text-sm text-red-500">{errors.course_id}</p>}
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a2744] hover:bg-[#0f1a33] disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all duration-200 text-lg shadow-lg hover:shadow-xl active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  처리 중...
                </span>
              ) : '수강 신청하기'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
