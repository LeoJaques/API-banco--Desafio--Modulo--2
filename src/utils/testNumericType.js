const verifyIfIsNumber = (id) => {
  const testeType = parseInt(id)

  if (isNaN(testeType)) {
    return false
  }

  return true
}

module.exports = verifyIfIsNumber