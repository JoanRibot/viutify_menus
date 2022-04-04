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
                      v-for="(plato, key) in editedItem.platos"
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
                    <v-timeline-item :color="'green'" small>
                      <div>
                        <div class="font-weight-normal">
                          <strong>Bebida:</strong>
                        </div>
                        <div>{{ editedItem.bebida }}</div>
                      </div>
                    </v-timeline-item>
                  </v-timeline>

                  <v-rating
                    v-model="editedItem.rating"
                    color="yellow darken-3"
                    background-color="grey darken-1"
                    empty-icon="$ratingFull"
                    hover
                    large
                  ></v-rating>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="addValoration()"
                  >Añadir valoración</v-btn>
                </v-card-text>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="showMenu(item)">mdi-eye</v-icon>
      <v-icon
        small
        class="mr-2"
        @click="addFavourite(item)"
        :color="item.is_favourite ? 'red' : ''"
      >mdi-heart</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Cargar Datos</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'
export default {
  data: () => ({
    dialog: false,
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
      is_favourite: false,
      rating: 0
    },
    defaultItem: {
      nombre: '',
      lugar: '',
      price: 0,
      valoration: 0,
      platos: [],
      bebida: '',
      stck: 0,
      is_favourite: false,
      rating: 0
    },
  }),

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.all().then(() => {
        this.menus.forEach(menu => {
          menu.is_favourite = localStorage.getItem(menu.id) === 'true' ? true : false
          this.editedIndex = this.menus.indexOf(menu)
          this.editedItem = Object.assign({}, menu)
        });
      })
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

    showMenu(item) {
      this.editedIndex = this.menus.indexOf(item)
      console.log(this.editedIndex)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    addFavourite(item) {
      item.is_favourite = !item.is_favourite;
      localStorage.setItem(item.id, item.is_favourite);
      this.editedIndex = this.menus.indexOf(item)
      this.editedItem = Object.assign({}, item)
    },

    async addValoration() {
        await axios.put('http://localhost:3000/carta/menu/addValoration/' + this.editedItem.nombre + '/' + this.editedItem.rating)
          .then(() => {
            this.getMenu(this.editedItem).then((response) => {
              Object.assign(this.menus[this.editedIndex], response.data)
              console.log(this.editedIndex, this.menus[this.editedIndex])
              this.close()
            })
          })
          .catch(function (error) {
            // handle error
            console.log(error);
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
          .then(() => {
            this.menus.push(this.editedItem)
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })

      }
      this.close()
    },

    getMenu(item) {
      return axios.get('http://localhost:3000/carta/menu/' + item.nombre)
    }
  },
}
</script>