import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import WhySection from '@/components/WhySection'
import CoursesSection from '@/components/CoursesSection'
import RegistrationForm from '@/components/RegistrationForm'
import MyRegistrations from '@/components/MyRegistrations'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16">
        <HeroSection />
        <WhySection />
        <CoursesSection />
        <RegistrationForm />
        <MyRegistrations />
        <Footer />
      </div>
    </main>
  )
}
