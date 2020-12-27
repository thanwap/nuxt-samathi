import teacherApi from './teacher'

export default ({ app }, inject) => {
  inject('services', { teacherApi: teacherApi.client(app) })
}
