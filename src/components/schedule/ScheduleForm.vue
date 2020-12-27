<template>
  <div>
    <v-form ref="form" lazy-validation>
      <v-date-picker v-model="schedule.date"></v-date-picker>
      <v-select
        v-model="schedule.chapterId"
        :items="chapters"
        item-text="name"
        item-value="id"
        :rules="[(v) => !!v || 'กรุณาเลือก ห้วข้อ']"
        label="หัวข้อ"
        required
      ></v-select>
      <v-select
        v-model="schedule.teacherId"
        :items="teachers"
        item-text="fullName"
        item-value="id"
        :rules="[(v) => !!v || 'กรุณาเลือก อาจารย์']"
        label="อาจารย์"
        required
      ></v-select>

      <v-btn color="primary" class="mr-4" @click="submit"> ตกลง </v-btn>
      <v-btn color="secondary" class="mr-4" @click="clear"> เคลียร์ </v-btn>
      <v-btn @click="back"> กลับ </v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  props: {
    schedule: {
      type: Object,
      default() {
        return {
          teacherId: '',
          chapterId: '',
          date: new Date().toISOString().substr(0, 10),
        }
      },
    },
    chapters: {
      type: Array,
      default() {
        return []
      },
    },
    teachers: {
      type: Array,
      default() {
        return []
      },
    },
  },
  methods: {
    clear() {
      this.$refs.form.reset()
    },
    submit() {
      if (!this.$refs.form.validate()) return
      this.$emit(
        'submit',
        {
          chapterId: this.schedule.chapterId,
          teacherId: this.schedule.teacherId,
          date: this.schedule.date,
        },
        this.file
      )
    },
    back() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss" scoped></style>
