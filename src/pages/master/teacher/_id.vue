<template>
  <div>
    <h1>อาจารย์ - แก้ไข้</h1>
    <teacher-form
      @submit="submit"
      v-if="teacher"
      :teacher="teacher"
    ></teacher-form>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> อาจารย์ </v-card-title>
        <v-card-text>อัพโหลดสำเร็จ</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDialog"> ตกลง </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import TeacherForm from '../../../components/teacher/TeacherForm'
export default {
  components: {
    'teacher-form': TeacherForm,
  },
  data() {
    return {
      teacher: null,
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
      try {
        await this.$services.teacherApi.update(this.id, teacher, fileImage)

        this.loading = false
        this.dialog = true
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    clear() {
      this.image = ''
      this.file = null
      this.$refs.form.reset()
    },
    closeDialog() {
      this.dialog = false
      this.$router.push({
        path: '/teacher',
      })
    },
  },
  async mounted() {
    if (this.id) {
      const teacherSnapshot = await this.$fire.database
        .ref('teacher/' + this.id)
        .once('value')
      const teacher = teacherSnapshot.val()

      if (!teacher) {
        this.$router.push({ path: '/teacher/add' })
      }
      this.teacher = teacher
    } else {
      this.$router.push({ path: '/teacher/add' })
    }
  },
}
</script>

<style lang="scss" scoped></style>
