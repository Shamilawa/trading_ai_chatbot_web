import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Check if any message has a PDF attachment
  const hasPDF = messages.some((message) =>
    message.experimental_attachments?.some((attachment) => attachment.contentType === "application/pdf"),
  )

  const result = streamText({
    model: anthropic("claude-3-5-sonnet-latest"),
    messages,
  })

  return result.toDataStreamResponse()
}
