const format = require('date-fns/format') 

const formatDateHour = () => {
  return format(new Date(), "yyyy-MM-dd HH:mm:ss");
}

module.exports = formatDateHour