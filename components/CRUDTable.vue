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
          <v-toolbar flat>
            <v-toolbar-title>CRUD Lanes</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>

            <FieldSearch v-model="search"/>

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
                      <FieldText v-model="editedItem.lane_number" label="Lane #"/>
                      <FieldText v-model="editedItem.color" label="Color"/>
                      <FieldText v-model="editedItem.distance" label="Distance"/>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions class="flex items-center space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                  <BtnConfirm @click-event="save">Save</BtnConfirm>
                  <BtnCancel @click-event="close">Close</BtnCancel>
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
                  <BtnCancel @click-event="closeDelete"/>
                  <BtnConfirm @click-event="deleteItemConfirm">OK</BtnConfirm>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

          </v-toolbar>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>

        <template #no-data>
          <v-btn color="primary" @click="$fetch">Reset</v-btn>
        </template>
      </v-data-table>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'CRUDTable',
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
