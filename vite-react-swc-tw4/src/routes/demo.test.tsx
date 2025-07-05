import { createFileRoute } from '@tanstack/react-router'

function ChatPage() {
  return <div>test page</div>
}

export const Route = createFileRoute('/demo/test')({
  component: ChatPage,
})
