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

    <v-dialog v-model="dialogError.isShow" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">
          {{ dialogError.errorTitle }}
        </v-card-title>
        <v-card-text>{{ dialogError.errorMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="closeDialogError">
            ตกลง
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  provide() {
    return {
      showDialogError: this.showDialogError,
    }
  },
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
          title: 'หัวข้อ',
          to: '/master/chapter',
        },
        {
          title: 'อาจารย์',
          to: '/master/teacher',
        },
        {
          title: 'ตารางสอน',
          to: '/master/schedule',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
      dialogError: {
        isShow: false,
        errorTitle: '',
        errorMessage: '',
      },
    }
  },
  methods: {
    showDialogError(message, title) {
      this.dialogError.isShow = true
      this.dialogError.errorTitle = title || 'เกิดข้อผิดพลาด'
      this.dialogError.errorMessage = message
    },
    closeDialogError() {
      this.dialogError.isShow = false
    },
  },
}
</script>
