interface AgeDetails {
  years: number
  months: number
  days: number
}

export function calculateAge(dateOfBirth: string): AgeDetails {
  if (!dateOfBirth) return { years: 0, months: 0, days: 0 }
  
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  
  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()
  let days = today.getDate() - birthDate.getDate()
  
  // Adjust for negative months or days
  if (days < 0) {
    months--
    // Get the last day of the previous month
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += lastMonth.getDate()
  }
  
  if (months < 0) {
    years--
    months += 12
  }
  
  return { years, months, days }
}

export function formatAge(age: AgeDetails): string {
  if (age.years > 0) {
    return `${age.years}`
  }
  
  if (age.months > 0) {
    return `${age.months}m`
  }
  
  return `${age.days}d`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

export function validateDateOfBirth(dateOfBirth: string): string {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  
  if (birthDate > today) {
    return 'Date of birth cannot be in the future'
  }
  
  // Optional: Add maximum age validation (e.g., 150 years)
  const maxAge = 150
  const age = calculateAge(dateOfBirth)
  if (age.years > maxAge) {
    return `Age cannot be greater than ${maxAge} years`
  }
  
  return ''
}

export function validateCaseNumber(caseNumber: string, existingCaseNumbers: string[]): string {
  if (!caseNumber) {
    return 'Case number is required'
  }
  if (caseNumber.length > 6) {
    return 'Case number must be 6 digits or less'
  }
  if (!/^\d+$/.test(caseNumber)) {
    return 'Case number must contain only digits'
  }
  if (existingCaseNumbers.includes(caseNumber.padStart(6, '0'))) {
    return 'Case number already exists'
  }
  return ''
} 