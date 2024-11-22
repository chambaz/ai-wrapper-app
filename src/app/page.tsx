import { Demo } from '@/components/demo'

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-16 h-screen gap-8">
      <h1 className="text-6xl font-bold">Hello World</h1>
      <Demo />
    </div>
  )
}
