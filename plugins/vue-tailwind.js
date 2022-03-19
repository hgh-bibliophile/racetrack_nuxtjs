import VueNativeSock from 'vue-native-websocket'

Vue.use(VueNativeSock, 'ws://api.racetrack.gratiafides.com', {
  connectManually: true,
})
