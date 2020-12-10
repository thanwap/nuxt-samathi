<template>
  <div>
    <v-form ref="form" lazy-validation>
      <v-text-field
        v-model="chapter.chapterNumber"
        label="บท"
        required
        :rules="chapterNumberRules"
      ></v-text-field>
      <v-text-field
        v-model="chapter.bookNumber"
        label="เล่ม"
        required
        :rules="bookNumberRules"
      ></v-text-field>
      <v-text-field
        v-model="chapter.name"
        label="ชื่อ"
        required
        :rules="nameRules"
      ></v-text-field>

      <v-btn color="primary" class="mr-4" @click="submit"> ตกลง </v-btn>
      <v-btn color="secondary" class="mr-4" @click="clear"> เคลียร์ </v-btn>
      <v-btn @click="back"> กลับ </v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  props: {
    chapter: {
      type: Object,
      default() {
        return {
          chapterNumber: '',
          name: '',
          bookNumber: '',
        }
      },
    },
  },
  data() {
    return {
      valid: true,
      chapterNumberRules: [(v) => !!v || 'กรุณากรอก บท'],
      nameRules: [(v) => !!v || 'กรุณากรอก ชื่อ'],
      bookNumberRules: [(v) => !!v || 'กรุณากรอก เลชที่เล่ม'],
    }
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
          ...this.chapter,
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
