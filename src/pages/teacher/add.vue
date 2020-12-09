<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field v-model="prefix" label="คำนำหน้า" required></v-text-field>
      <v-text-field v-model="name" label="ชื่อ" required></v-text-field>
      <v-text-field v-model="lastName" label="นามสกุล" required></v-text-field>
      <v-text-field v-model="phoneNumber" label="เบอร์โทรศัพท์"></v-text-field>
      <v-file-input
        @change="onUploadImage"
        accept="image/*"
        label="File input"
      ></v-file-input>
      <v-img v-if="image" class="mb-4" max-width="250" :src="image"></v-img>
      <v-btn class="mr-4" @click="submit"> submit </v-btn>
      <v-btn @click="clear"> clear </v-btn>
    </v-form>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> อาจารย์ </v-card-title>
        <v-card-text>อัพโหลดสำเร็จ</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="clear"> ตกลง </v-btn>
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
  data() {
    return {
      valid: true,
      prefix: '',
      name: '',
      lastName: '',
      phoneNumber: '',
      image: '',
      file: null,
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
    async submit() {
      this.loading = true
      const teacherRef = this.$fire.database.ref('teacher').push()
      try {
        let teacher = {
          prefix: this.prefix,
          name: this.name,
          lastName: this.lastName,
          phoneNumber: this.phoneNumber,
          imageUrl: '',
        }
        await teacherRef.set(teacher)
        console.log(teacherRef)

        if (this.file) {
          const imageRef = this.$fire.storage
            .ref()
            .child(`images/teachers/${teacherRef.key}/${this.file.name}`)
          await imageRef.put(this.file)
          const imageUrl = await imageRef.getDownloadURL()
          await teacherRef.set({ ...teacher, imageUrl: imageUrl })
        }
        this.clear()
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
      this.dialog = false
    },
    async onUploadImage(file) {
      if (!file) return
      console.log(file)
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
  },
  mounted() {},
}
</script>

<style lang="scss" scoped></style>
