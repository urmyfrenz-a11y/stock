export default function Footer() {
  return (
    <footer className="bg-[#0f1a33] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IT</span>
              </div>
              <span className="text-white font-bold text-lg">IT 전문 강사</span>
            </div>
            <p className="text-sm leading-relaxed">
              25년 이상의 현장 경험을 바탕으로<br />
              정부기관, 통신사, 대기업에서 신뢰받는<br />
              ICT 분야 전문 강사입니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">바로가기</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: '강의 소개', href: '#about' },
                { label: '강의 특장점', href: '#why' },
                { label: '강의 과정', href: '#courses' },
                { label: '수강 신청', href: '#register' },
                { label: '수강 내역', href: '#my-registrations' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-amber-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-white font-semibold mb-4">강의 과정</h4>
            <ul className="space-y-2 text-sm">
              {[
                'LTE/5G 이동통신 기술 과정',
                'IoT 사물인터넷 실무 과정',
                'TCP/IP 네트워크 기초/심화',
                'Gen AI 생성형 AI 활용 과정',
                'Data Science 데이터 분석 과정',
              ].map((course) => (
                <li key={course}>
                  <a href="#courses" className="hover:text-amber-400 transition-colors">
                    {course}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2025 IT 전문 강사. All rights reserved.</p>
          <p className="text-gray-500">
            삼성전자 · KTF · 모토로라 · 팬택 · 화웨이 · 현대오토에버 출신
          </p>
        </div>
      </div>
    </footer>
  )
}
