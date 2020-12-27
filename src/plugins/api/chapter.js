export default {
  client(app) {
    return {
      async list() {
        let result = []
        const itemRef = app.$fire.database.ref('chapter')
        const itemSnapshot = await itemRef.once('value')
        const items = itemSnapshot.val()
        for (const key in items) {
          result.push({
            id: key,
            chapterNumber: items[key].chapterNumber,
            name: items[key].name,
            bookNumber: items[key].bookNumber,
            time: items[key].time || 0,
          })
        }
        return result
      },
      async listWithKey() {
        const chaptersRef = app.$fire.database.ref('chapter')
        const chapterSnapshot = await chaptersRef.once('value')
        const chapters = chapterSnapshot.val()
        return chapters
      },
      async add(chapter) {
        const chapterRef = app.$fire.database.ref('chapter').push()
        await chapterRef.set(chapter)
        return chapterRef.key
      },
      async update(id, chapter) {
        const chapterRef = app.$fire.database.ref('chapter/' + id)
        await chapterRef.update({
          chapterNumber: chapter.chapterNumber,
          name: chapter.name,
          bookNumber: chapter.bookNumber,
          time: chapter.time,
        })
      },
      async delete(id) {
        await app.$fire.database.ref('chapter/' + id).remove()
      },
    }
  },
}
