import { COURSES } from '@/lib/courses'

export default function CoursesSection() {
  return (
    <section id="courses" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5 mb-4">
            <span className="text-blue-700 text-sm font-semibold">Curriculum</span>
          </div>
          <h2 className="text-4xl font-extrabold text-[#1a2744] mb-4">강의 과정 안내</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            현장 실무 중심의 5가지 전문 과정. 이론과 실습을 균형 있게 구성하여
            <br className="hidden sm:block" />
            즉시 현업에 적용 가능한 역량을 키워드립니다.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {COURSES.map((course, index) => (
            <div
              key={course.id}
              className="group relative bg-white rounded-2xl border border-gray-200 hover:border-[#1a2744]/30 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Top color bar */}
              <div className="h-1.5 bg-gradient-to-r from-[#1a2744] to-blue-500" />

              <div className="p-8 flex flex-col flex-1">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 bg-[#1a2744]/5 rounded-2xl flex items-center justify-center text-3xl">
                    {course.icon}
                  </div>
                  <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
                    {course.level}
                  </span>
                </div>

                {/* Course Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{course.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">{course.description}</p>

                {/* Topics */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">주요 교육 내용</p>
                  <div className="flex flex-wrap gap-1.5">
                    {course.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs bg-gray-50 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Duration & Price */}
                <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-[#1a2744]">
                      {course.price.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-400">1인 기준 / VAT 별도</div>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="#register"
                  className="mt-5 w-full text-center bg-[#1a2744] hover:bg-[#0f1a33] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm group-hover:bg-amber-500"
                >
                  이 과정 신청하기
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm bg-gray-50 rounded-xl px-6 py-4 border border-gray-200">
            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            기업/기관 단체 교육 문의는 별도 협의 가능합니다. 맞춤형 커리큘럼 설계 서비스를 제공합니다.
          </div>
        </div>
      </div>
    </section>
  )
}
