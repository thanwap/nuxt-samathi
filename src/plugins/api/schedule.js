export default {
  client(app) {
    return {
      async get(id) {
        const scheduleSnapshot = await app.$fire.database
          .ref('schedule/' + id)
          .once('value')
        const schedule = scheduleSnapshot.val()
        return schedule
      },
      async listWithKey() {
        const ref = app.$fire.database.ref('schedule')
        const snapshot = await ref.once('value')
        const result = snapshot.val()
        return result
      },
      async add(schedule) {
        const scheduleRef = app.$fire.database.ref('schedule').push()
        await scheduleRef.set(schedule)
        return scheduleRef.key
      },
      async update(id, schedule) {
        const scheduleRef = app.$fire.database.ref('schedule/' + id)
        await scheduleRef.update({
          ...schedule,
        })
      },
      async delete(id) {
        await app.$fire.database.ref('schedule/' + id).remove()
      },
      async isHaveCreatedDate(schedule) {
        const scheduleRef = app.$fire.database.ref('schedule')
        const scheduleSnapshot = await scheduleRef
          .orderByChild('date')
          .equalTo(schedule.date)
          .once('value')

        return scheduleSnapshot.val() ? true : false
      },
      async getScheduleByDate(date = new Date()) {
        const scheduleRef = app.$fire.database.ref('schedule')

        const scheduleSnapshot = await scheduleRef
          .orderByChild('date')
          .equalTo(date.toLocaleDateString('en-CA'))
          .once('value')
        const schedule = scheduleSnapshot.val()

        if (schedule) {
          let result = {
            ...Object.values(schedule)[0],
            scheduleId: Object.keys[0],
          }
          console.log(result.teacherId)
          const teacherSnashot = await app.$fire.database
            .ref('teacher/' + result.teacherId)
            .once('value')
          const teacher = teacherSnashot.val()
          const chapterSnashot = await app.$fire.database
            .ref('chapter/' + result.chapterId)
            .once('value')
          const chapter = chapterSnashot.val()

          result.teacher = teacher
          result.chapter = chapter

          return result
        }

        return null
      },
    }
  },
}
