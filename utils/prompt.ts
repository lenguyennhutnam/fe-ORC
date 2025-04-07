import type { UserInputFormItem } from '@/types/app'

export type PromptVariable = {
  key: string
  name: string
  type: string // "string" | "number" | "select",
  default?: string | number
  required?: boolean
  options?: string[]
  max_length?: number
  is_context_var?: boolean
  enabled?: boolean
  config?: Record<string, any>
  icon?: string
  icon_background?: string
}

export function replaceVarWithValues(str: string, promptVariables: PromptVariable[], inputs: Record<string, any>) {
  return str.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const name = inputs[key]
    if (name)
      return name

    const valueObj: PromptVariable | undefined = promptVariables.find(v => v.key === key)
    return valueObj ? `{{${valueObj.key}}}` : match
  })
}

export const userInputsFormToPromptVariables = (useInputs: UserInputFormItem[] | null) => {
  if (!useInputs)
    return []
  const promptVariables: PromptVariable[] = []
  useInputs.forEach((item: any) => {
    const isParagraph = !!item.paragraph

    const [type, content] = (() => {
      if (isParagraph)
        return ['paragraph', item.paragraph]

      if (item['text-input'])
        return ['string', item['text-input']]

      if (item.number)
        return ['number', item.number]

      if (item.file)
        return ['file', item.file]

      if (item['file-list'])
        return ['file-list', item['file-list']]

      if (item.external_data_tool)
        return [item.external_data_tool.type, item.external_data_tool]

      return ['select', item.select || {}]
    })()

    if (type === 'string' || type === 'paragraph') {
      promptVariables.push({
        key: content.variable,
        name: content.label,
        required: content.required,
        type,
        max_length: content.max_length,
        options: [],
      })
    }
    else if (type === 'number') {
      promptVariables.push({
        key: content.variable,
        name: content.label,
        required: content.required,
        type,
        options: [],
      })
    }
    else if (type === 'select') {
      promptVariables.push({
        key: content.variable,
        name: content.label,
        required: content.required,
        type: 'select',
        options: content.options,
      })
    }
    else if (type === 'file') {
      promptVariables.push({
        key: content.variable,
        name: content.label,
        required: content.required,
        type,
        config: {
          allowed_file_types: content.allowed_file_types,
          allowed_file_extensions: content.allowed_file_extensions,
          allowed_file_upload_methods: content.allowed_file_upload_methods,
          number_limits: 1,
        },
      })
    }
    else if (type === 'file-list') {
      promptVariables.push({
        key: content.variable,
        name: content.label,
        required: content.required,
        type,
        config: {
          allowed_file_types: content.allowed_file_types,
          allowed_file_extensions: content.allowed_file_extensions,
          allowed_file_upload_methods: content.allowed_file_upload_methods,
          number_limits: content.max_length,
        },
      })
    }
    else {
      promptVariables.push({
        key: content.variable,
        name: content.label,
        required: content.required,
        type: content.type,
        enabled: content.enabled,
        config: content.config,
        icon: content.icon,
        icon_background: content.icon_background,
      })
    }
  })
  return promptVariables
}

// export const userInputsFormToPromptVariables = (useInputs: UserInputFormItem[] | null) => {
//   // console.log(useInputs)
//   if (!useInputs)
//     return []
//   const promptVariables: PromptVariable[] = []
//   useInputs.forEach((item: any) => {
//     // console.log(item)
//     const isParagraph = !!item.paragraph
//     const [type, content] = (() => {
//       if (isParagraph)
//         return ['paragraph', item.paragraph]

//       if (item['text-input'])
//         return ['string', item['text-input']]

//       if (item.number)
//         return ['number', item.number]
//       if (item['file-list'])
//         return ['file-list', item['file-list']]
//       return ['select', item.select]
//     })()
//     // console.log('content')
//     // console.log(content)
//     // console.log('contentend')

//     if (type === 'string' || type === 'paragraph') {
//       promptVariables.push({
//         key: content.variable,
//         name: content.label,
//         required: content.required,
//         type,
//         max_length: content.max_length,
//         options: [],
//       })
//     }
//     else if (type === 'number') {
//       promptVariables.push({
//         key: content.variable,
//         name: content.label,
//         required: content.required,
//         type,
//         options: [],
//       })
//     }
//     else if (type === 'file-list') {
//       promptVariables.push({
//         key: content.variable,
//         name: content.label,
//         required: content.required,
//         type: 'select',
//         max_length: content.max_length,
//         options: content.options,
//       })
//     }
//     else {
//       promptVariables.push({
//         key: content.variable,
//         name: content.label,
//         required: content.required,
//         type: 'select',
//         options: content.options,
//       })
//     }
//   })
//   return promptVariables
// }
