const TokenKey = 'adminToken'
const UserInfoKey = 'adminUserInfo'

export function getToken () {
    return localStorage.getItem(TokenKey)
}

export function setToken (token) {
    return localStorage.setItem(TokenKey, token)
}

export function removeToken () {
    return localStorage.removeItem(TokenKey)
}

export function getUserInfo () {
    return JSON.parse(localStorage.getItem(UserInfoKey))
}
export function setUserInfo (userInfo) {
    return localStorage.setItem(UserInfoKey, JSON.stringify(userInfo))
}

export function removeUserInfo () {
    return localStorage.removeItem(UserInfoKey)
}