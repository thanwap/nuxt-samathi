<template>
  <div>
    <h1>บท - รายการ</h1>
    <v-card>
      <div class="d-flex flex-row flex-nowrap justify-space-between">
        <div class="ma-2">
          <v-btn color="primary" class="mr-4" @click="goToAdd"> เพิ่ม </v-btn>
        </div>
      </div>

      <v-card-subtitle>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="ค้นหา"
          single-line
          hide-details
        ></v-text-field>
      </v-card-subtitle>

      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="chapters"
        :search="search"
      >
        <template v-slot:[`item.id`]="{ item }">
          <v-btn
            @click="goToEdit(item.id)"
            class="mx-2"
            fab
            medium
            color="secondary"
          >
            <v-icon dark> mdi-pencil </v-icon>
          </v-btn>
          <v-btn
            @click="deleteItem(item.id)"
            class="mx-2"
            fab
            medium
            color="red"
          >
            <v-icon dark> mdi-delete </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">คุณแน่ใจหรือไม่ที่จะลบบท ?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">ยกเลิก</v-btn>
          <v-btn color="red darken-1" text @click="deleteConfirm">ตกลง</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'บท', value: 'chapterNumber', filterable: true },
        { text: 'เล่ม', value: 'bookNumber' },
        { text: 'ชื่อ', value: 'name' },
        { text: 'action', value: 'id' },
      ],
      chapters: [],
      search: '',
      loading: false,
      dialogDelete: false,
      deleteId: '',
    }
  },
  methods: {
    async loadItems() {
      this.chapters = []
      this.loading = true
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
      this.loading = false
    },
    goToAdd() {
      this.$router.push({
        path: '/chapter/add',
      })
    },
    goToEdit(id) {
      this.$router.push({
        path: '/chapter/' + id,
      })
    },
    deleteItem(id) {
      this.dialogDelete = true
      this.deleteId = id
    },
    async deleteConfirm() {
      await this.$fire.database.ref('chapter/' + this.deleteId).remove()
      this.deleteId = ''
      this.dialogDelete = false
      await this.loadItems()
    },
    closeDelete() {
      this.dialogDelete = false
    },
  },
  mounted() {
    this.loadItems()
  },
}
</script>

<style lang="scss" scoped></style>
