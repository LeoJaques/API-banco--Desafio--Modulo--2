const format = require('date-fns/format') 

const formatDate = (date) => {
  const [ dia, mes, ano ] = date.split('/')

  if (!dia || !mes || !ano) {
    return format(new Date(), "yyyy-MM-dd")
  }
  
  return format(new Date(ano, mes-1, dia), "yyyy-MM-dd")
}

module.exports = formatDate