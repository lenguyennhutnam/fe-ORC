'use client'
import type { FC, FormEvent } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiPlayLargeLine } from '@remixicon/react'
import TemplateVarPanel, { PanelTitle, VarOpBtnGroup } from '../value-panel'
import { FileUploaderInAttachmentWrapper } from '../base/file-uploader'
import { useChatWithHistoryContext } from '../base/context/context'
import Button from '../base/button/newBtn'
import TextGenerationImageUploader from '../base/image-uploader/text-generation-image-uploader'
import { getProcessedFiles } from '../base/file-uploader/utils'
import Textarea from '../base/textarea'
import Input from '../base/input'
import { AppInfoComp, ChatBtn, EditBtn, FootLogo, PromptTemplate } from './massive-component'
import type { AppInfo, PromptConfig, VisionSettings } from '@/types/app'
import Toast from '@/app/components/base/toast'
import Select from '@/app/components/base/select'
import { DEFAULT_VALUE_MAX_LEN } from '@/config'
import cn from '@/config/classnames'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
// regex to match the {{}} and replace it with a span
const regex = /\{\{([^}]+)\}\}/g

// export type IPromptValuePanelProps = {
//   appType: AppType
//   onSend?: () => void
//   inputs: any
//   visionConfig: VisionSettings
//   onVisionFilesChange: (files: VisionFile[]) => void
// }

export type IWelcomeProps = {
  inputRef: any
  inputs: any
  conversationName: string
  hasSetInputs: boolean
  isPublicVersion: boolean
  siteInfo: AppInfo
  promptConfig: PromptConfig
  onStartChat: (inputs: Record<string, any>) => void
  canEditInputs: boolean
  savedInputs: Record<string, any>
  onInputsChange: (inputs: Record<string, any>) => void
}

