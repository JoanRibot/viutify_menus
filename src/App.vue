<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Restsaurant Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo.png"
          transition="scale-transition"
          width="40"
        />

        <h1
          alt="Restsaurant Logo"
          class="shrink mr-2"
          contain
          width="40"
          color = "black"
        >Cartify</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        color="primary"
        elevation="2"
        to="/"
      >Staff</v-btn>

      <v-btn
        color="primary"
        elevation="2"
        to="/cliente"
      >Cliente</v-btn>

    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
},

  data: () => ({
    //
  }),
};
</script>
