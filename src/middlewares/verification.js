const { msg } = require('../utils/objectMassage')
const dataBase = require('../bancodedados')
const verifyIfIsNumber = require('../utils/testNumericType')
const checkIdExistsInDatabase = require('../utils/verifyIdExistInDatabase')

//Verificar senha
const verifyPasswordUnderscore = (req, res, next) => {
  const { senha_banco } = req.query

  if (senha_banco === dataBase.banco.senha) {
    return next()
  }

  return res.status(401).json(msg('Error, incorrect password'))
}

//Verificar senha
const verifyPasswordByBody = (req, res, next) => {
  const { senha, numero_conta } = req.body

  const account = dataBase.contas.find(account => account.numero === numero_conta)

  if (senha === account.usuario.senha) {
    return next()
  }

  return res.status(401).json(msg('Error, incorrect password'))
}

//Verificar senha
const verifyPasswordByQuery = (req, res, next) => {
  const { senha, numero_conta } = req.query

  const account = dataBase.contas.find(account => account.numero === numero_conta)

  if (senha === account.usuario.senha) {
    return next()
  }

  return res.status(401).json(msg('Error, incorrect password'))
}

// Verificar se o corpo da requisição está vazio
const verifyNoBody = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next()
  }

  return res.status(400).json(msg('Error sending the request body. Body not require'))
}

// Verificar se o `req.params` está vazio
const verifyNoParams = (req, res, next) => {
  if (Object.keys(req.params).length === 0) {
    return next()
  }

  return res.status(400).json(msg('Error sending the request params. Params not require'))
}

// Verificar se o `req.query` está vazio
const verifyNoQuery = (req, res, next) => {
  if (Object.keys(req.query).length === 0) {
    return next()
  }

  return res.status(400).json(msg('Error sending the request query.'))
}

//Verificar corpo da req para as propriedades do usuario
const validateAccountParamsFromBody = (req, res, next) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res.status(400).json(msg('Error sending request body'))
  } else {
    return next()
  }
}

//Verificar se o CPF e o e-mail não é repetido
const verifyUniqueCpfAndEmail = (req, res, next) => {
  const cpf = req.body.cpf
  const email = req.body.email

  //Verificar tamanho CPF
  if (cpf.length !== 11 || !verifyIfIsNumber(cpf)) {
    return res.status(400).json(msg('CPF is incorrect format'))
  }

  // Verifique se o e-mail já existe
  const emailCheck = dataBase.contas.find(
    account => account.usuario.email === email
  )
  if (emailCheck) {
    res.status(400).json(msg('The email is already in use.'))
    return
  }

  // Verifique se o CPF já existe
  const cpfCheck = dataBase.contas.find(account => account.usuario.cpf === cpf)

  if (cpfCheck) {
    res.status(400).json(msg('The CPF is already in use.'))
    return
  }

  // Se chegar aqui, o CPF e o e-mail são únicos
  next()
}

const checkIdExistsByParams = (req, res, next) => {
  const { numeroConta } = req.params

  

  if (!verifyIfIsNumber(numeroConta)) {
    return res
      .status(400)
      .json(
        msg(
          "Parameter's primitive type is incorrect, I was expecting a numeric type in params request"
        )
      )
  }

  const account = dataBase.contas.find(
    account => account.numero === numeroConta
  )

  if (!account) {
    return res.status(404).json(msg('User not found'))
  }

  return next()
}

const checkIdExistsUnderscoreByQuery = (req, res, next) => {
  const { numero_conta } = req.query

  if (!verifyIfIsNumber(numero_conta)) {
    return res
      .status(400)
      .json(
        msg(
          "Parameter's primitive type is incorrect, I was expecting a numeric type in body request"
        )
      )
  }

  const account = dataBase.contas.find(
    account => account.numero === numero_conta
  )

  if (!account) {
    return res.status(404).json(msg('User not found'))
  }

  return next()
}

const checkIdExistsUnderscoreByBody = (req, res, next) => {
  const { numero_conta } = req.body

  if (!verifyIfIsNumber(numero_conta)) {
    return res
      .status(400)
      .json(
        msg(
          "Parameter's primitive type is incorrect, I was expecting a numeric type in body request"
        )
      )
  }

  const account = dataBase.contas.find(
    account => account.numero === numero_conta
  )

  if (!account) {
    return res.status(404).json(msg('User not found'))
  }

  return next()
}

const verifyAccountBalanceToDeleteAccount = (req, res, next) => {
  const { numeroConta } = req.params

  const account = dataBase.contas.find(
    account => account.numero === numeroConta
  )

  if (account.saldo !== 0) {
    return res
      .status(400)
      .json(
        msg(
          'Account with balance, to delete it is necessary that there is no balance.'
        )
      )
  }

  return next()
}

const verifyValue = (req, res, next) => {
  const { valor } = req.body

  if (!verifyIfIsNumber(valor) || !valor) {
    return res.status(400).json(msg('The "valor" property must be a number.'))
  }

  return next()
}

const accountBalanceCheck = (req, res, next) => {
  const { valor, numero_conta } = req.body
  const account = dataBase.contas.find(account => account.numero === numero_conta)  

  if (account.saldo < valor) {
    return res.status(400).json(msg('Insufficient balance'))
  }

  return next()

}

const accountVerificationForTransfer = (req, res, next) => {
  const { numero_conta_origem, numero_conta_destino, senha } = req.body

  if (!checkIdExistsInDatabase(numero_conta_origem)) {
    return res
      .status(400)
      .json(msg('the parameter "numero_conta_origem" is incorrect'))
  }

  if (!checkIdExistsInDatabase(numero_conta_destino)) {
    return res
      .status(400)
      .json(msg('the parameter "numero_conta_destino" is incorrect'))
  }

  return next()
}

module.exports = {
  verifyPasswordUnderscore,
  verifyPasswordByBody,
  verifyNoBody,
  verifyNoParams,
  verifyNoQuery,
  validateAccountParamsFromBody,
  verifyUniqueCpfAndEmail,
  checkIdExistsByParams,
  checkIdExistsUnderscoreByBody,
  verifyAccountBalanceToDeleteAccount,
  verifyValue,
  accountBalanceCheck,
  accountVerificationForTransfer,
  verifyPasswordByQuery,
  checkIdExistsUnderscoreByQuery
}
