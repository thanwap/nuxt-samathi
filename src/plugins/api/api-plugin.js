import teacherApi from './teacher'
import chapterApi from './chapter'

export default ({ app }, inject) => {
  inject('services', {
    teacherApi: teacherApi.client(app),
    chapterApi: chapterApi.client(app),
  })
}
