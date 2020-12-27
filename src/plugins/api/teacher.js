export default {
  client(app) {
    return {
      async list() {
        const result = []
        const itemRef = app.$fire.database.ref('teacher')
        const itemSnapshot = await itemRef.once('value')
        const teachers = itemSnapshot.val()
        for (const key in teachers) {
          result.push({
            id: key,
            name: teachers[key].name,
            lastName: teachers[key].lastName,
            fullName: teachers[key].fullName
              ? teachers[key].fullName
              : `${teachers[key].prefix}${teachers[key].name} ${teachers[key].lastName}`,
            phoneNumber: teachers[key].phoneNumber,
            prefix: teachers[key].prefix,
            imageUrl: teachers[key].imageUrl
              ? teachers[key].imageUrl
              : 'https://firebasestorage.googleapis.com/v0/b/nuxt-samathi.appspot.com/o/images%2Fteacher-mock.jpg?alt=media&token=6ae7ae12-f7db-4c43-8b0c-97e74909bcb3',
          })
        }
        return result
      },
      async add(teacher, fileImage) {
        const teacherRef = app.$fire.database.ref('teacher').push()
        try {
          await teacherRef.set(teacher)

          if (fileImage) {
            const imageRef = app.$fire.storage
              .ref()
              .child(`images/teachers/${teacherRef.key}/${fileImage.name}`)
            await imageRef.put(fileImage)
            const imageUrl = await imageRef.getDownloadURL()
            await teacherRef.set({ ...teacher, imageUrl: imageUrl })
          }
        } catch (e) {
          throw e
        }
      },
      async update(id, teacher, fileImage) {
        const oldTeacherRef = app.$fire.database.ref('teacher/' + id)
        let imageUrl = teacher.imageUrl

        if (fileImage) {
          const imageRef = app.$fire.storage
            .ref()
            .child(`images/teachers/${id}/${fileImage.name}`)
          await imageRef.put(fileImage)
          imageUrl = await imageRef.getDownloadURL()
          teacher.imageUrl = imageUrl
        }

        await oldTeacherRef.update(teacher)
      },
      async delete(id) {
        await app.$fire.database.ref('teacher/' + id).remove()
      },
    }
  },
}
