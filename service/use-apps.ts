import { useQuery } from '@tanstack/react-query'
import { get } from './base'
import { useInvalid } from './use-base'
import type { App } from '@/types/app'
import type { AppListResponse } from '@/models/app'

const NAME_SPACE = 'apps'

// TODO paging for list
const useAppFullListKey = [NAME_SPACE, 'full-list']
export const useAppFullList = () => {
  return useQuery<AppListResponse>({
    queryKey: useAppFullListKey,
    queryFn: () => get<AppListResponse>('/apps', { params: { page: 1, limit: 100 } }),
  })
}

export const useInvalidateAppFullList = () => {
  return useInvalid(useAppFullListKey)
}

export const useAppDetail = (appID: string) => {
  return useQuery<App>({
    queryKey: [NAME_SPACE, 'detail', appID],
    queryFn: () => get<App>(`/apps/${appID}`),
  })
}
