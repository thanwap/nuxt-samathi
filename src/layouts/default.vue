<template>
  <v-app>
    <v-app-bar fixed app>
      <template>
        <v-tabs>
          <v-tab v-for="(item, i) in items" :key="i" :to="item.to" router>{{
            item.title
          }}</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          title: 'ป้ายชื่ออาจารย์',
          to: '/',
        },
        {
          title: 'อาจารย์',
          to: '/teacher',
        },
        {
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
}
</script>
