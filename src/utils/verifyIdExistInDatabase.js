const verifyIfIsNumber = require("./testNumericType")
const dataBase = require('../bancodedados')

const checkIdExistsInDatabase = (numero_conta) => {

  const account = dataBase.contas.find(
    account => account.numero === numero_conta
  )
  
  if (!verifyIfIsNumber(numero_conta) || !account) {
    return false
  
  }

    return true
}

module.exports = checkIdExistsInDatabase