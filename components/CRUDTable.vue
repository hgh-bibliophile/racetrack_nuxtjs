<template>
  <div>
    <v-app>
      <v-data-table
        :headers="headers"
        :items="tbl_data"
        :search="search"
        :sort-by="tbl.sort_by"
        class="elevation-1"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>

            <FieldSearch v-model="search" />

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
                  New {{ model.singular }}
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="p-5 rounded-t border-b dark:border-gray-600">
                  <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">{{ formTitle }}</h3>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <FieldText v-for="field in edit.fields"
                        :key="field.label"
                        :label="field.label"
                        v-model="edit.item[field.val]" />
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
  props: {
    title: String,
    url: String,
    postArray: Boolean,
    model: {
      singular: String,
      plural: String
    },
    tbl: {
      sort_by: String,
      headers: Array,
      editFields: Array,
      exclude: {
        onUpdate: Array
      },
      default: Object
    }

  },
  emits: ['onUpdate', 'onInsert'],
  data () {
    return {
      dialog: false,
      dialogDelete: false,
      search: '',
      tbl_data: [],
      actions_header: [{ text: 'Actions', value: 'actions', sortable: false }],
      edit: {
        index: -1,
        item: Object.assign({}, this.tbl.default),
        fields: Object.assign({}, this.tbl.editFields)
      },
      defaultItem: Object.assign({}, this.tbl.default)
    }
  },

  computed: {
    formTitle () {
      return (this.edit.index === -1 ? 'New' : 'Edit') + ' ' + this.model.singular
    },
    headers () {
      return [].concat(this.tbl.headers, this.actions_header)
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
    this.tbl_data = await this.$axios.$get(this.url)
  },

  methods: {
    // Axios API Methods
    $updateItem (item, index) {
      const itemCP = Object.assign({}, item)
      this.tbl.exclude?.onUpdate?.forEach(el => delete itemCP[el])
      this.$axios.$put(this.url + '/' + item.id, itemCP)
        .then(resp => Object.assign(this.tbl_data[index], resp))
        .catch(err => console.log(err))
    },
    $createItem (item) {
      const post = !this.postArray ? item : [item]
      this.$axios.$post(this.url, post)
        .then(resp => this.tbl_data.push(!this.postArray ? resp : resp[0]))
        .catch(err => console.log(err))
    },
    $deleteItem (item) {
      this.$axios.$delete(this.url + '/' + item.id)
        .then(this.tbl_data.splice(this.edit.index, 1))
        .catch(err => console.log(err))
    },
    // Open dialogs
    editItem (item) {
      this.edit.index = this.tbl_data.indexOf(item)
      this.edit.item = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.edit.index = this.tbl_data.indexOf(item)
      this.edit.item = Object.assign({}, item)
      this.dialogDelete = true
    },
    // Handle CRUD actions
    deleteItemConfirm () {
      this.$deleteItem(this.edit.item)
      this.closeDelete()
    },
    save () {
      if (this.edit.index > -1) {
        this.$updateItem(this.edit.item, this.edit.index)
      } else {
        this.$createItem(this.edit.item)
      }
      this.close()
    },
    // Close dialogs
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.edit.item = Object.assign({}, this.defaultItem)
        this.edit.index = -1
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.edit.item = Object.assign({}, this.defaultItem)
        this.edit.index = -1
      })
    }
  }
}
</script>
