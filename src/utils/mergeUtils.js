export function analyzeMergeCompatibility(contact1, contact2) {
  const compatibility = {
    score: 0,
    matches: [],
    differences: [],
    mergedResult: {}
  }

  // Compare name similarity
  if (contact1["First Name"]?.toLowerCase() === contact2["First Name"]?.toLowerCase() &&
      contact1["Last Name"]?.toLowerCase() === contact2["Last Name"]?.toLowerCase()) {
    compatibility.score += 3
    compatibility.matches.push('name')
  }

  // Compare email addresses
  if (contact1["Email"] && contact2["Email"]) {
    if (contact1["Email"].toLowerCase() === contact2["Email"].toLowerCase()) {
      compatibility.score += 2
      compatibility.matches.push('email')
    }
  }

  // Compare phone numbers (normalized)
  const phone1 = contact1["Phone"]?.replace(/\D/g, '')
  const phone2 = contact2["Phone"]?.replace(/\D/g, '')
  if (phone1 && phone2 && phone1 === phone2) {
    compatibility.score += 2
    compatibility.matches.push('phone')
  }

  // Create merged result
  compatibility.mergedResult = createMergedContact(contact1, contact2)

  return compatibility
}

function createMergedContact(contact1, contact2) {
  return {
    "First Name": contact1["First Name"] || contact2["First Name"],
    "Last Name": contact1["Last Name"] || contact2["Last Name"],
    "Email": contact1["Email"] || contact2["Email"],
    "Phone": contact1["Phone"] || contact2["Phone"],
    "Mobile": contact1["Mobile"] || contact2["Mobile"],
    "Work": contact1["Work"] || contact2["Work"],
    "Company": contact1["Company"] || contact2["Company"],
    "Job Title": contact1["Job Title"] || contact2["Job Title"],
    // Add other fields as needed
  }
}