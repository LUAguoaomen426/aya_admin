import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/claim/list',
    method: 'get',
    params: query
  })
}
