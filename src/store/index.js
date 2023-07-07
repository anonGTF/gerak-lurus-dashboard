import Vue from 'vue'
import Vuex from 'vuex'

import notification from "./notification"
import process from "./process"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  modules: {
    notification,
    process
  }
})
