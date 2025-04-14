import type {
  IOnCompleted,
  IOnData,
  IOnError,
  IOnIterationFinished,
  IOnIterationNext,
  IOnIterationStarted,
  IOnLoopFinished,
  IOnLoopNext,
  IOnLoopStarted,
  IOnMessageReplace,
  IOnNodeFinished,
  IOnNodeStarted,
  IOnTextChunk,
  IOnTextReplace,
  IOnWorkflowFinished,
  IOnWorkflowStarted,
} from './base'
import {
  del as consoleDel, get as consoleGet, patch as consolePatch, post as consolePost,
  delPublic as del, getPublic as get, patchPublic as patch, postPublic as post, ssePost,
} from './base'

function getAction(action: 'get' | 'post' | 'del' | 'patch', isInstalledApp: boolean) {
  switch (action) {
    case 'get':
      return isInstalledApp ? consoleGet : get
    case 'post':
      return isInstalledApp ? consolePost : post
    case 'patch':
      return isInstalledApp ? consolePatch : patch
    case 'del':
      return isInstalledApp ? consoleDel : del
  }
}

export function getUrl(url: string) {
  console.log(url.startsWith('/') ? url.slice(1) : url)
  return url.startsWith('/') ? url.slice(1) : url
  // console.log(isInstalledApp ? `installed-apps/${installedAppId}/${url.startsWith('/') ? url.slice(1) : url}` : url)
  // return isInstalledApp ? `abc/${installedAppId}/${url.startsWith('/') ? url.slice(1) : url}` : url
}

// export const sendChatMessage = async (body: Record<string, any>, { onData, onCompleted, onThought, onFile, onError, getAbortController, onMessageEnd, onMessageReplace, onTTSChunk, onTTSEnd }: {
//   onData: IOnData
//   onCompleted: IOnCompleted
//   onFile: IOnFile
//   onThought: IOnThought
//   onError: IOnError
//   onMessageEnd?: IOnMessageEnd
//   onMessageReplace?: IOnMessageReplace
//   getAbortController?: (abortController: AbortController) => void
//   onTTSChunk?: IOnTTSChunk
//   onTTSEnd?: IOnTTSEnd
// }, isInstalledApp: boolean, installedAppId = '') => {
//   console.log('abc')
//   return ssePost(getUrl('chat-messages'), {
//     body: {
//       ...body,
//       response_mode: 'streaming',
//     },
//   }, { onData, onCompleted, onThought, onFile, isPublicAPI: !isInstalledApp, onError, getAbortController, onMessageEnd, onMessageReplace, onTTSChunk, onTTSEnd })
// }

export const stopChatMessageResponding = async (appId: string, taskId: string, isInstalledApp: boolean, installedAppId = '') => {
  return getAction('post', isInstalledApp)(getUrl(`chat-messages/${taskId}/stop`))
}

export const sendCompletionMessage = async (body: Record<string, any>, { onData, onCompleted, onError, onMessageReplace }: {
  onData: IOnData
  onCompleted: IOnCompleted
  onError: IOnError
  onMessageReplace: IOnMessageReplace
}, isInstalledApp: boolean, installedAppId = '') => {
  return ssePost(getUrl('completion-messages'), {
    body: {
      ...body,
      response_mode: 'streaming',
    },
  }, { onData, onCompleted, isPublicAPI: !isInstalledApp, onError, onMessageReplace })
}

export const sendWorkflowMessage = async (
  body: Record<string, any>,
  {
    onWorkflowStarted,
    onNodeStarted,
    onNodeFinished,
    onWorkflowFinished,
    onIterationStart,
    onIterationNext,
    onIterationFinish,
    onLoopStart,
    onLoopNext,
    onLoopFinish,
    onTextChunk,
    onTextReplace,
  }: {
    onWorkflowStarted: IOnWorkflowStarted
    onNodeStarted: IOnNodeStarted
    onNodeFinished: IOnNodeFinished
    onWorkflowFinished: IOnWorkflowFinished
    onIterationStart: IOnIterationStarted
    onIterationNext: IOnIterationNext
    onIterationFinish: IOnIterationFinished
    onLoopStart: IOnLoopStarted
    onLoopNext: IOnLoopNext
    onLoopFinish: IOnLoopFinished
    onTextChunk: IOnTextChunk
    onTextReplace: IOnTextReplace
  },
  isInstalledApp: boolean,
  installedAppId = '',
) => {
  return ssePost(getUrl('workflows/run'), {
    body: {
      ...body,
      response_mode: 'streaming',
    },
  }, {
    onNodeStarted,
    onWorkflowStarted,
    onWorkflowFinished,
    isPublicAPI: !isInstalledApp,
    onNodeFinished,
    onIterationStart,
    onIterationNext,
    onIterationFinish,
    onLoopStart,
    onLoopNext,
    onLoopFinish,
    onTextChunk,
    onTextReplace,
  })
}

export const fetchAppInfo = async () => {
  return get('/site') as Promise<any>
}

// export const fetchConversations = async (isInstalledApp: boolean, installedAppId = '', last_id?: string, pinned?: boolean, limit?: number) => {
//   return getAction('get', isInstalledApp)(getUrl('conversations'), { params: { ...{ limit: limit || 20 }, ...(last_id ? { last_id } : {}), ...(pinned !== undefined ? { pinned } : {}) } }) as Promise<any>
// }

