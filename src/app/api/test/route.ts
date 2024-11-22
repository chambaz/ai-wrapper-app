import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase.from('test').select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('data', data)

    return NextResponse.json({ data })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
