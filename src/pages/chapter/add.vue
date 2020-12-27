<template>
  <div>
    <h1>หัวข้อ - เพิ่ม</h1>
    <chapter-form @submit="submit"></chapter-form>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> หัวข้อ </v-card-title>
        <v-card-text>อัพโหลดสำเร็จ</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="goToChapterList">
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
import ChapterForm from '../../components/chapter/ChapterForm'
export default {
  components: {
    'chapter-form': ChapterForm,
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
    async submit(chapter) {
      this.loading = true
      const chapterRef = this.$fire.database.ref('chapter').push()
      try {
        await chapterRef.set(chapter)
        this.loading = false
        this.dialog = true
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    goToChapterList() {
      this.$router.push({
        path: '/chapter',
      })
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped></style>
