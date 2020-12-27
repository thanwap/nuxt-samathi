<template>
  <div>
    <h1>ตารางสอน - แก้ไข้</h1>
    <schedule-form
      @submit="submit"
      v-if="schedule"
      :schedule="schedule"
      :chapters="chapters"
      :teachers="teachers"
    ></schedule-form>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> ตารางสอน </v-card-title>
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
import ScheduleForm from '../../components/schedule/ScheduleForm'
export default {
  inject: ['showDialogError'],
  components: {
    'schedule-form': ScheduleForm,
  },
  data() {
    return {
      firstSchedule: null,
      schedule: null,
      chapters: [],
      teachers: [],
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
    async submit(schedule) {
      this.loading = true

      if (await this.isCreatedDate(schedule)) {
        this.loading = false
        this.showDialogError(`มีวันที่ ${schedule.date} อยู่ในระบบแล้ว`)
        return
      }

      const scheduleRef = this.$fire.database.ref('schedule/' + this.id)
      try {
        console.log(schedule)
        await scheduleRef.update({
          ...schedule,
        })

        this.loading = false
        this.dialog = true
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async isCreatedDate(schedule) {
      if (schedule.date === this.firstSchedule.date) {
        return false
      }

      const scheduleRef = this.$fire.database.ref('schedule')
      const scheduleSnapshot = await scheduleRef
        .orderByChild('date')
        .equalTo(schedule.date)
        .once('value')

      return scheduleSnapshot.val() ? true : false
    },
    clear() {
      this.$refs.form.reset()
    },
    closeDialog() {
      this.dialog = false
      this.$router.push({
        path: '/schedule',
      })
    },
  },
  async mounted() {
    this.loading = true
    await this.loadTeachers()
    await this.loadChapters()
    if (this.id) {
      const scheduleSnapshot = await this.$fire.database
        .ref('schedule/' + this.id)
        .once('value')
      const schedule = scheduleSnapshot.val()

      if (!schedule) {
        this.$router.push({ path: '/schedule/add' })
      }
      this.firstSchedule = { ...schedule }
      this.schedule = schedule
    } else {
      this.$router.push({ path: '/schedule/add' })
    }
    this.loading = false
  },
}
</script>

<style lang="scss" scoped></style>
