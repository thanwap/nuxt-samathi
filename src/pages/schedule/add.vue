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

      if (await this.isCreatedDate(schedule)) {
        this.loading = false
        this.showDialogError(`มีวันที่ ${schedule.date} อยู่ในระบบแล้ว`)
        return
      }

      const scheduleRef = this.$fire.database.ref('schedule').push()
      try {
        await scheduleRef.set(schedule)

        this.loading = false
        this.dialog = true
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async isCreatedDate(schedule) {
      const scheduleRef = this.$fire.database.ref('schedule')
      console.log(scheduleRef)
      const scheduleSnapshot = await scheduleRef
        .orderByChild('date')
        .equalTo(schedule.date)
        .once('value')

      return scheduleSnapshot.val() ? true : false
    },
    async loadTeachers() {
      this.teachers = []
      const itemRef = this.$fire.database.ref('teacher')
      const itemSnapshot = await itemRef.once('value')
      const items = itemSnapshot.val()
      for (const key in items) {
        this.teachers.push({
          id: key,
          fullName: items[key].fullName,
          imageUrl: items[key].imageUrl,
        })
      }
    },
    async loadChapters() {
      this.chapters = []
      const itemRef = this.$fire.database.ref('chapter')
      const itemSnapshot = await itemRef.once('value')
      const items = itemSnapshot.val()
      for (const key in items) {
        this.chapters.push({
          id: key,
          chapterNumber: items[key].chapterNumber,
          name: items[key].name,
          bookNumber: items[key].bookNumber,
        })
      }
    },
  },
  async mounted() {
    this.loading = true
    await this.loadTeachers()
    await this.loadChapters()
    this.loading = false
    console.log(this.teachers)
    console.log(this.chapters)
  },
}
</script>

<style lang="scss" scoped></style>
