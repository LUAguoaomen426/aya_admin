import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/policy/list',
    method: 'get',
    params: query
  })
}
