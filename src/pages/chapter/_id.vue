<template>
  <div>
    <h1>หัวข้อ - แก้ไข</h1>
    <chapter-form
      @submit="submit"
      v-if="chapter"
      :chapter="chapter"
    ></chapter-form>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> หัวข้อ </v-card-title>
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
import ChapterForm from '../../components/chapter/ChapterForm'
export default {
  components: {
    'chapter-form': ChapterForm,
  },
  data() {
    return {
      chapter: null,
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
    async submit(chapter, fileImage) {
      this.loading = true
      const chapterRef = this.$fire.database.ref('chapter/' + this.id)
      try {
        await chapterRef.update({
          chapterNumber: chapter.chapterNumber,
          name: chapter.name,
          bookNumber: chapter.bookNumber,
        })

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
        path: '/chapter',
      })
    },
  },
  async mounted() {
    if (this.id) {
      const chapterSnapshot = await this.$fire.database
        .ref('chapter/' + this.id)
        .once('value')
      const chapter = chapterSnapshot.val()

      if (!chapter) {
        this.$router.push({ path: '/chapter/add' })
      }
      this.chapter = chapter
    } else {
      this.$router.push({ path: '/chapter/add' })
    }
  },
}
</script>

<style lang="scss" scoped></style>