const Welcome: FC<any> = ({
  // visionConfig,
  conversationName,
  hasSetInputs,
  isPublicVersion,
  siteInfo,
  promptConfig,
  onStartChat,
  inputsRef,
  inputs,
  onVisionFilesChange,
  onSend,
  canEditInputs,
  savedInputs,
  onInputsChange,
}) => {
  const visionConfig: VisionSettings = {
    enabled: false,
    number_limits: 2,
    detail: 'low',
    transfer_methods: ['local_file'],
  }
  const { t } = useTranslation()
  const media = useBreakpoints()
  const isPC = media === MediaType.pc
  const onClear = () => {
    const newInputs: Record<string, any> = {}
    promptConfig.prompt_variables.forEach((item: any) => {
      newInputs[item.key] = ''
    })
    onInputsChange(newInputs)
  }
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSend()
  }
  const {
    appParams,
    inputsForms,
    currentConversationId,
    currentConversationInputs,
    setCurrentConversationInputs,
    newConversationInputs,
    newConversationInputsRef,
    handleNewConversationInputsChange,
  } = useChatWithHistoryContext()
  const inputsFormValue = currentConversationId ? currentConversationInputs : newConversationInputs
  const hasVar = promptConfig.prompt_variables.length > 0
  const [isFold, setIsFold] = useState<boolean>(true)
  // const [inputs, setInputs] = useState<Record<string, any>>((() => {
  //   if (hasSetInputs)
  //     return savedInputs

  //   const res: Record<string, any> = {}
  //   if (promptConfig) {
  //     promptConfig.prompt_variables.forEach((item: any) => {
  //       res[item.key] = ''
  //     })
  //   }
  //   return res
  // })())
  const handleInputsChange = useCallback((newInputs: Record<string, any>) => {
    onInputsChange(newInputs)
    inputsRef.current = newInputs
  }, [onInputsChange, inputsRef])

  useEffect(() => {
    const newInputs: Record<string, any> = {}
    promptConfig.prompt_variables.forEach((item: any) => {
      newInputs[item.key] = ''
    })
    onInputsChange(newInputs)
  }, [promptConfig.prompt_variables])

  // useEffect(() => {
  //   if (!savedInputs) {
  //     const res: Record<string, any> = {}
  //     if (promptConfig) {
  //       promptConfig.prompt_variables.forEach((item: any) => {
  //         res[item.key] = ''
  //       })
  //     }
  //     setInputs(res)
  //   }
  //   else {
  //     setInputs(savedInputs)
  //   }
  // }, [savedInputs])

  const highLightPromoptTemplate = (() => {
    if (!promptConfig)
      return ''
    const res = promptConfig.prompt_template.replace(regex, (match: any, p1: any) => {
      return `<span class='text-gray-800 font-bold'>${inputs?.[p1] ? inputs?.[p1] : match}</span>`
    })
    return res
  })()

  const { notify } = Toast
  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const renderHeader = () => {
    return (
      <div className='absolute top-0 left-0 right-0 flex items-center justify-between border-b border-gray-100 mobile:h-12 tablet:h-16 px-8 bg-white'>
        <div className='text-gray-900'>{conversationName}</div>
      </div>
    )
  }
  const handleFormChange = useCallback((variable: string, value: any) => {
    setCurrentConversationInputs({
      ...currentConversationInputs,
      [variable]: value,
    })
    handleNewConversationInputsChange({
      ...newConversationInputsRef.current,
      [variable]: value,
    })
  }, [newConversationInputsRef, handleNewConversationInputsChange, currentConversationInputs, setCurrentConversationInputs])
  const renderInputs = () => {
    return (
      <div className='space-y-3'>
        <form onSubmit={onSubmit}>
          {promptConfig.prompt_variables.map((item: any) => (
            <div className='mt-4 w-full' key={item.key}>
              <label className='text-base font-bold flex h-6 items-center text-text-secondary'>{item.name}</label>
              <div className='mt-1'>
                {item.type === 'select' && (
                  <Select
                    className='w-full'
                    defaultValue={inputs[item.key]}
                    onSelect={(i) => { handleInputsChange({ ...inputsRef.current, [item.key]: i.value }) }}
                    items={(item.options || []).map((i: any) => ({ name: i, value: i }))}
                    allowSearch={false}
                  />
                )}
                {item.type === 'string' && (
                  <Input
                    type="text"
                    placeholder={`${item.name}${!item.required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
                    value={inputs[item.key]}
                    onChange={(e: any) => { handleInputsChange({ ...inputsRef.current, [item.key]: e.target.value }) }}
                    maxLength={item.max_length || DEFAULT_VALUE_MAX_LEN}
                  />
                )}
                {item.type === 'paragraph' && (
                  <Textarea
                    className='h-[104px] sm:text-xs'
                    placeholder={`${item.name}${!item.required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
                    value={inputs[item.key]}
                    onChange={(e: any) => { handleInputsChange({ ...inputsRef.current, [item.key]: e.target.value }) }}
                  />
                )}
                {item.type === 'number' && (
                  <Input
                    type="number"
                    placeholder={`${item.name}${!item.required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
                    value={inputs[item.key]}
                    onChange={(e: any) => { handleInputsChange({ ...inputsRef.current, [item.key]: e.target.value }) }}
                  />
                )}
                {item.type === 'file' && (
                  <FileUploaderInAttachmentWrapper
                    onChange={(files) => { handleInputsChange({ ...inputsRef.current, [item.key]: getProcessedFiles(files)[0] }) }}
                    fileConfig={{
                      ...item.config,
                      fileUploadConfig: (visionConfig as any).fileUploadConfig,
                    }}
                  />
                )}
                {item.type === 'file-list' && (
                  <FileUploaderInAttachmentWrapper
                    onChange={(files) => { handleInputsChange({ ...inputsRef.current, [item.key]: getProcessedFiles(files) }) }}
                    fileConfig={{
                      ...item.config,
                      fileUploadConfig: (visionConfig as any).fileUploadConfig,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
          {
            visionConfig?.enabled && (
              <div className="mt-4 w-full">
                <div className="system-md-semibold flex h-6 items-center text-text-secondary">{t('common.imageUploader.imageUpload')}</div>
                <div className='mt-1'>
                  <TextGenerationImageUploader
                    settings={visionConfig}
                    onFilesChange={files => onVisionFilesChange(files.filter(file => file.progress !== -1).map(fileItem => ({
                      type: 'image',
                      transfer_method: fileItem.type,
                      url: fileItem.url,
                      upload_file_id: fileItem.fileId,
                    })))}
                  />
                </div>
              </div>
            )
          }
          <div className='mb-3 mt-6 w-full'>
            <div className="flex items-center justify-between gap-2">
              {/* Nút clear */}
              <Button
                onClick={onClear}
                disabled={false}
              >
                <span className='text-[13px]'>{t('common.operation.clear')}</span>
              </Button>
              <Button
                className={cn(!isPC && 'grow')}
                type='submit'
                variant="primary"
                disabled={false}
              >
                {/* Nút excute */}
                <RiPlayLargeLine className="mr-1 h-4 w-4 shrink-0" aria-hidden="true" />
                <span className='text-[13px]'>{t('share.generation.run')}</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  const canChat = () => {
    const inputLens = Object.values(inputs).length
    const promptVariablesLens = promptConfig.prompt_variables.length
    const emptyInput = inputLens < promptVariablesLens || Object.values(inputs).filter(v => v === '').length > 0
    if (emptyInput) {
      logError(t('common.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  const handleChat = () => {
    if (!canChat())
      return
    console.log(inputs)
    onStartChat(inputs)
  }

  const renderNoVarPanel = () => {
    if (isPublicVersion) {
      return (
        <div>
          <AppInfoComp siteInfo={siteInfo} />
          <TemplateVarPanel
            isFold={false}
            header={
              <>
                <PanelTitle
                  title={t('share.chat.publicPromptConfigTitle')}
                  className='mb-1'
                />
                <PromptTemplate html={highLightPromoptTemplate} />
              </>
            }
          >
            <ChatBtn onClick={handleChat} />
          </TemplateVarPanel>
        </div>
      )
    }
    // private version
    return (
      <TemplateVarPanel
        isFold={false}
        header={
          <AppInfoComp siteInfo={siteInfo} />
        }
      >
        <ChatBtn onClick={handleChat} />
      </TemplateVarPanel>
    )
  }
  // Khung input nhap anh
  const renderVarPanel = () => {
    return (
      <TemplateVarPanel
        isFold={false}
        header={
          <AppInfoComp siteInfo={siteInfo} />
        }
      >
        {renderInputs()}
        <ChatBtn
          className='mt-3 mobile:ml-0 tablet:ml-[128px]'
          onClick={handleChat}
        />
      </TemplateVarPanel>
    )
  }

  const renderVarOpBtnGroup = () => {
    return (
      <VarOpBtnGroup
        onConfirm={() => {
          if (!canChat())
            return

          onInputsChange(inputs)
          setIsFold(true)
        }}
        onCancel={() => {
          // setInputs(savedInputs)
          setIsFold(true)
        }}
      />
    )
  }

  const renderHasSetInputsPublic = () => {
    if (!canEditInputs) {
      return (
        <TemplateVarPanel
          isFold={false}
          header={
            <>
              <PanelTitle
                title={t('share.chat.publicPromptConfigTitle')}
                className='mb-1'
              />
              <PromptTemplate html={highLightPromoptTemplate} />
            </>
          }
        />
      )
    }

    return (
      <TemplateVarPanel
        isFold={isFold}
        header={
          <>
            <PanelTitle
              title={t('share.chat.publicPromptConfigTitle')}
              className='mb-1'
            />
            <PromptTemplate html={highLightPromoptTemplate} />
            {isFold && (
              <div className='flex items-center justify-between mt-3 border-t border-indigo-100 pt-4 text-xs text-indigo-600'>
                <span className='text-gray-700'>{t('share.chat.configStatusDes')}</span>
                <EditBtn onClick={() => setIsFold(false)} />
              </div>
            )}
          </>
        }
      >
        {renderInputs()}
        {renderVarOpBtnGroup()}
      </TemplateVarPanel>
    )
  }

  const renderHasSetInputsPrivate = () => {
    if (!canEditInputs || !hasVar)
      return null

    return (
      <TemplateVarPanel
        isFold={isFold}
        header={
          <div className='flex items-center justify-between text-indigo-600'>
            <PanelTitle
              title={!isFold ? t('share.chat.privatePromptConfigTitle') : t('share.chat.configStatusDes')}
            />
            {isFold && (
              <EditBtn onClick={() => setIsFold(false)} />
            )}
          </div>
        }
      >
        {renderInputs()}
        {renderVarOpBtnGroup()}
      </TemplateVarPanel>
    )
  }

  const renderHasSetInputs = () => {
    if ((!isPublicVersion && !canEditInputs) || !hasVar)
      return null

    return (
      <div
        className='pt-[88px] mb-5'
      >
        {isPublicVersion ? renderHasSetInputsPublic() : renderHasSetInputsPrivate()}
      </div>)
  }

  return (
    <div className='relative mobile:min-h-[48px] tablet:min-h-[64px]'>
      {hasSetInputs && renderHeader()}
      <div className='mx-auto pc:w-[794px] max-w-full mobile:w-full px-3.5'>
        {/*  Has't set inputs  */}
        {
          !hasSetInputs && (
            <div className='mobile:pt-[72px] tablet:pt-[128px] pc:pt-[200px]'>
              {hasVar
                ? (
                  renderVarPanel()
                )
                : (
                  renderNoVarPanel()
                )}
            </div>
          )
        }

        {/* Has set inputs */}
        {hasSetInputs && renderHasSetInputs()}
        {/* foot */}
        {!hasSetInputs && (
          <div className='mt-4 flex justify-between items-center h-8 text-xs text-gray-400'>

            {siteInfo.privacy_policy
              ? <div>{t('share.chat.privacyPolicyLeft')}
                <a
                  className='text-gray-500'
                  href={siteInfo.privacy_policy}
                  target='_blank'>{t('share.chat.privacyPolicyMiddle')}</a>
                {t('share.chat.privacyPolicyRight')}
              </div>
              : <div>
              </div>}
            <a className='flex items-center pr-3 space-x-3' href="https://dify.ai/" target="_blank">
              <span className='uppercase'>POWERED BY</span>
              <FootLogo />
            </a>
          </div>
        )
        }
      </div >
    </div >
  )
}

export default React.memo(Welcome)
