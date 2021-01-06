import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

/* eslint-disable no-new */
const store = new Vuex.Store({
  plugins: [createPersistedState(
    { 
      storage: window.localStorage 
    }
   )
  ],
  modules: {localStorage},
  state: {
    userId: "",
    userToken: ""
  },
  mutations: {
        updateUser(state, user) {
            state.userId = user.userId;
            state.userToken = user.userToken;
        }
    }
})

export default store
