<template>
  <div>
    <teacher-form @submit="submit"></teacher-form>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> อาจารย์ </v-card-title>
        <v-card-text>อัพโหลดสำเร็จ</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="goToTeacherList">
            ตกลง
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import TeacherForm from '../../components/teacher/TeacherForm'
export default {
  components: {
    'teacher-form': TeacherForm,
  },
  data() {
    return {
      loading: false,
      dialog: false,
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
  },
  methods: {
    async submit(teacher, fileImage) {
      this.loading = true
      const teacherRef = this.$fire.database.ref('teacher').push()
      try {
        await teacherRef.set(teacher)

        if (fileImage) {
          const imageRef = this.$fire.storage
            .ref()
            .child(`images/teachers/${teacherRef.key}/${fileImage.name}`)
          await imageRef.put(fileImage)
          const imageUrl = await imageRef.getDownloadURL()
          await teacherRef.set({ ...teacher, imageUrl: imageUrl })
        }

        this.loading = false
        this.dialog = true
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    goToTeacherList() {
      this.$router.push({
        path: '/teacher',
      })
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped></style>
