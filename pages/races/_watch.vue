<template>
  <div class="relative flex flex-wrap xl:flex-nowrap flex-col sm:flex-row items-top min-h-screen bg-gray-100"> <!--sm:mt-6-->
    <div class="flex-auto mx-auto w-full sm:max-w-3xl sm:px-6 sm:mt-3 lg:px-8 xl:flex-none xl:mx-0 xl:mt-6">
      <div v-for="(t_data, lane_number) in race_data" :key="lane_number" class="flex items-center">
        <div :class="[color('text', t_data.lane.color, '800'), { 'opacity-50': !t_data.run }]" class="mr-8 hidden sm:block text-5xl">{{ lane_number }}</div>
        <div :class="[color('bg', t_data.lane.color, '500'), { 'opacity-50': !t_data.run }]" class="flex-shrink w-full overflow-hidden shadow sm:rounded-lg sm:p-4 sm:my-2 p-3">
          <div class="p-3 sm:p-6 bg-white text-center rounded-lg">
            <h2 class="sm:hidden pt-2 pb-3 text-xl font-medium tracking-wider text-gray-700 uppercase">
              Lane #{{ lane_number }}
            </h2>
            <h1 :class="color('text', t_data.lane.color, '800')" class="mb-2 text-2xl sm:text-5xl font-bold tracking-tight">
              <div v-if="t_data.run">{{ t_data.run.car.car_number }} - {{ t_data.run.car.name }}</div>
              <div v-else># - Name</div>
            </h1>
            <h2 class="mb-3 text-2xl sm:text-5xl font-normal text-gray-700 dark:text-gray-400">
              <div v-if="t_data.run && !active_heat">{{ t_data.run.mph ? t_data.run.mph.toFixed(1) : 0 }} mph ~ {{ t_data.run.fps ? t_data.run.fps.toFixed(1) : 0 }} fps</div>
              <div v-else>mph ~ fps</div>
            </h2>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-auto mx-auto w-full  self-start sm:max-w-xl xl:mx-0 xl:ml-4 xl:mt-6">
      <div class="flex flex-col items-top">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block py-2 min-w-full sm:px-6 lg:px-8">
            <div class="overflow-hidden shadow-md sm:rounded-lg">
              <table class="min-w-full">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th v-for="(label, i) in ['#', 'Car', 'Speed']" :key="i" scope="col" class="py-3 px-4 text-lg sm:text-2xl font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                      {{ label }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(car, i) in cars" :key="car.car_number" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td class="py-4 px-4 text-2xl sm:text-4xl font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {{ i + 1 }}
                    </td>
                    <td class="py-4 px-4 text-2xl sm:text-4xl font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {{ car.car_number }} - {{ car.name }}
                    </td>
                    <td class="py-4 px-4 text-2xl sm:text-4xl font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div v-if="car.top_run">{{ car.top_run.mph ? car.top_run.mph.toFixed(3) : 0 }} mph</div>
                      <div v-else>-</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RaceWatchPage',
  data: () => ({
    race_data: {},
    active_heat: false,
    race: null,
    track: null,
    ws: null,
    socket: null,
    cars: []
  }),
  async fetch () {
    this.race = await this.$axios.$get('/races/l/' + this.$route.params.watch)
    this.track = await this.$axios.$get('/tracks/' + this.race.track.id)
    this.track.lanes.forEach((lane) => {
      this.race_data[lane.lane_number] = { lane, run: null }
    })
    this.cars = await this.$axios.$get('/races/' + this.race.id + '/speeds')
    this.sortSpeeds()
    console.log(this.race)
    console.log(this.track)
    console.log(this.cars)
  },
  mounted () {
    this.connect(this.$route.params.watch)
  },
  methods: {
    color (type, color, op) {
      color = color.toLowerCase()
      if (color === 'black') {
        color = 'gray'
        op = type === 'bg' ? '700' : op
      }
      return [type, color, op].join('-')
    },
    setHeat (heat) {
      const heatRuns = Object.fromEntries(Object.entries(heat.runs).map(([, run]) => [run.lane.lane_number, run]))
      Object.keys(this.race_data).forEach((lane) => {
        this.race_data[lane].run = heatRuns[lane] ? heatRuns[lane] : null
      })
    },
    getSpeeds () {
      this.$axios.$get('/races/' + this.race.id + '/speeds')
        .then((resp) => {
          this.cars = resp
          this.sortSpeeds()
        })
    },
    sortSpeeds () {
      this.cars.sort((a, b) => {
        const ascending = true
        if (!a.top_run.delta_ms) {
          return ascending ? 1 : -1
        }
        if (!b.top_run.delta_ms) {
          return ascending ? -1 : 1
        }
        if (ascending) {
          return a.top_run.delta_ms > b.top_run.delta_ms ? 1 : -1
        }
        return a.top_run.delta_ms > b.top_run.delta_ms ? -1 : 1
      })
    },
    field (obj, path) {
      return path.split('.').reduce((o, p) => o ? o[p] : '', obj)
    },
    connect (raceLink) {
      this.socket = this.$nuxtSocket({ path: '/live/socket.io' })
      /* Listen for events: */
      this.socket.on('connect', () => {
        console.log('Socket connected...')
        this.socket.emit('watch', { race: raceLink })
      })
      this.socket.on('disconnect', () => {
        console.log('Socket disconnected...')
        this.socket.open()
      })
      this.socket.on('start_heat', (msg) => {
        console.log('Starting Heat', msg)
        this.active_heat = true
        this.setHeat(msg.data)
        /* msg.data.runs.forEach((run) => {
          this.race_data[run.lane.lane_number].run = run
        }) */
      })
      this.socket.on('heat_results', (msg) => {
        console.log('Heat Results', msg)
        this.active_heat = false
        this.getSpeeds()
        this.setHeat(msg.data)
      })
      /* this.ws = new WebSocket('ws://api.racetrack.gratiafides.com/watch/' + this.$route.params.watch)
      console.log(this.ws)

      this.ws.onmessage = (e) => {
        const event = JSON.parse(e.data)
        console.log(event)
        if (event.type === 'start_heat') {
          this.active_heat = true
        } else {
          this.active_heat = false
          this.$axios.$get('/races/' + this.race.id + '/speeds')
            .then((resp) => {
              this.cars = resp
              this.sortSpeeds()
            })
        }
        event.data.runs.forEach((run) => {
          this.race_data[run.lane.lane_number].run = run
        })
      }

      this.ws.onopen = (event) => {
        console.log(event)
        console.log('Websocket connected...')
      }
      this.ws.onclose = (event) => {
        console.log(event)
        console.log('Websocket disconnected...')
        this.ws = null
      } */
    }
  }
}
</script>
