import Cookies from 'js-cookie'

// utils/auth.js
const TokenKey = 'token'
const UserInfoKey = 'userInfo'

// ✅ 统一使用 localStorage
export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  localStorage.removeItem(TokenKey)
  localStorage.removeItem(UserInfoKey)
}

export function isLoggedIn() {
  return !!localStorage.getItem(TokenKey)
}

export function getUserInfo() {
  const info = localStorage.getItem(UserInfoKey)
  return info ? JSON.parse(info) : null
}

export function setUserInfo(info) {
  localStorage.setItem(UserInfoKey, JSON.stringify(info))
}

export function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = '/login'
    return false
  }
  return true
}