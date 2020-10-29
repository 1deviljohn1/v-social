import moment from 'moment'
import 'moment/locale/es'
moment.locale('ru')

const formatDate = (timestamp) => {
  return moment(timestamp).format('DD.MM.YYYY')
}

const formatDatetime = (timestamp) => {
  return moment(timestamp).format('DD MMM YYYY HH:mm')
}

const formatDatetimeFromNow = (timestamp) => {
  return moment(timestamp).fromNow()
}

export { formatDate, formatDatetime, formatDatetimeFromNow }
