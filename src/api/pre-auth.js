import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/pre-auth/list',
    method: 'get',
    params: query
  })
}
