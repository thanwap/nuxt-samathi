import teacherApi from './teacher'
import chapterApi from './chapter'
import scheduleApi from './schedule'

export default ({ app }, inject) => {
  inject('services', {
    teacherApi: teacherApi.client(app),
    chapterApi: chapterApi.client(app),
    scheduleApi: scheduleApi.client(app),
  })
}
