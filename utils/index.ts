import { escape } from 'lodash-es'
import { type ValueSelector } from '@/config/types'
import { SupportUploadFileTypes } from '@/app/components/base/file-uploader/file-uploader-in-chat-input/file-list'
import { post } from '@/service/base'

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function asyncRunSafe<T = any>(fn: Promise<T>): Promise<[Error] | [null, T]> {
  try {
    return [null, await fn]
  }
  catch (e: any) {
    return [e || new Error('unknown error')]
  }
}

export const getTextWidthWithCanvas = (text: string, font?: string) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.font = font ?? '12px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
    return Number(ctx.measureText(text).width.toFixed(2))
  }
  return 0
}

const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'

export function randomString(length: number) {
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export const getPurifyHref = (href: string) => {
  if (!href)
    return ''

  return escape(href)
}

export async function fetchWithRetry<T = any>(fn: Promise<T>, retries = 3): Promise<[Error] | [null, T]> {
  const [error, res] = await asyncRunSafe(fn)
  if (error) {
    if (retries > 0) {
      const res = await fetchWithRetry(fn, retries - 1)
      return res
    }
    else {
      if (error instanceof Error)
        return [error]
      return [new Error('unknown error')]
    }
  }
  else {
    return [null, res]
  }
}

export const correctModelProvider = (provider: string) => {
  if (!provider)
    return ''

  if (provider.includes('/'))
    return provider

  if (['google'].includes(provider))
    return 'langgenius/gemini/google'

  return `langgenius/${provider}/${provider}`
}

export const correctToolProvider = (provider: string, toolInCollectionList?: boolean) => {
  if (!provider)
    return ''

  if (toolInCollectionList)
    return provider

  if (provider.includes('/'))
    return provider

  if (['stepfun', 'jina', 'siliconflow', 'gitee_ai'].includes(provider))
    return `langgenius/${provider}_tool/${provider}`

  return `langgenius/${provider}/${provider}`
}

export const canFindTool = (providerId: string, oldToolId?: string) => {
  return providerId === oldToolId
    || providerId === `langgenius/${oldToolId}/${oldToolId}`
    || providerId === `langgenius/${oldToolId}_tool/${oldToolId}`
}

export const removeSpecificQueryParam = (key: string | string[]) => {
  const url = new URL(window.location.href)
  if (Array.isArray(key))
    key.forEach(k => url.searchParams.delete(k))
  else
    url.searchParams.delete(key)
  window.history.replaceState(null, '', url.toString())
}

export const removeAccessToken = () => {
  const sharedToken = globalThis.location.pathname.split('/').slice(-1)[0]

  const accessToken = localStorage.getItem('token') || JSON.stringify({ [sharedToken]: '' })
  let accessTokenJson = { [sharedToken]: '' }
  try {
    accessTokenJson = JSON.parse(accessToken)
  }
  catch (e) {

  }

  localStorage.removeItem('conversationIdInfo')

  delete accessTokenJson[sharedToken]
  localStorage.setItem('token', JSON.stringify(accessTokenJson))
}

export const CONTEXT_PLACEHOLDER_TEXT = '{{#context#}}'
export const HISTORY_PLACEHOLDER_TEXT = '{{#histories#}}'
export const QUERY_PLACEHOLDER_TEXT = '{{#query#}}'
export const PRE_PROMPT_PLACEHOLDER_TEXT = '{{#pre_prompt#}}'
export const UPDATE_DATASETS_EVENT_EMITTER = 'prompt-editor-context-block-update-datasets'
export const UPDATE_HISTORY_EVENT_EMITTER = 'prompt-editor-history-block-update-role'

export const checkHasContextBlock = (text: string) => {
  if (!text)
    return false
  return text.includes(CONTEXT_PLACEHOLDER_TEXT)
}

export const checkHasHistoryBlock = (text: string) => {
  if (!text)
    return false
  return text.includes(HISTORY_PLACEHOLDER_TEXT)
}

export const checkHasQueryBlock = (text: string) => {
  if (!text)
    return false
  return text.includes(QUERY_PLACEHOLDER_TEXT)
}

/*
* {{#1711617514996.name#}} => [1711617514996, name]
* {{#1711617514996.sys.query#}} => [sys, query]
*/
export const getInputVars = (text: string): ValueSelector[] => {
  if (!text)
    return []

  const allVars = text.match(/{{#([^#]*)#}}/g)
  if (allVars && allVars?.length > 0) {
    // {{#context#}}, {{#query#}} is not input vars
    const inputVars = allVars
      .filter(item => item.includes('.'))
      .map((item) => {
        const valueSelector = item.replace('{{#', '').replace('#}}', '').split('.')
        if (valueSelector[1] === 'sys' && /^\d+$/.test(valueSelector[0]))
          return valueSelector.slice(1)

        return valueSelector
      })
    return inputVars
  }
  return []
}

export const FILE_EXTS: Record<string, string[]> = {
  [SupportUploadFileTypes.image]: ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'SVG'],
  [SupportUploadFileTypes.document]: ['TXT', 'MD', 'MDX', 'MARKDOWN', 'PDF', 'HTML', 'XLSX', 'XLS', 'DOC', 'DOCX', 'CSV', 'EML', 'MSG', 'PPTX', 'PPT', 'XML', 'EPUB'],
  [SupportUploadFileTypes.audio]: ['MP3', 'M4A', 'WAV', 'WEBM', 'AMR', 'MPGA'],
  [SupportUploadFileTypes.video]: ['MP4', 'MOV', 'MPEG', 'MPGA'],
}

export const uploadRemoteFileInfo = (url: string, isPublic?: boolean) => {
  return post<{ id: string; name: string; size: number; mime_type: string; url: string }>('/remote-files/upload', { body: { url } }, { isPublicAPI: isPublic })
}
