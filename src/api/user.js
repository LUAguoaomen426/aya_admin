import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function forgetPassword(data) {
  return request({
    url: '/auth/forgetPassword',
    method: 'get',
    params: { username: data }
  })
}

export function download(data) {
  return request({
    url: '/common/file/download',
    method: 'get',
    params: { fileName: data },
    responseType: 'arraybuffer'
  })
}
