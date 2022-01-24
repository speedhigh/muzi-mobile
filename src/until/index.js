function checkId(id) {
  let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return !!reg.test(id)
}

function checkPhone(tel) {
  let phonereg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
  return !!phonereg.test(tel)
}

export { checkId, checkPhone }