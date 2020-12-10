<template>
  <div>
    <h1>ตารางสอน - รายการ</h1>
    <v-card>
      <div class="d-flex flex-row flex-nowrap justify-space-between">
        <div class="ma-2">
          <v-btn color="primary" class="mr-4" @click="goToAdd"> เพิ่ม </v-btn>
        </div>
      </div>

      <v-card-subtitle>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="ค้นหา"
          single-line
          hide-details
        ></v-text-field>
      </v-card-subtitle>

      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="schedules"
        :search="search"
      >
        <template v-slot:[`item.imageUrl`]="{ item }">
          <v-img max-width="100" :src="item.imageUrl"></v-img>
        </template>
        <template v-slot:[`item.id`]="{ item }">
          <v-btn
            @click="goToEdit(item.id)"
            class="mx-2"
            fab
            medium
            color="secondary"
          >
            <v-icon dark> mdi-pencil </v-icon>
          </v-btn>
          <v-btn
            @click="deleteTeacher(item.id)"
            class="mx-2"
            fab
            medium
            color="red"
          >
            <v-icon dark> mdi-delete </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >คุณแน่ใจหรือไม่ที่จะลบตาราง ?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">ยกเลิก</v-btn>
          <v-btn color="red darken-1" text @click="deleteConfirm">ตกลง</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      schedules: [],
    }
  },
  methods: {
    goToAdd() {
      this.$router.push({
        path: '/schedule/add',
      })
    },
    closeDelete() {},
    deleteConfirm() {},
  },
}
</script>

<style lang="scss" scoped></style>
