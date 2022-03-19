<template>
  <div class="relative flex flex-col items-top justify-center min-h-screen sm:items-center sm:pt-0">

    <div id="alert" :class="{ hidden: hideAlert }" class="flex h-fit p-4 mb-4 bg-blue-100 rounded-lg dark:bg-blue-200" role="alert">
      <svg class="flex-shrink-0 w-5 h-5 text-blue-700 dark:text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
      <div class="ml-3 text-sm font-medium text-blue-700 dark:text-blue-800">
        {{ alert }}
      </div>
      <button @click="hideAlert = !hideAlert" type="button" class="ml-auto -mx-1.5 -my-1.5 bg-blue-100 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex h-8 w-8 dark:bg-blue-200 dark:text-blue-600 dark:hover:bg-blue-300" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </button>
    </div>
    <div class="p-4 max-w-md w-6/12 bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div class="space-y-6">
        <h5 class="text-xl font-medium text-gray-900 dark:text-white">
          Race Heat Manager
        </h5>
        <div>
          <label for="arduino_url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Arduino server websocket url
          </label>
          <input v-model="url.arduino"
            name="arduino_url"
            id="arduino_url"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="ws://"
            required>
        </div>
        <div>
          <label for="race_link" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Race watch_link
          </label>
          <input v-model="race_link"
            name="race_link"
            id="race_link"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            required>
        </div>
        <div>
          <label for="heat_num" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Heat #
          </label>
          <input v-model="heat_num"
            type="number"
            name="heat_num"
            id="heat_num"
            @change="loadHeat"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            required>
        </div>
        <div class="hidden">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" for="user_avatar">Upload file</label>
          <input class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file">
        </div>

        <button @click="startHeat" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Start Heat
        </button>
        <h5 class="text-xl font-medium text-gray-900 dark:text-white">
          Heat #{{ heat_num }}
        </h5>
        <tailwind-table :headers="t_headers" :data="t_data" />
      </div>
    </div>

    <!--<h3 v-for="(item, key, index) in ws_data" :key="index">Lane #{{key}}: {{ item.run_data }}</h3>-->

  </div>
</template>

<script>
import TailwindTable from '~/components/TailwindTable.vue'
export default {
  components: { TailwindTable },
  name: 'HostIndexPage',
  data: () => ({
    connection: null,
    url: {
      arduino: 'ws://localhost:8765'
    },
    ws: {
      arduino: null,
      api: null
    },
    ws_data: '',
    race_link: 'test_wd22',
    race: null,
    heat_num: null,
    alert: '',
    hideAlert: true,
    t_headers: [
      {
        label: 'Lane #',
        path: 'lane.lane_number'
      },
      {
        label: 'Car #',
        path: 'car.car_number'
      },
      {
        label: 'Name',
        path: 'car.name'
      },
      {
        label: 'MicroS',
        path: 'delta_ms'
      }
    ],
    t_data: []
  }),
  watch: {
    race_link(new_link, old_link) {
      this.race = await this.$axios.$get('/races/l/' + new_link)
    }
  },
  methods: {
    startHeat () {
      if (!this.race_link || !this.heat_num) {
        return
      }
      if (!this.ws.arduino) {
        this.connect()
      }
      this.$axios.$get('/ws/' + this.race_link + '/heat/' + this.heat_num)
        .then((resp) => {
          console.log(resp)
          this.ws.arduino.send(JSON.stringify(this.get_msg(resp)))
        })
        .catch(err => console.log(err))
    },
    loadHeat () {
      this.$axios.$get('/races/12/heats/' + this.heat_num)
        .then((resp) => {
          console.log(resp)
          this.t_data = resp.runs
        })
        .catch(err => console.log(err))
    },
    get_msg (data) {
      const dataObj = {}
      data.forEach((heatrun) => {
        dataObj[heatrun.lane.lane_number] = { heatrun_id: heatrun.id }
      })
      return {
        type: 'start_race',
        data: dataObj
      }
    },
    connect () {
      if (!this.url.arduino) {
        return
      }
      this.ws.arduino = new WebSocket(this.url.arduino)
      console.log(this.ws.arduino)
      this.ws.arduino.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        this.alert = msg.msg
        this.hideAlert = false
        if (msg.type === 'arduino_ready') {
          // trigger api websocket start_race?
        } else if (msg.type === 'heat_data') {
          const putData = []
          Object.values(msg.data).forEach(val => putData.push({
            id: val.heatrun_id,
            delta_ms: val.run_data
          }))

          console.log(putData)
          this.$axios.$put('/ws/' + this.race_link + '/heat/' + this.heat_num, putData)
            .then((resp) => {
              console.log(resp)
              this.t_data = resp
            })
            .catch(err => console.log(err))
        }
        console.log(msg)
        console.log(msg.type)
        console.log(msg.msg)
      }
      this.ws.arduino.onopen = (event) => {
        console.log(event)
        console.log('Connected to arduino websocket...')
      }
      this.ws.arduino.onclose = (event) => {
        console.log(event)
        console.log('Arduino websocket disconnected...')
        this.ws.arduino = null
      }
    }
  }
}
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
