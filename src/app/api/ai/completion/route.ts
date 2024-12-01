import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json()

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    system: 'You are a helpful assistant.',
    prompt,
  })

  return result.toDataStreamResponse()
}
