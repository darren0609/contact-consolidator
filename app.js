console.log("JS loaded ✅");

import Papa from "https://esm.sh/papaparse";
import { parsePhoneNumberFromString } from "libphonenumber-js";

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");

  if (!fileInput) {
    console.error("fileInput element not found.");
    return;
  }

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    parseCSV(file);
  });
});

// Define a flexible mapping object for all fields
const fieldMappings = {
  firstName: ["first name", "fname", "first_name"],
  middleName: ["middle name", "mname", "middle_name"],
  lastName: ["last name", "lname", "last_name"],
  email: ["email", "home email", "work email"],
  phone: ["phone", "mobile", "contact number"],
  homeAddress: ["home address", "home address1"],
  workAddress: ["work address", "work address1"],
  homeCity: ["home city", "home city1"],
  workCity: ["work city", "work city1"],
  homeState: ["home state"],
  workState: ["work state"],
  homeZip: ["home zip", "home postal code"],
  workZip: ["work zip", "work postal code"],
  homeCountry: ["home country"],
  workCountry: ["work country"],
  website: ["website", "webpage", "url"]
};

// Function to normalize and map headers
function mapFields(headers) {
  const mappedFields = {};

  headers.forEach((header) => {
    const normalizedHeader = header.trim().toLowerCase();

    // Find the matching field in the mapping object
    for (const [field, variations] of Object.entries(fieldMappings)) {
      if (variations.includes(normalizedHeader)) {
        mappedFields[field] = header; // Map the original header to the field
        break;
      }
    }
  });

  return mappedFields;
}

function parseCSV(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const result = event.target.result;
    const parsed = Papa.parse(result, {
      header: true,
      skipEmptyLines: true
    });

    const parsedData = parsed.data;
    console.log("Parsed CSV Data:", parsedData);

    // Extract and map fields based on available headers
    const headers = Object.keys(parsedData[0] || []);
    const mappedFields = mapFields(headers);
    console.log("Mapped Fields:", mappedFields);

    displayContacts(parsedData, mappedFields);
  };

  reader.readAsText(file);
}

// Function to format phone numbers using libphonenumber-js
function formatPhoneNumber(phone) {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone);
    if (phoneNumber && phoneNumber.isValid()) {
      // Format the number in international format
      return phoneNumber.formatInternational();
    }
  } catch (error) {
    console.error("Error formatting phone number:", error);
  }

  // Return null if the phone number is invalid
  return null;
}

