export function checkPasswordRules(password) {
  return {
    length:  password.length >= 8,
    upper:   /[a-z]/.test(password) && /[A-Z]/.test(password),
    number:  /[0-9]/.test(password),
    special: /[$!@#%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  }
}

export function allRulesPassed(password) {
  const checks = checkPasswordRules(password)
  return Object.values(checks).every(Boolean)
}