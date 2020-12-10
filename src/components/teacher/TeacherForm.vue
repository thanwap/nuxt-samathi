<template>
  <v-form ref="form" lazy-validation>
    <v-text-field
      v-model="teacher.prefix"
      label="คำนำหน้า"
      required
      :rules="prefixRules"
    ></v-text-field>
    <v-text-field
      v-model="teacher.name"
      label="ชื่อ"
      required
      :rules="nameRules"
    ></v-text-field>
    <v-text-field
      v-model="teacher.lastName"
      label="นามสกุล"
      required
      :rules="lastNameRules"
    ></v-text-field>
    <v-text-field
      v-model="teacher.phoneNumber"
      label="เบอร์โทรศัพท์"
    ></v-text-field>
    <v-file-input
      @change="onUploadImage"
      accept="image/*"
      label="File input"
    ></v-file-input>
    <v-img
      v-if="teacher.imageUrl"
      class="mb-4"
      max-width="250"
      :src="teacher.imageUrl"
    ></v-img>
    <v-btn color="primary" class="mr-4" @click="submit"> ตกลง </v-btn>
    <v-btn color="secondary" class="mr-4" @click="clear"> เคลียร์ </v-btn>
    <v-btn @click="back"> กลับ </v-btn>
  </v-form>
</template>

<script>
export default {
  props: {
    teacher: {
      type: Object,
      default() {
        return {
          prefix: '',
          name: '',
          lastName: '',
          phoneNumber: '',
          imageUrl: '',
        }
      },
    },
  },
  data() {
    return {
      file: '',
      prefixRules: [(v) => !!v || 'กรุณากรอก คำนำหน้า'],
      nameRules: [(v) => !!v || 'กรุณากรอก ชื่อ'],
      lastNameRules: [(v) => !!v || 'กรุณากรอก นามสกุล'],
      phoneNumberRules: [(v) => !!v || 'กรุณากรอก เบอร์โทรศัพท์'],
    }
  },
  methods: {
    async onUploadImage(file) {
      if (!file) return
      this.file = file
      var base64 = await this.toBase64(file)
      this.image = base64
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },
    clear() {
      this.file = null
      this.$refs.form.reset()
    },
    submit() {
      if (!this.$refs.form.validate()) return
      this.$emit(
        'submit',
        {
          ...this.teacher,
          fullName: `${this.teacher.prefix}${this.teacher.name} ${this.teacher.lastName}`,
        },
        this.file
      )
    },
    back() {
      this.$router.go(-1)
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped></style>
