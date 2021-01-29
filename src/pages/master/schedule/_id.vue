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
import ScheduleForm from '../../../components/schedule/ScheduleForm'
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
    async submit(schedule) {
      this.loading = true

      const isHaveToCheck = schedule.date !== this.firstSchedule.date

      if (
        isHaveToCheck &&
        (await this.$services.scheduleApi.isHaveCreatedDate(schedule))
      ) {
        this.loading = false
        this.showDialogError(`มีวันที่ ${schedule.date} อยู่ในระบบแล้ว`)
        return
      }

      try {
        this.$services.scheduleApi.update(this.id, schedule)

        this.loading = false
        this.dialog = true
      } catch (e) {
        this.loading = false
        console.log(e)
      }
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

    this.teachers = []
    this.teachers = await this.$services.teacherApi.list()

    this.chapters = []
    this.chapters = await this.$services.chapterApi.list()

    if (this.id) {
      const schedule = await this.$services.scheduleApi.get(this.id)

      if (!schedule) {
        this.$router.push({ path: '/schedule/add' })
      }
      this.firstSchedule = { ...schedule }
      this.schedule = schedule
      console.log(schedule, 'schedule')
    } else {
      this.$router.push({ path: '/schedule/add' })
    }
    this.loading = false
  },
}
</script>

<style lang="scss" scoped></style>
