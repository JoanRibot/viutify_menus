<template>
  <v-data-table :headers="headers" :items="menus" sort-by="calories" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Nuestra Carta</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template></template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ editedItem.nombre }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-card-text>
                  <div class="font-weight-bold ml-8 mb-2">Platos</div>

                  <v-timeline align-top dense>
                    <v-timeline-item
                      v-for="(plato,  key) in editedItem.platos"
                      :key="key"
                      :color="key % 2 == 0 ? 'red' : 'blue'"
                      small
                    >
                      <div>
                        <div class="font-weight-normal">
                          <strong>Plato {{ key + 1 }}:</strong>
                        </div>
                        <div>{{ plato }}</div>
                      </div>
                    </v-timeline-item>
                     <v-timeline-item
                      :color="'green'"
                      small
                    >
                      <div>
                        <div class="font-weight-normal">
                          <strong>Bebida:</strong>
                        </div>
                        <div>{{ editedItem.bebida }}</div>
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                </v-card-text>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-eye</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Nombre',
        align: 'start',
        sortable: false,
        value: 'nombre',
      },
      { text: 'Lugar', value: 'lugar' },
      { text: 'Precio', value: 'price' },
      { text: 'Valoración', value: 'valoration' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    menus: [],
    editedIndex: -1,
    editedItem: {
      nombre: '',
      lugar: '',
      price: 0,
      valoration: 0,
      platos: [],
      bebida: '',
      stck: 0,
    },
    defaultItem: {
      nombre: '',
      lugar: '',
      price: 0,
      valoration: 0,
      platos: [],
      bebida: '',
      stck: 0,
    },
  }),

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.all()
    },

    async all() {
      await axios.get('http://localhost:3000/')
        .then((response) => {
          this.menus = response.data.menus
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    },

    editItem(item) {
      this.editedIndex = this.menus.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem(item) {
      this.editedIndex = this.menus.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true

      await axios.delete('http://localhost:3000/carta/menu/borrarmenu/' + item.nombre)
        .then((response) => {
          console.log(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    },

    deleteItemConfirm() {
      this.menus.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      if (this.editedIndex > -1) {
        await axios.put('http://localhost:3000/carta/menu/edit/' + this.editedItem.id, this.editedItem)
          .then(() => {
            Object.assign(this.menus[this.editedIndex], this.editedItem)
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
      } else {
        await axios.post('http://localhost:3000/carta/menu/insertar', this.editedItem)
          .then((response) => {
            this.menus.push(this.editedItem)
            console.log(response);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })

      }
      this.close()
    },
  },
}
</script>