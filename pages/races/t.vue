<template>
  <div >
    <v-app >
      <v-data-table
        :headers="headers"
        :items="lanes"
        :search="search"
        sort-by="lane_number"
        class="elevation-1"
      >
        <template #top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>CRUD Lanes</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>

            <v-text-field
              v-model="search"
              label="Search"
              single-line
              hide-details
              outlined
              dense
            >
              <template #prepend-inner>
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
              </template>
            </v-text-field>

            <v-spacer></v-spacer>

            <v-dialog
              v-model="dialog"
              max-width="750px"
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  New Lane
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="p-5 rounded-t border-b dark:border-gray-600">
                  <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">{{ formTitle }}</h3>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.lane_number"
                          label="Lane number"
                          hide-details
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.color"
                          label="Color"
                          hide-details
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.distance"
                          label="Distance"
                          hide-details
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions class="flex items-center space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                  <v-btn
                    class="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    color="white"
                    text
                    @click="save"
                  >
                    Save
                  </v-btn>
                  <v-btn
                    class="bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
                    color="grey darken-3"
                    text
                    outlined
                    plain
                    @click="close"
                  >
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDelete" max-width="600px">
              <v-card>
                <v-card-title class="p-5 rounded-t border-b dark:border-gray-600">
                  <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">Are you sure you want to delete this lane?</h3>
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
                    color="grey darken-3"
                    text
                    outlined
                    plain
                    @click="closeDelete"
                  >Cancel</v-btn>
                  <v-btn
                    class="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    color="white"
                    text
                    @click="deleteItemConfirm"
                  >OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

          </v-toolbar>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>

        <template #no-data>
          <v-btn
            color="primary"
            @click="$fetch"
          >
            Reset
          </v-btn>
        </template>
      </v-data-table>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'TPage',
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: '',
    headers: [
      { text: '#', align: 'start', value: 'lane_number' },
      { text: 'Color', value: 'color' },
      { text: 'Dist', value: 'distance' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    lanes: [],
    editedIndex: -1,
    editedItem: {
      lane_number: null,
      color: '',
      distance: 24
    },
    defaultItem: {
      lane_number: null,
      color: '',
      distance: 24
    }
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Lane' : 'Edit Lane'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },

  async fetch () {
    this.lanes = await this.$axios.$get('/lanes')
  },

  methods: {
    editItem (item) {
      this.editedIndex = this.lanes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.lanes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.lanes.splice(this.editedIndex, 1)
      this.$axios.$delete('/lanes/' + this.editedItem.id)
      this.closeDelete()
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    updateItem (url, item) {
      this.$axios.$put(url + '/' + item.id, item)
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    save () {
      const lane = Object.assign({}, this.editedItem)
      delete lane.track
      if (this.editedIndex > -1) {
        Object.assign(this.lanes[this.editedIndex], this.editedItem)
        this.updateItem('/lanes', lane)
      } else {
        this.lanes.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>
