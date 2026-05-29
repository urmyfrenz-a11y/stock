export default function WhySection() {
  const differentiators = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: '정부기관 공인 강사',
      description: '방통위, KCA, 행안부, 국방부 등 국내 주요 정부기관에서 공식 교육 강사로 활동하며 신뢰성을 검증받았습니다.',
      highlights: ['방송통신위원회', '한국방송통신전파진흥원(KCA)', '행정안전부', '국방부'],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: '명문대학교 초빙 강의',
      description: '서울대학교, KAIST, 연세대학교 등 국내 최고 명문대에서 초빙교수로 특강 및 정규 강의를 진행합니다.',
      highlights: ['서울대학교', 'KAIST', '연세대학교', '고려대학교'],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: '통신 3사 공식 교육 파트너',
      description: 'KT, SK텔레콤, LG유플러스 등 국내 통신 3사의 임직원 교육을 담당하며 업계 최신 트렌드를 반영합니다.',
      highlights: ['KT (Korea Telecom)', 'SK텔레콤', 'LG유플러스', '삼성전자 네트워크'],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: '25년 현장 실무 경험',
      description: '삼성전자, KTF, 모토로라, 팬택, 화웨이, 현대오토에버 등 국내외 최정상 기업에서 쌓은 실전 노하우를 전달합니다.',
      highlights: ['삼성전자', 'KTF (현 KT)', '모토로라', '현대오토에버'],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: '최신 기술 트렌드 반영',
      description: '5G/6G, 생성형 AI, 데이터 사이언스 등 급변하는 ICT 환경을 선도하는 최신 커리큘럼으로 구성되어 있습니다.',
      highlights: ['5G/6G 최신 표준', '생성형 AI (ChatGPT/Claude)', 'LLM & RAG 기술', '데이터 분석 실무'],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: '맞춤형 기업 교육 설계',
      description: '기관·기업별 특성에 맞는 커스텀 커리큘럼을 제공합니다. 사전 수준 진단 후 최적화된 교육을 설계합니다.',
      highlights: ['수준별 맞춤 커리큘럼', '사전 역량 진단', '실습 중심 교육', '교육 후 Q&A 지원'],
    },
  ]

  return (
    <section id="why" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-amber-700 text-sm font-semibold">Why Choose Us</span>
          </div>
          <h2 className="text-4xl font-extrabold text-[#1a2744] mb-4">
            왜 이 강의여야 하는가
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            단순한 이론이 아닌, 25년 현장 경험과 검증된 교육 노하우로
            <br className="hidden sm:block" />
            진짜 실력을 키워드립니다.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentiators.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
            >
              <div className="w-14 h-14 bg-[#1a2744]/5 group-hover:bg-[#1a2744] rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                <div className="text-[#1a2744] group-hover:text-amber-400 transition-colors duration-300">
                  {item.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{item.description}</p>

              <div className="flex flex-wrap gap-2">
                {item.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-xs bg-[#1a2744]/5 text-[#1a2744] font-medium px-3 py-1 rounded-full"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Career timeline bar */}
        <div className="mt-16 bg-[#1a2744] rounded-3xl p-8 sm:p-12 text-white">
          <h3 className="text-center text-2xl font-bold mb-8 text-amber-300">주요 경력 이력</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {['삼성전자', 'KTF', '모토로라', '팬택', '화웨이', '현대오토에버'].map((company) => (
              <div key={company} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-xs">{company.slice(0, 2)}</span>
                </div>
                <span className="text-gray-300 text-sm font-medium">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
