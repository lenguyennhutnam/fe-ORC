import { useFile } from '../hooks'
import { useStore } from '../store'
import type { FileEntity } from '../types'
import FileImageItem from './file-image-item'
import FileItem from './file-item'
import cn from '@/config/classnames'

export enum SupportUploadFileTypes {
  image = 'image',
  document = 'document',
  audio = 'audio',
  video = 'video',
  custom = 'custom',
}

type FileListProps = {
  className?: string
  files: FileEntity[]
  onRemove?: (fileId: string) => void
  onReUpload?: (fileId: string) => void
  showDeleteAction?: boolean
  showDownloadAction?: boolean
  canPreview?: boolean
}
export const FileList = ({
  className,
  files,
  onReUpload,
  onRemove,
  showDeleteAction = true,
  showDownloadAction = false,
  canPreview = true,
}: FileListProps) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {
        files.map((file) => {
          if (file.supportFileType === SupportUploadFileTypes.image) {
            return (
              <FileImageItem
                key={file.id}
                file={file}
                showDeleteAction={showDeleteAction}
                showDownloadAction={showDownloadAction}
                onRemove={onRemove}
                onReUpload={onReUpload}
                canPreview={canPreview}
              />
            )
          }

          return (
            <FileItem
              key={file.id}
              file={file}
              showDeleteAction={showDeleteAction}
              showDownloadAction={showDownloadAction}
              onRemove={onRemove}
              onReUpload={onReUpload}
              canPreview={canPreview}
            />
          )
        })
      }
    </div>
  )
}

type FileListInChatInputProps = {
  fileConfig: any
}
export const FileListInChatInput = ({
  fileConfig,
}: FileListInChatInputProps) => {
  const files = useStore(s => s.files)
  const {
    handleRemoveFile,
    handleReUploadFile,
  } = useFile(fileConfig)

  return (
    <FileList
      files={files}
      onReUpload={handleReUploadFile}
      onRemove={handleRemoveFile}
    />
  )
}
