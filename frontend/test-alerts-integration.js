// Simple test to verify MedicationAlerts integration
import { mockPatients } from './src/mocks/patients.js'

const patient = mockPatients[0] // Restituto Arapipap
console.log('Patient:', patient.name)
console.log('Allergies:', patient.allergies)
console.log('Medications:', patient.medications?.map(m => m.name))

// Check if patient has both allergies and medications that should trigger alerts
const hasAllergies = patient.allergies && patient.allergies.length > 0
const hasMedications = patient.medications && patient.medications.length > 0

console.log('Should show alerts:', hasAllergies && hasMedications)

// Check for specific allergy matches
if (hasAllergies && hasMedications) {
  patient.allergies.forEach(allergy => {
    patient.medications.forEach(medication => {
      const allergenLower = allergy.allergen.toLowerCase()
      const medicationNameLower = medication.name.toLowerCase()
      
      if (medicationNameLower.includes(allergenLower) || 
          allergenLower.includes(medicationNameLower)) {
        console.log(`ALERT: ${medication.name} matches allergy to ${allergy.allergen}`)
      }
    })
  })
}