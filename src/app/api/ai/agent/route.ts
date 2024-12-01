import { anthropic } from '@ai-sdk/anthropic'
import { generateText, tool } from 'ai'
import * as mathjs from 'mathjs'
import { z } from 'zod'

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json()

  const { text, steps } = await generateText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    tools: {
      calculate: tool({
        description:
          'A tool for evaluating mathematical expressions. ' +
          'Example expressions: ' +
          "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
        parameters: z.object({ expression: z.string() }),
        execute: async ({ expression }) => mathjs.evaluate(expression),
      }),
      webScrape: tool({
        description: 'A tool for web scraping.',
        parameters: z.object({ url: z.string() }),
        execute: async ({ url }) => {
          const response = await fetch(url)
          const text = await response.text()
          return text
        },
      }),
    },
    maxSteps: 10,
    system:
      'You are solving math problems. ' +
      'Reason step by step. ' +
      'Use the calculator when necessary. ' +
      'When you give the final answer, ' +
      'provide an explanation for how you arrived at it.',
    prompt,
  })

  const formattedSteps = steps.map((step, index) => ({
    index: index + 1,
    stepType: step.stepType,
    text: step.text,
    toolCalls: step.toolCalls.map((toolCall) => ({
      toolName: toolCall.toolName,
      args: toolCall.args,
    })),
  }))

  return Response.json({ text, steps: formattedSteps })
}
