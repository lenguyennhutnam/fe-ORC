export type EnabledOrDisabled = {
  enabled?: boolean
}

export type MoreLikeThis = EnabledOrDisabled

export type OpeningStatement = EnabledOrDisabled & {
  opening_statement?: string
  suggested_questions?: string[]
}

export type SuggestedQuestionsAfterAnswer = EnabledOrDisabled

export type TextToSpeech = EnabledOrDisabled & {
  language?: string
  voice?: string
  autoPlay?: any
}

export type SpeechToText = EnabledOrDisabled

export type RetrieverResource = EnabledOrDisabled

export type SensitiveWordAvoidance = EnabledOrDisabled & {
  type?: string
  config?: any
}

export type FileUpload = {
  image?: EnabledOrDisabled & {
    detail?: any
    number_limits?: number
    transfer_methods?: any
  }
  allowed_file_types?: string[]
  allowed_file_extensions?: string[]
  allowed_file_upload_methods?: any
  number_limits?: number
  fileUploadConfig?: any
} & EnabledOrDisabled

export type AnnotationReplyConfig = {
  enabled: boolean
  id?: string
  score_threshold?: number
  embedding_model?: {
    embedding_provider_name: string
    embedding_model_name: string
  }
}

export enum FeatureEnum {
  moreLikeThis = 'moreLikeThis',
  opening = 'opening',
  suggested = 'suggested',
  text2speech = 'text2speech',
  speech2text = 'speech2text',
  citation = 'citation',
  moderation = 'moderation',
  file = 'file',
  annotationReply = 'annotationReply',
}

export type Features = {
  [FeatureEnum.moreLikeThis]?: MoreLikeThis
  [FeatureEnum.opening]?: OpeningStatement
  [FeatureEnum.suggested]?: SuggestedQuestionsAfterAnswer
  [FeatureEnum.text2speech]?: TextToSpeech
  [FeatureEnum.speech2text]?: SpeechToText
  [FeatureEnum.citation]?: RetrieverResource
  [FeatureEnum.moderation]?: SensitiveWordAvoidance
  [FeatureEnum.file]?: FileUpload
  [FeatureEnum.annotationReply]?: AnnotationReplyConfig
}

export type OnFeaturesChange = (features?: Features) => void

export enum ControlMode {
  Pointer = 'pointer',
  Hand = 'hand',
}
export enum ErrorHandleMode {
  Terminated = 'terminated',
  ContinueOnError = 'continue-on-error',
  RemoveAbnormalOutput = 'remove-abnormal-output',
}
export type Branch = {
  id: string
  name: string
}

export type CommonNodeType<T = {}> = {
  _connectedSourceHandleIds?: string[]
  _connectedTargetHandleIds?: string[]
  _targetBranches?: Branch[]
  _isSingleRun?: boolean
  _runningStatus?: NodeRunningStatus
  _runningBranchId?: string
  _singleRunningStatus?: NodeRunningStatus
  _isCandidate?: boolean
  _isBundled?: boolean
  _children?: { nodeId: string; nodeType: BlockEnum }[]
  _isEntering?: boolean
  _showAddVariablePopup?: boolean
  _holdAddVariablePopup?: boolean
  _iterationLength?: number
  _iterationIndex?: number
  _inParallelHovering?: boolean
  _waitingRun?: boolean
  _retryIndex?: number
  isInIteration?: boolean
  iteration_id?: string
  selected?: boolean
  title: string
  desc: string
  type: BlockEnum
  width?: number
  height?: number
  _loopLength?: number
  _loopIndex?: number
  isInLoop?: boolean
  loop_id?: string
  error_strategy?: ErrorHandleTypeEnum
  retry_config?: WorkflowRetryConfig
  default_value?: DefaultValueForm[]
} & T & Partial<Pick<ToolDefaultValue, 'provider_id' | 'provider_type' | 'provider_name' | 'tool_name'>>

export type CommonEdgeType = {
  _hovering?: boolean
  _connectedNodeIsHovering?: boolean
  _connectedNodeIsSelected?: boolean
  _isBundled?: boolean
  _sourceRunningStatus?: NodeRunningStatus
  _targetRunningStatus?: NodeRunningStatus
  _waitingRun?: boolean
  isInIteration?: boolean
  iteration_id?: string
  isInLoop?: boolean
  loop_id?: string
  sourceType: BlockEnum
  targetType: BlockEnum
}

export type Node<T = {}> = ReactFlowNode<CommonNodeType<T>>
export type SelectedNode = Pick<Node, 'id' | 'data'>
export type NodeProps<T = unknown> = { id: string; data: CommonNodeType<T> }
export type NodePanelProps<T> = {
  id: string
  data: CommonNodeType<T>
}
export type Edge = ReactFlowEdge<CommonEdgeType>

export type WorkflowDataUpdater = {
  nodes: Node[]
  edges: Edge[]
  viewport: Viewport
}

export type ValueSelector = string[] // [nodeId, key | obj key path]

export type Variable = {
  variable: string
  label?: string | {
    nodeType: BlockEnum
    nodeName: string
    variable: string
  }
  value_selector: ValueSelector
  variable_type?: VarKindType
  value?: string
  options?: string[]
  required?: boolean
  isParagraph?: boolean
}

export type EnvironmentVariable = {
  id: string
  name: string
  value: any
  value_type: 'string' | 'number' | 'secret'
}

export type ConversationVariable = {
  id: string
  name: string
  value_type: ChatVarType
  value: any
  description: string
}

export type GlobalVariable = {
  name: string
  value_type: 'string' | 'number'
  description: string
}

export type VariableWithValue = {
  key: string
  value: string
}

