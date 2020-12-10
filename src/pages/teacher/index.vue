<template>
  <div>
    <v-card>
      <div class="d-flex flex-row flex-nowrap justify-space-between">
        <v-card-title> อาจารย์ </v-card-title>
        <div class="ma-2">
          <v-btn @click="goToAdd" color="primary" fab medium>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
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
        :items="teachers"
        :search="search"
      >
        <template v-slot:item.imageUrl="{ item }">
          <v-img max-width="100" :src="item.imageUrl"></v-img>
        </template>
        <template v-slot:item.id="{ item }">
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
          >คุณแน่ใจหรือไม่ที่จะลบอาจารย์ ?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">ยกเลิก</v-btn>
          <v-btn color="red darken-1" text @click="deleteTeacherConfirm"
            >ตกลง</v-btn
          >
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
      headers: [
        { text: 'ชื่อ-นามสกุล', value: 'fullName', filterable: true },
        { text: 'เบอร์โทรศัพท์', value: 'phoneNumber' },
        { text: 'รูป', value: 'imageUrl' },
        { text: 'action', value: 'id' },
      ],
      teachers: [],
      search: '',
      loading: false,
      dialogDelete: false,
      deleteId: '',
    }
  },
  methods: {
    async loadTeachers() {
      console.log('load Teachers')
      this.teachers = []
      this.loading = true
      const teacherRef = this.$fire.database.ref('teacher')
      const teacherSnapshot = await teacherRef.once('value')
      const teachers = teacherSnapshot.val()
      for (const key in teachers) {
        this.teachers.push({
          id: key,
          name: teachers[key].name,
          lastName: teachers[key].lastName,
          fullName: teachers[key].fullName
            ? teachers[key].fullName
            : `${teachers[key].prefix}${teachers[key].name} ${teachers[key].lastName}`,
          phoneNumber: teachers[key].phoneNumber,
          prefix: teachers[key].prefix,
          imageUrl: teachers[key].imageUrl
            ? teachers[key].imageUrl
            : 'https://firebasestorage.googleapis.com/v0/b/nuxt-samathi/o/images%2Fteachers%2Fteacher-mock.jpg?alt=media&token=aaa06d90-baed-4ad0-9206-0b80aeaec856',
        })
      }
      this.loading = false
    },
    goToAdd() {
      this.$router.push({
        path: '/teacher/add',
      })
    },
    goToEdit(id) {
      this.$router.push({
        path: '/teacher/' + id,
      })
    },
    deleteTeacher(id) {
      this.dialogDelete = true
      this.deleteId = id
    },
    async deleteTeacherConfirm() {
      await this.$fire.database.ref('teacher/' + this.deleteId).remove()
      this.deleteId = ''
      this.dialogDelete = false
      await this.loadTeachers()
    },
    closeDelete() {
      this.dialogDelete = false
    },
  },
  async mounted() {
    this.loadTeachers()
  },
}
</script>

<style lang="scss" scoped></style>
