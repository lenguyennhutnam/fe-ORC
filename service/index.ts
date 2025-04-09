import type { IOnCompleted, IOnData, IOnError, IOnFile, IOnMessageEnd, IOnMessageReplace, IOnNodeFinished, IOnNodeStarted, IOnThought, IOnWorkflowFinished, IOnWorkflowStarted } from './base'
import { get, post, ssePost } from './base'
import type { Feedbacktype } from '@/types/app'

export const sendChatMessage = async (
  body: Record<string, any>,
  {
    onData,
    onCompleted,
    onThought,
    onFile,
    onError,
    getAbortController,
    onMessageEnd,
    onMessageReplace,
    onWorkflowStarted,
    onNodeStarted,
    onNodeFinished,
    onWorkflowFinished,
  }: {
    onData: IOnData
    onCompleted: IOnCompleted
    onFile: IOnFile
    onThought: IOnThought
    onMessageEnd: IOnMessageEnd
    onMessageReplace: IOnMessageReplace
    onError: IOnError
    getAbortController?: (abortController: AbortController) => void
    onWorkflowStarted: IOnWorkflowStarted
    onNodeStarted: IOnNodeStarted
    onNodeFinished: IOnNodeFinished
    onWorkflowFinished: IOnWorkflowFinished
  },
) => {
  console.log(body)
  return ssePost('chat-messages', {
    body: {
      ...body,
      response_mode: 'streaming',
    },
  }, { onData, onCompleted, onThought, onFile, onError, getAbortController, onMessageEnd, onMessageReplace, onNodeStarted, onWorkflowStarted, onWorkflowFinished, onNodeFinished })
}

// export const fetchConversations = async () => {
//   return get('conversations', { params: { limit: 100, first_id: '' } })
// }

export const fetchChatList = async (conversationId: string) => {
  return get('messages', { params: { conversation_id: conversationId, limit: 20, last_id: '' } })
}

const getMethod = async (url: string) => {
  console.log(`https://api.dify.ai/v1/${url}`)
  const res = await fetch(`https://api.dify.ai/v1/${url}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_APP_KEY}`, // lấy từ biến môi trường
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok)
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)

  const data = await res.json()
  return data
}

// init value. wait for server update
export const fetchAppParams = async () => {
  const res = await getMethod('parameters')
  return res
}

export const fetchAppMeta = async () => {
  const res = await getMethod('meta')
  return res
}

export const fetchConversations = async () => {
  const res = await fetch('/api/conversations', {
    method: 'GET',
  })

  const data = await res.json()
  console.log(data)
  // return get('conversations', { params: { limit: 100, first_id: '' } })
  // const res = await getMethod(`conversations?user=${user || '2b9635a4-f466-42dc-8a9f-dbb0fdefa6e3'}&last_id=${last_id || ''}&limit=${limit || 20}`)
  return data
}

export const updateFeedback = async ({ url, body }: { url: string; body: Feedbacktype }) => {
  return post(url, { body })
}

export const generationConversationName = async (id: string) => {
  return post(`conversations/${id}/name`, { body: { auto_generate: true } })
}
