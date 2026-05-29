import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type CourseRegistration = {
  id: string
  name: string
  email: string
  phone: string
  course_id: string
  course_name: string
  price: number
  created_at: string
}
