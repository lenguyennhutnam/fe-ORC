import { useQuery } from '@tanstack/react-query'
import { get } from './base'
import type {
  FileUploadConfigResponse,
} from '@/models/common'

const NAME_SPACE = 'common'

export const useFileUploadConfig = () => {
  return useQuery<FileUploadConfigResponse>({
    queryKey: [NAME_SPACE, 'file-upload-config'],
    queryFn: () => get<FileUploadConfigResponse>('/files/upload'),
  })
}
