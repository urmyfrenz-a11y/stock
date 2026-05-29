'use client'

export default function HeroSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f1a33 0%, #1a2744 50%, #1e3a5f 100%)' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-5 py-2 mb-8">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <span className="text-amber-300 text-sm font-medium tracking-wide">
            25년 이상 현장 전문가 · 정부기관 & 대기업 검증
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          <span className="block">대한민국 최고의</span>
          <span className="block mt-2 bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
            ICT 전문 강사
          </span>
        </h1>

        <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
          삼성전자 · KTF · 모토로라 · 팬택 · 화웨이 · 현대오토에버 등
          <br />
          국내외 최고 기업의 현장 경험을 담은 실전 교육
        </p>

        <p className="text-base text-gray-400 mb-12 max-w-2xl mx-auto">
          방통위 · KCA · 행안부 · KT · SKT · LGU+ · 서울대 · KAIST 등<br />
          정부기관과 대학에서 신뢰하는 강의
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a
            href="#courses"
            className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-lg px-10 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-500/30 hover:shadow-2xl active:scale-95"
          >
            강의 과정 보기
          </a>
          <a
            href="#register"
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-lg px-10 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            수강 신청하기
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { number: '25+', label: '년 강의 경력' },
            { number: '5,000+', label: '수강생 배출' },
            { number: '30+', label: '주요 기관 강의' },
            { number: '5개', label: '전문 과정 운영' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-amber-400 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
