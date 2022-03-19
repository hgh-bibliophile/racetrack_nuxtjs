<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block py-2 min-w-full sm:px-6 lg:px-8">
        <div class="overflow-hidden shadow-md sm:rounded-lg">
          <table class="min-w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th v-for="(col, index) in headers" :key="index" scope="col" class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in data" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td v-for="(col, index) in headers" :key="index" class="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {{ field(row, col.path) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TailwindTable',
  props: {
    headers: Array,
    data: Array
  },
  methods: {
    field (obj, path) {
      return path.split('.').reduce((o, p) => o ? o[p] : '', obj)
    }
  }
}
</script>
