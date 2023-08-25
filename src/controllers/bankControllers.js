let dataBase = require('../bancodedados')
const formatDate = require('../utils/formatBirthDate')
const { msg } = require('../utils/objectMassage')
const nextId = require('../utils/nextId')
const bancodedados = require('../bancodedados')
const formatDateHour = require('../utils/formatDateHour')
const checkIdExistsInDatabase = require('../utils/verifyIdExistInDatabase')

// Listagem de contas bancárias
const listBankAccounts = (req, res) => {
  return res.json(dataBase.contas)
}

// Criar conta bancária
const createAccount = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

  const newUser = {
    numero: nextId().toString(),
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento: formatDate(data_nascimento),
      telefone,
      email,
      senha
    }
  }

  dataBase.contas.push(newUser)

  return res.status(201).json(newUser)
}

// Atualizar os dados do usuário da conta bancária
const updateUser = (req, res) => {
  const { numeroConta } = req.params

  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

  const account = dataBase.contas.find(
    account => account.numero === numeroConta
  )

  account.usuario.nome = nome
  account.usuario.cpf = cpf
  account.usuario.data_nascimento = formatDate(data_nascimento)
  account.usuario.telefone = telefone
  account.usuario.email = email
  account.usuario.senha = senha

  return res.json(msg('Conta atualizada com sucesso'))
}

// Excluir uma conta bancária
const deleteAccount = (req, res) => {
  const { numeroConta } = req.params

  dataBase.contas = dataBase.contas.filter(conta => {
    return conta.numero !== numeroConta
  })

  return res.json(msg('Conta excluída com sucesso'))
}

// Depositar em uma conta bancária
const depositAccount = (req, res) => {
  const { numero_conta, valor } = req.body

  dataBase.contas.find(account => {
    if (account.numero === numero_conta) {
      account.saldo += valor
    }
  })

  const newHistoric = {
    data: `${formatDateHour()}`,
    numero_conta,
    valor
  }

  bancodedados.depositos.push(newHistoric)

  return res.json(msg('Depósito realizado com sucesso'))
}

// Sacar de uma conta bancária
const withdrawBalance = (req, res) => {
  const { numero_conta, valor } = req.body

  dataBase.contas.find(account => {
    if (account.numero === numero_conta) {
      account.saldo -= valor
    }
  })

  const newWithdraw = {
    data: `${formatDateHour()}`,
    numero_conta,
    valor
  }

  dataBase.saques.push(newWithdraw)

  return res.json(msg('Saque realizado com sucesso'))
}

// Transferir valores entre contas bancárias
const transferBetweenAccounts = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body
  const historicalTransfer = dataBase.transferencias

  const accountOrigin = dataBase.contas.find(
    account => account.numero === numero_conta_origem
  )

  if (senha !== accountOrigin.usuario.senha) {
    return res.status(403).json(msg('Account number or password incorrect'))
  }

  if (accountOrigin.saldo < valor) {
    return res.status(400).json(msg('Insufficient balance'))
  }

  const accountDetiny = dataBase.contas.find(
    account => account.numero === numero_conta_destino
  )

  accountOrigin.saldo -= valor
  accountDetiny.saldo += valor

  const newTrensfer = {
    data: `${formatDateHour()}`,
    numero_conta_origem,
    numero_conta_destino,
    valor
  }

  dataBase.transferencias.push(newTrensfer)

  return res.json(msg('Transferência realizado com sucesso'))
}

// Consultar saldo da conta bancária
const consultBalance = (req, res) => {
  const { numero_conta } = req.query


  const account = dataBase.contas.find(
    account => account.numero === numero_conta
  )


  return res.json(msg(account.saldo))
}

// Emitir extrato bancário
const accountStatement = (req, res) => {
  const { numero_conta, senha } = req.query

  const depositos = dataBase.depositos.filter(
    deposito => deposito.numero_conta === numero_conta
  )

  const saques = dataBase.saques.filter(
    deposito => deposito.numero_conta === numero_conta
  )

  const transferenciasEnviadas = dataBase.transferencias.filter(
    transferencia => {
      return transferencia.numero_conta_origem === numero_conta
    }
  )

  const transferenciasRecebidas = dataBase.transferencias.filter(
    transferencia => {
      return transferencia.numero_conta_destino === numero_conta
    }
  )

  const statement = {
    depositos,
    saques,
    transferenciasEnviadas,
    transferenciasRecebidas
  }

  return res.json(statement)
}

module.exports = {
  listBankAccounts,
  createAccount,
  updateUser,
  deleteAccount,
  depositAccount,
  withdrawBalance,
  transferBetweenAccounts,
  consultBalance,
  accountStatement
}
