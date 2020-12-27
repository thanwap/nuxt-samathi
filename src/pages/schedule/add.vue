<template>
  <div>
    <h1>ตารางสอน - เพิ่ม</h1>
    <schedule-form
      :chapters="chapters"
      :teachers="teachers"
      @submit="submit"
    ></schedule-form>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> ตารางสอน </v-card-title>
        <v-card-text>อัพโหลดสำเร็จ</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="goToScheduleList">
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
export default {
  inject: ['showDialogError'],
  data() {
    return {
      loading: false,
      dialog: false,
      teachers: [],
      chapters: [],
    }
  },
  methods: {
    goToScheduleList() {
      this.$router.push({
        path: '/schedule',
      })
    },
    async submit(schedule) {
      this.loading = true

      if (await this.$services.scheduleApi.isHaveCreatedDate(schedule)) {
        this.loading = false
        this.showDialogError(`มีวันที่ ${schedule.date} อยู่ในระบบแล้ว`)
        return
      }

      try {
        this.$services.scheduleApi.add(schedule)

        this.loading = false
        this.dialog = true
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
  },
  async mounted() {
    this.loading = true

    this.teachers = []
    this.teachers = await this.$services.teacherApi.list()

    this.chapters = []
    this.chapters = await this.$services.chapterApi.list()

    this.loading = false
  },
}
</script>

<style lang="scss" scoped></style>