export const pinConversation = async (isInstalledApp: boolean, installedAppId = '', id: string) => {
  console.log(231)
  return getAction('patch', isInstalledApp)(getUrl(`conversations/${id}/pin`))
}

export const unpinConversation = async (isInstalledApp: boolean, installedAppId = '', id: string) => {
  console.log(231)
  return getAction('patch', isInstalledApp)(getUrl(`conversations/${id}/unpin`))
}

export const delConversation = async (isInstalledApp: boolean, installedAppId = '', id: string) => {
  console.log(231)
  return getAction('del', isInstalledApp)(getUrl(`conversations/${id}`))
}

export const renameConversation = async (isInstalledApp: boolean, installedAppId = '', id: string, name: string) => {
  console.log(231)
  return getAction('post', isInstalledApp)(getUrl(`conversations/${id}/name`), { body: { name } })
}

export const generationConversationName = async (isInstalledApp: boolean, installedAppId = '', id: string) => {
  console.log(231)
  return getAction('post', isInstalledApp)(getUrl(`conversations/${id}/name`), { body: { auto_generate: true } }) as Promise<any>
}

export const fetchChatList = async (conversationId: string, isInstalledApp: boolean, installedAppId = '') => {
  return getAction('get', isInstalledApp)(getUrl('messages'), { params: { conversation_id: conversationId, limit: 20, last_id: '' } }) as any
}

// Abandoned API interface
// export const fetchAppVariables = async () => {
//   return get(`variables`)
// }

// init value. wait for server update
// export const fetchAppParams = async (isInstalledApp: boolean, installedAppId = '') => {
//   return (getAction('get', isInstalledApp))(getUrl('parameters')) as Promise<ChatConfig>
// }

export const fetchSystemFeatures = async () => {
  return (getAction('get', false))(getUrl('system-features')) as Promise<any>
}

export const fetchWebSAMLSSOUrl = async (appCode: string, redirectUrl: string) => {
  return (getAction('get', false))(getUrl('/enterprise/sso/saml/login'), {
    params: {
      app_code: appCode,
      redirect_url: redirectUrl,
    },
  }) as Promise<{ url: string }>
}

export const fetchWebOIDCSSOUrl = async (appCode: string, redirectUrl: string) => {
  return (getAction('get', false))(getUrl('/enterprise/sso/oidc/login'), {
    params: {
      app_code: appCode,
      redirect_url: redirectUrl,
    },

  }) as Promise<{ url: string }>
}

export const fetchWebOAuth2SSOUrl = async (appCode: string, redirectUrl: string) => {
  return (getAction('get', false))(getUrl('/enterprise/sso/oauth2/login'), {
    params: {
      app_code: appCode,
      redirect_url: redirectUrl,
    },
  }) as Promise<{ url: string }>
}

export const fetchAppMeta = async (isInstalledApp: boolean, installedAppId = '') => {
  return (getAction('get', isInstalledApp))(getUrl('meta')) as Promise<any>
}

export const updateFeedback = async ({ url, body }: { url: string; body: any }, isInstalledApp: boolean, installedAppId = '') => {
  return (getAction('post', isInstalledApp))(getUrl(url), { body })
}

export const fetchMoreLikeThis = async (messageId: string, isInstalledApp: boolean, installedAppId = '') => {
  return (getAction('get', isInstalledApp))(getUrl(`/messages/${messageId}/more-like-this`), {
    params: {
      response_mode: 'blocking',
    },
  })
}

export const saveMessage = (messageId: string, isInstalledApp: boolean, installedAppId = '') => {
  return (getAction('post', isInstalledApp))(getUrl('/saved-messages'), { body: { message_id: messageId } })
}

export const fetchSavedMessage = async (isInstalledApp: boolean, installedAppId = '') => {
  return (getAction('get', isInstalledApp))(getUrl('/saved-messages'))
}

export const removeMessage = (messageId: string, isInstalledApp: boolean, installedAppId = '') => {
  return (getAction('del', isInstalledApp))(getUrl(`/saved-messages/${messageId}`))
}

export const fetchSuggestedQuestions = (messageId: string, isInstalledApp: boolean, installedAppId = '') => {
  return (getAction('get', isInstalledApp))(getUrl(`/messages/${messageId}/suggested-questions`))
}

export const audioToText = (url: string, isPublicAPI: boolean, body: FormData) => {
  return (getAction('post', !isPublicAPI))(url, { body }, { bodyStringify: false, deleteContentType: true }) as Promise<{ text: string }>
}

export const textToAudio = (url: string, isPublicAPI: boolean, body: FormData) => {
  return (getAction('post', !isPublicAPI))(url, { body }, { bodyStringify: false, deleteContentType: true }) as Promise<{ data: string }>
}

export const textToAudioStream = (url: string, isPublicAPI: boolean, header: { content_type: string }, body: { streaming: boolean; voice?: string; message_id?: string; text?: string | null | undefined }) => {
  return (getAction('post', !isPublicAPI))(url, { body, header }, { needAllResponseContent: true })
}

export const fetchAccessToken = async (appCode: string, userId?: string) => {
  const headers = new Headers()
  headers.append('X-App-Code', appCode)
  const url = userId ? `/passport?user_id=${encodeURIComponent(userId)}` : '/passport'
  return get(url, { headers }) as Promise<{ access_token: string }>
}
