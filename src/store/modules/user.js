import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,anyRoutes,asyncRoutes,constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes:[],
    roles:[],
    buttons:[],
    resultAsyncRoutes:[],
    resultAllRoutes:[]
  }
}

const state = getDefaultState()

// 修改state
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  // 存储用户信息
  SET_USERINFO:(state,userInfo)=>{
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.routes = userInfo.routes;
    state.buttons = userInfo.buttons;
    state.roles = userInfo.roles;
  },
  // 计算出异步路由
  SET_RESULTASYNCROUTES:(state,asyncRoutes)=>{
    state.resultAsyncRoutes = asyncRoutes
    // 计算当前用户的全部路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    // 给路由器添加用户所匹配的路由
    router.addRoutes(state.resultAllRoutes)
  }
}
// 定义函数计算出用户显示的异步路由
const computedAsyncRoutes = (asyncRoutes,routes) => {
  console.log('2:',routes);
  return asyncRoutes.filter(item=>{

    if (routes.indexOf(item.name)!=-1) {
      // 递归
      if (item.children&&item.children.length) {
        item.children = computedAsyncRoutes(item.children,routes);
      }
      return true
    }
  })
}
// actions
const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    // 解构用户名和密码
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    // console.log(result);
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
    // const { username, password } = userInfo
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        // if (!data) {
        //   return reject('Verification failed, please Login again.')
        // }
        // const { name, avatar } = data
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        commit('SET_USERINFO',data)
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

