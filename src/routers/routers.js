const express = require('express')
const {
  listBankAccounts,
  createAccount,
  updateUser,
  deleteAccount,
  depositAccount,
  withdrawBalance,
  transferBetweenAccounts,
  consultBalance,
  accountStatement
} = require('../controllers/bankControllers')

const {
  verifyNoBody,
  verifyPassword,
  validateAccountParamsFromBody,
  verifyUniqueCpfAndEmail,
  verifyNoParams,
  verifyNoQuery,
  verifyAccountBalanceToDeleteAccount,
  checkIdExistsByParams,
  checkIdExistsUnderscoreByBody,
  verifyValue,
  verifyPasswordUnderscore,
  verifyPasswordByBody,
  accountBalanceCheck,
  accountVerificationForTransfer,
  verifyPasswordByQuery,
  checkIdExistsUnderscoreByQuery
} = require('../middlewares/verification')

const router = express.Router()

// Listagem de contas bancárias
router.get('/contas', verifyNoBody, verifyPasswordUnderscore, listBankAccounts)

// Criar conta bancária
router.post(
  '/contas',
  verifyNoParams,
  verifyNoQuery,
  validateAccountParamsFromBody,
  verifyUniqueCpfAndEmail,
  createAccount
)

// Atualizar os dados do usuário da conta bancária
router.put(
  '/contas/:numeroConta/usuario',
  checkIdExistsByParams,
  validateAccountParamsFromBody,
  verifyUniqueCpfAndEmail,
  updateUser
)

// Excluir uma conta bancária
router.delete(
  '/contas/:numeroConta',
  checkIdExistsByParams,
  verifyAccountBalanceToDeleteAccount,
  deleteAccount
)

// Depositar em uma conta bancária
router.post(
  '/transacoes/depositar',
  verifyNoParams,
  verifyNoQuery,
  verifyValue,
  checkIdExistsUnderscoreByBody,
  depositAccount
)

// Sacar de uma conta bancária
router.post(
  '/transacoes/sacar',
  verifyNoParams,
  verifyNoQuery,
  verifyValue,
  checkIdExistsUnderscoreByBody,
  verifyPasswordByBody,
  accountBalanceCheck,
  withdrawBalance
)
// Transferir valores entre contas bancárias
router.post(
  '/transacoes/transferir',
  verifyNoParams,
  verifyNoQuery,
  verifyValue,
  accountVerificationForTransfer,
  transferBetweenAccounts
)

// Consultar saldo da conta bancária
router.get(
  '/contas/saldo',
  verifyNoBody,
  verifyNoParams,
  checkIdExistsUnderscoreByQuery,
  verifyPasswordByQuery,
  consultBalance
)

// Emitir extrato bancário
router.get(
  '/contas/extrato',
  verifyNoBody,
  verifyNoParams,
  checkIdExistsUnderscoreByQuery,
  verifyPasswordByQuery,
  accountStatement
)

module.exports = router