export enum InputVarType {
  textInput = 'text-input',
  paragraph = 'paragraph',
  select = 'select',
  number = 'number',
  url = 'url',
  files = 'files',
  json = 'json', // obj, array
  contexts = 'contexts', // knowledge retrieval
  iterator = 'iterator', // iteration input
  singleFile = 'file',
  multiFiles = 'file-list',
  loop = 'loop', // loop input
}

export type InputVar = {
  type: InputVarType
  label: string | {
    nodeType: BlockEnum
    nodeName: string
    variable: string
    isChatVar?: boolean
  }
  variable: string
  max_length?: number
  default?: string
  required: boolean
  hint?: string
  options?: string[]
  value_selector?: ValueSelector
} & Partial<UploadFileSetting>

export type ModelConfig = {
  provider: string
  name: string
  mode: string
  completion_params: Record<string, any>
}

export enum PromptRole {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}

export enum EditionType {
  basic = 'basic',
  jinja2 = 'jinja2',
}

export type PromptItem = {
  id?: string
  role?: PromptRole
  text: string
  edition_type?: EditionType
  jinja2_text?: string
}

export enum MemoryRole {
  user = 'user',
  assistant = 'assistant',
}

export type RolePrefix = {
  user: string
  assistant: string
}

export type Memory = {
  role_prefix?: RolePrefix
  window: {
    enabled: boolean
    size: number | string | null
  }
  query_prompt_template: string
}

export enum VarType {
  string = 'string',
  number = 'number',
  secret = 'secret',
  boolean = 'boolean',
  object = 'object',
  file = 'file',
  array = 'array',
  arrayString = 'array[string]',
  arrayNumber = 'array[number]',
  arrayObject = 'array[object]',
  arrayFile = 'array[file]',
  any = 'any',
}

export enum ValueType {
  variable = 'variable',
  constant = 'constant',
}

export type Var = {
  variable: string
  type: VarType
  children?: Var[] | StructuredOutput // if type is obj, has the children struct
  isParagraph?: boolean
  isSelect?: boolean
  options?: string[]
  required?: boolean
  des?: string
  isException?: boolean
  isLoopVariable?: boolean
  nodeId?: string
}

export type NodeOutPutVar = {
  nodeId: string
  title: string
  vars: Var[]
  isStartNode?: boolean
  isLoop?: boolean
}

export type Block = {
  classification?: string
  type: BlockEnum
  title: string
  description?: string
}

export type NodeDefault<T> = {
  defaultValue: Partial<T>
  getAvailablePrevNodes: (isChatMode: boolean) => BlockEnum[]
  getAvailableNextNodes: (isChatMode: boolean) => BlockEnum[]
  checkValid: (payload: T, t: any, moreDataForCheckValid?: any) => { isValid: boolean; errorMessage?: string }
}

export type OnSelectBlock = (type: BlockEnum, toolDefaultValue?: ToolDefaultValue) => void

export enum WorkflowRunningStatus {
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Stopped = 'stopped',
}

export enum WorkflowVersion {
  Draft = 'draft',
  Latest = 'latest',
}

export enum NodeRunningStatus {
  NotStart = 'not-start',
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Exception = 'exception',
  Retry = 'retry',
}

export type OnNodeAdd = (
  newNodePayload: {
    nodeType: BlockEnum
    sourceHandle?: string
    targetHandle?: string
    toolDefaultValue?: ToolDefaultValue
  },
  oldNodesPayload: {
    prevNodeId?: string
    prevNodeSourceHandle?: string
    nextNodeId?: string
    nextNodeTargetHandle?: string
  }
) => void

export type CheckValidRes = {
  isValid: boolean
  errorMessage?: string
}

export type RunFile = {
  type: string
  transfer_method: TransferMethod[]
  url?: string
  upload_file_id?: string
  related_id?: string
}

export type WorkflowRunningData = {
  task_id?: string
  message_id?: string
  conversation_id?: string
  result: {
    sequence_number?: number
    workflow_id?: string
    inputs?: string
    process_data?: string
    outputs?: string
    status: string
    error?: string
    elapsed_time?: number
    total_tokens?: number
    created_at?: number
    created_by?: string
    finished_at?: number
    steps?: number
    showSteps?: boolean
    total_steps?: number
    files?: FileResponse[]
    exceptions_count?: number
  }
  tracing?: NodeTracing[]
}

export type HistoryWorkflowData = {
  id: string
  sequence_number: number
  status: string
  conversation_id?: string
}

export enum ChangeType {
  changeVarName = 'changeVarName',
  remove = 'remove',
}

export type MoreInfo = {
  type: ChangeType
  payload?: {
    beforeKey: string
    afterKey?: string
  }
}

export type ToolWithProvider = Collection & {
  tools: Tool[]
}

export enum SupportUploadFileTypes {
  image = 'image',
  document = 'document',
  audio = 'audio',
  video = 'video',
  custom = 'custom',
}

export type UploadFileSetting = {
  allowed_file_upload_methods: TransferMethod[]
  allowed_file_types: SupportUploadFileTypes[]
  allowed_file_extensions?: string[]
  max_length: number
  number_limits?: number
}

export type VisionSetting = {
  variable_selector: ValueSelector
  detail: Resolution
}

export enum WorkflowVersionFilterOptions {
  all = 'all',
  onlyYours = 'onlyYours',
}

export enum VersionHistoryContextMenuOptions {
  restore = 'restore',
  edit = 'edit',
  delete = 'delete',
}

export type FileUploadConfigResponse = {
  batch_count_limit: number
  image_file_size_limit?: number | string // default is 10MB
  file_size_limit: number // default is 15MB
  audio_file_size_limit?: number // default is 50MB
  video_file_size_limit?: number // default is 100MB
  workflow_file_upload_limit?: number // default is 10
}