function displayContacts(parsedData, mappedFields) {
  const contactList = document.getElementById("contactList");
  const contactModal = document.getElementById("contactModal");
  const contactDetails = document.getElementById("contactDetails");
  const contactFullName = document.getElementById("contactFullName");
  const contactDetailsList = document.getElementById("contactDetailsList");
  const closeModalButton = document.getElementById("closeModal");
  const speedDial = document.getElementById("speedDial");

  // Ensure the container exists
  if (!contactList || !contactModal || !contactDetails || !contactFullName || !contactDetailsList || !closeModalButton || !speedDial) {
    console.error("Missing essential elements");
    return;
  }

  // Clear previous list and speed dial
  contactList.innerHTML = "";
  speedDial.innerHTML = "";

  // Group contacts alphabetically by the first letter of the last name
  const groupedContacts = parsedData.reduce((groups, contact) => {
    const lastName = contact[mappedFields.lastName] || "Unknown Last Name";
    const firstLetter = lastName.charAt(0).toUpperCase();
    if (!groups[firstLetter]) groups[firstLetter] = [];
    groups[firstLetter].push(contact);
    return groups;
  }, {});

  // Create speed dial navigation
  Object.keys(groupedContacts)
    .sort()
    .forEach((letter) => {
      const letterLink = document.createElement("a");
      letterLink.href = `#group-${letter}`;
      letterLink.textContent = letter;
      letterLink.className = "text-blue-500 hover:underline mx-2";
      speedDial.appendChild(letterLink);
    });

  // Display grouped contacts
  Object.keys(groupedContacts)
    .sort()
    .forEach((letter) => {
      const groupHeader = document.createElement("h2");
      groupHeader.id = `group-${letter}`;
      groupHeader.textContent = letter;
      groupHeader.className = "text-2xl font-bold mt-6 mb-4";
      contactList.appendChild(groupHeader);

      groupedContacts[letter].forEach((contact) => {
        // Extract fields
        const firstName = contact[mappedFields.firstName] || "Unknown First Name";
        const lastName = contact[mappedFields.lastName] || "Unknown Last Name";
        const phone = contact[mappedFields.phone] || "Unknown Phone";
        const email = contact[mappedFields.email] || "Unknown Email";
        const website = contact[mappedFields.website] || "No Website";

        // Address concatenation logic
        const homeAddress = contact[mappedFields.homeAddress] || "";
        const homeCity = contact[mappedFields.homeCity] || "";
        const homeState = contact[mappedFields.homeState] || "";
        const homeZip = contact[mappedFields.homeZip] || "";
        const homeCountry = contact[mappedFields.homeCountry] || "";

        const workAddress = contact[mappedFields.workAddress] || "";
        const workCity = contact[mappedFields.workCity] || "";
        const workState = contact[mappedFields.workState] || "";
        const workZip = contact[mappedFields.workZip] || "";
        const workCountry = contact[mappedFields.workCountry] || "";

        // Prioritize home address over work address
        let fullAddress = [homeAddress, homeCity, homeState, homeZip, homeCountry].filter(Boolean).join(", ");
        if (!fullAddress && workAddress) {
          fullAddress = [workAddress, workCity, workState, workZip, workCountry].filter(Boolean).join(", ");
        }
        if (!fullAddress) fullAddress = "No Address Provided";

        // Background color logic
        let backgroundClass = "bg-white"; // Default background
        if ([firstName, lastName, phone, email].includes("Unknown First Name") || [firstName, lastName, phone, email].includes("Unknown Last Name")) {
          backgroundClass = "bg-red-100"; // Highlight missing critical fields
        }

        // Format phone number
        const formattedPhone = formatPhoneNumber(phone);
        const isPhoneValid = !!formattedPhone;

        // Create a contact card
        const contactCard = document.createElement("div");
        contactCard.className = `${backgroundClass} shadow-md rounded-xl p-4 mb-4 flex flex-col gap-2 max-w-md`;

        contactCard.innerHTML = `
          <h2 class="text-xl font-semibold">${firstName} ${lastName}</h2>
          <div class="flex items-center gap-2 text-gray-600">
            <span data-lucide="phone" class="text-brown-500"></span>
            <span class="${isPhoneValid ? "" : "font-bold text-red-500"}">${isPhoneValid ? formattedPhone : phone}</span>
            ${
              !isPhoneValid
                ? `<button class="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm" onclick="editPhone('${phone}')">Edit</button>`
                : ""
            }
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <span data-lucide="mail" class="text-brown-500"></span>
            <span>${email}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <span data-lucide="map-pin" class="text-brown-500"></span>
            <span>${fullAddress}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <span data-lucide="globe" class="text-brown-500"></span>
            <span>${website}</span>
          </div>
        `;

        // Add event listener to show contact details in the modal
        contactCard.addEventListener("click", () => {
          contactFullName.innerText = `${firstName} ${lastName}`;
          contactDetailsList.innerHTML = "";

          Object.keys(contact).forEach((field) => {
            const fieldName = field || "Unknown Field";
            const fieldValue = contact[field] || "No Data";
            const fieldItem = document.createElement("div");
            fieldItem.innerHTML = `<strong>${fieldName}:</strong> ${fieldValue}`;
            contactDetailsList.appendChild(fieldItem);
          });

          contactModal.classList.remove("hidden");
        });

        // Append the contact card to the list
        contactList.appendChild(contactCard);
      });
    });

  // Close modal logic
  closeModalButton.addEventListener("click", () => {
    contactModal.classList.add("hidden");
  });

  contactModal.addEventListener("click", (event) => {
    if (event.target === contactModal) {
      contactModal.classList.add("hidden");
    }
  });

  // Render icons
  lucide.createIcons();
}

// Function to handle phone number editing
function editPhone(phone) {
  const newPhone = prompt("Edit Phone Number:", phone);
  if (newPhone) {
    alert(`Phone number updated to: ${newPhone}`);
    // Logic to update the phone number in the data can be added here
  }
}