import type {
  VisionFile,
  VisionSettings,
} from '@/types/app'
import type { NodeTracing } from '@/types/workflow'
import type { FileEntity } from '@/app/components/base/file-uploader/types'

export type { VisionFile } from '@/types/app'
export { TransferMethod } from '@/types/app'

export type UserInputForm = {
  default: string
  label: string
  required: boolean
  variable: string
}

export type UserInputFormTextInput = {
  'text-input': UserInputForm & {
    max_length: number
  }
}

export type UserInputFormSelect = {
  select: UserInputForm & {
    options: string[]
  }
}

export type UserInputFormParagraph = {
  paragraph: UserInputForm
}

export type VisionConfig = VisionSettings

export type EnableType = {
  enabled: boolean
}

export type ChatConfig = Omit<any, 'model'> & {
  supportAnnotation?: boolean
  appId?: string
  supportFeedback?: boolean
  supportCitationHitInfo?: boolean
}

export type WorkflowProcess = {
  status: any
  tracing: NodeTracing[]
  expand?: boolean // for UI
  resultText?: string
  files?: FileEntity[]
}

export type ChatItem = IChatItem & {
  isError?: boolean
  workflowProcess?: WorkflowProcess
  conversationId?: string
  allFiles?: FileEntity[]
}

export type ChatItemInTree = {
  children?: ChatItemInTree[]
} & ChatItem

export type OnSend = {
  (message: string, files?: FileEntity[]): void
  (message: string, files: FileEntity[] | undefined, isRegenerate: boolean, lastAnswer?: ChatItem | null): void
}

export type OnRegenerate = (chatItem: ChatItem) => void

export type Callback = {
  onSuccess: () => void
}

export type Feedback = {
  rating: 'like' | 'dislike' | null
}

export type LogAnnotation = {
  content: string
  account: {
    id: string
    name: string
    email: string
  }
  created_at: number
}

export type Annotation = {
  id: string
  authorName: string
  logAnnotation?: LogAnnotation
  created_at?: number
}

export const MessageRatings = ['like', 'dislike', null] as const
export type MessageRating = typeof MessageRatings[number]

export type MessageMore = {
  time: string
  tokens: number
  latency: number | string
}

export type Feedbacktype = {
  rating: MessageRating
  content?: string | null
}

export type FeedbackFunc = (messageId: string, feedback: Feedbacktype) => Promise<any>
export type SubmitAnnotationFunc = (messageId: string, content: string) => Promise<any>

export type DisplayScene = 'web' | 'console'

export type ToolInfoInThought = {
  name: string
  input: string
  output: string
  isFinished: boolean
}

export type ThoughtItem = {
  id: string
  tool: string // plugin or dataset. May has multi.
  thought: string
  tool_input: string
  message_id: string
  observation: string
  position: number
  files?: string[]
  message_files?: VisionFile[]
}

export type CitationItem = {
  content: string
  data_source_type: string
  dataset_name: string
  dataset_id: string
  document_id: string
  document_name: string
  hit_count: number
  index_node_hash: string
  segment_id: string
  segment_position: number
  score: number
  word_count: number
}

export type MessageEnd = {
  id: string
  metadata: {
    retriever_resources?: CitationItem[]
    annotation_reply: {
      id: string
      account: {
        id: string
        name: string
      }
    }
  }
}

export type MessageReplace = {
  id: string
  task_id: string
  answer: string
  conversation_id: string
}

export type AnnotationReply = {
  id: string
  task_id: string
  answer: string
  conversation_id: string
  annotation_id: string
  annotation_author_name: string
}
export type IChatItem = {
  id: string
  content: string
  citation?: CitationItem[]
  /**
   * Specific message type
   */
  isAnswer: boolean
  /**
   * The user feedback result of this message
   */
  feedback?: any
  /**
   * The admin feedback result of this message
   */
  adminFeedback?: any
  /**
   * Whether to hide the feedback area
   */
  feedbackDisabled?: boolean
  /**
   * More information about this message
   */
  more?: MessageMore
  annotation?: Annotation
  useCurrentUserAvatar?: boolean
  isOpeningStatement?: boolean
  suggestedQuestions?: string[]
  log?: { role: string; text: string; files?: FileEntity[] }[]
  agent_thoughts?: ThoughtItem[]
  message_files?: FileEntity[]
  workflow_run_id?: string
  // for agent log
  conversationId?: string
  input?: any
  parentMessageId?: string | null
  siblingCount?: number
  siblingIndex?: number
  prevSibling?: string
  nextSibling?: string
}
