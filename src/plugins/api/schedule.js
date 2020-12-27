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
    }
  },
}
