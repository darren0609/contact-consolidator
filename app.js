import { parsePhoneNumberFromString } from "libphonenumber-js";

// State variables
let headers = [];
let contacts = [];
let filteredContacts = [];
let sortDirection = 'asc';
let currentSortField = 'Last Name';

// Icon mappings
const iconMappings = {
  "First Name": "user",
  "Last Name": "user",
  "Email": "mail",
  "Phone": "phone",
  "Mobile": "smartphone",
  "Other": "phone-call",
  "Company": "briefcase",
  "Job Title": "badge",
  "Birthday": "cake",
  "Notes": "sticky-note",
  "Home Address": "home",
  "Work Address": "building",
  "Home City": "map-pin",
  "Work City": "map-pin",
  "Home State": "map",
  "Work State": "map",
  "Home ZIP": "hash",
  "Work ZIP": "hash",
  "Home Country": "flag",
  "Work Country": "flag",
  "Website": "globe",
  "Social Media": "share-2",
  "Skype": "video",
  "LinkedIn": "linkedin",
  "Twitter": "twitter",
  "Facebook": "facebook",
  "Groups": "users",
  "Category": "folder",
  "Source": "database",
  "Created": "calendar",
  "Modified": "clock",
  "Custom1": "bookmark",
  "Custom2": "bookmark",
  "Custom3": "bookmark"
};

function resetApp() {
  headers = [];
  contacts = [];
  filteredContacts = [];
  document.getElementById("contact-list").innerHTML = "";
  document.getElementById("modal-content").innerHTML = "";
  document.getElementById("contact-modal").classList.add("hidden");
  document.getElementById("contact-modal").classList.remove("flex");
  
  // Reset filter and sort controls
  const filterInput = document.getElementById('filterInput');
  const filterField = document.getElementById('filterField');
  const sortField = document.getElementById('sortField');
  if (filterInput) filterInput.value = '';
  if (filterField) filterField.value = 'all';
  if (sortField) sortField.value = 'Last Name';
}

function filterContacts(searchTerm, filterField) {
  if (!searchTerm) {
    filteredContacts = [...contacts];
    return;
  }

  searchTerm = searchTerm.toLowerCase();
  filteredContacts = contacts.filter(contact => {
    if (filterField === 'all') {
      return Object.values(contact).some(value => 
        String(value).toLowerCase().includes(searchTerm)
      );
    }
    return String(contact[filterField] || '')
      .toLowerCase()
      .includes(searchTerm);
  });
}

function sortContacts() {
  filteredContacts.sort((a, b) => {
    const valueA = (a[currentSortField] || '').toLowerCase();
    const valueB = (b[currentSortField] || '').toLowerCase();
    
    if (sortDirection === 'asc') {
      return valueA.localeCompare(valueB);
    }
    return valueB.localeCompare(valueA);
  });
}

function isUnknown(value) {
  return !value || /unknown/i.test(value);
}

function buildAddress(contact) {
  const addressFields = [
    "Home Address", "Home City", "Home State", "Home ZIP", "Home Country",
    "Work Address", "Work City", "Work State", "Work ZIP", "Work Country"
  ];
  let address = "";
  for (let type of ["Home", "Work"]) {
    const parts = addressFields.filter(f => f.startsWith(type)).map(f => contact[f]).filter(Boolean);
    if (parts.length) {
      address = parts.join(", ");
      break;
    }
  }
  return address;
}

function formatPhoneNumber(phone) {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone);
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.formatInternational();
    }
  } catch (error) {
    console.error("Error formatting phone number:", error);
  }
  return null;
}

function getPhoneNumber(contact) {
  return contact["Phone"] || contact["Mobile"] || contact["Other"] || "No phone";
}

function displayContacts() {
  const container = document.getElementById("contact-list");
  container.className = "w-full max-w-4xl mx-0 space-y-4";
  container.innerHTML = "";

  // Apply filtering and sorting
  filterContacts(
    document.getElementById('filterInput').value,
    document.getElementById('filterField').value
  );
  sortContacts();

  filteredContacts.forEach((contact) => {
    let hasUnknown = Object.values(contact).some(isUnknown);
    let bgClass = hasUnknown ? "bg-red-600 hover:bg-red-500" : "bg-gray-700 hover:bg-gray-600";
    let address = buildAddress(contact);

    const phone = getPhoneNumber(contact);
    const formattedPhone = formatPhoneNumber(phone);
    const isPhoneValid = !!formattedPhone;

    const card = document.createElement("div");
    card.className = `flex items-center justify-between ${bgClass} p-4 rounded shadow text-white transition duration-200`;

    card.innerHTML = `
      <div class="flex flex-col min-w-0">
        <span class="font-semibold text-lg truncate">${contact["First Name"] || "Unnamed"} ${contact["Last Name"] || ""}</span>
        <span class="text-sm text-gray-300 truncate">${address}</span>
      </div>
      <div class="flex flex-col items-end text-sm text-gray-300 whitespace-nowrap mr-4">
        <span class="${isPhoneValid ? "" : "font-bold text-red-500"}">${isPhoneValid ? formattedPhone : phone}</span>
        <span>${contact["Email"] || "No email"}</span>
      </div>
      <div class="text-gray-400 hover:text-white">
        <button aria-label="Open contact details">⋮</button>
      </div>
    `;

    card.addEventListener("click", () => showContactModal(contact));
    container.appendChild(card);
  });

  // Initialize Lucide icons
  lucide.createIcons();
}

function showContactModal(contact) {
  const modal = document.getElementById("contact-modal");
  const content = document.getElementById("modal-content");
  content.innerHTML = "";

  const card = document.createElement("div");
  card.className = "bg-gray-800 text-white rounded-lg p-6 shadow-md w-[500px] transform transition-all duration-200";

  // Header section with close button
  const headerHTML = `
    <div class="flex flex-col space-y-6">
      <div class="flex items-start space-x-6">
        <div class="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
          <i data-lucide="user" class="w-12 h-12"></i>
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <h2 class="text-2xl font-bold">${contact["First Name"] || ""} ${contact["Last Name"] || "Unnamed"}</h2>
            <button 
              id="modal-close" 
              class="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <i data-lucide="x" class="w-6 h-6"></i>
            </button>
          </div>
          <div class="flex items-center gap-2 text-gray-400">
            <i data-lucide="briefcase" class="w-4 h-4"></i>
            <span>${contact["Company"] || "(No company)"}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400">
            <i data-lucide="badge" class="w-4 h-4"></i>
            <span>${contact["Job Title"] || "(No job title)"}</span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
  `;

  // Generate field entries
  const fieldEntriesHTML = Object.entries(contact)
    .filter(([key, value]) => {
      return !["First Name", "Last Name", "Company", "Job Title"].includes(key) && value;
    })
    .map(([key, value]) => {
      const icon = iconMappings[key] || "circle";
      return `
        <div class="bg-gray-700 p-4 rounded flex items-center gap-3">
          <i data-lucide="${icon}" class="w-5 h-5 text-gray-400"></i>
          <div class="flex flex-col">
            <span class="text-sm text-gray-400">${key}</span>
            <span class="text-lg">${value}</span>
          </div>
        </div>
      `;
    })
    .join("");

  card.innerHTML = `
    ${headerHTML}
      ${fieldEntriesHTML}
    </div>
  `;
 
  content.appendChild(card);
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  
  // Add animation after a brief delay
  setTimeout(() => {
    card.style.opacity = "1";
    card.style.transform = "translateX(0)";
  }, 50);

  // Initialize Lucide icons
  lucide.createIcons();
}

// Initialize file input handler
const fileInput = document.getElementById("csvFileInput");
if (fileInput) {
  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
      headers = lines[0].split(",").map(h => h.trim());
      contacts = lines.slice(1).map(line => {
        const values = line.split(",");
        const contact = {};
        headers.forEach((header, index) => {
          contact[header] = values[index] ? values[index].trim() : "";
        });
        return contact;
      });
      filteredContacts = [...contacts];
      
      // Populate filter fields dropdown
      const filterField = document.getElementById('filterField');
      if (filterField && headers.length) {
        filterField.innerHTML = `
          <option value="all">All Fields</option>
          ${headers.map(header => `
            <option value="${header}">${header}</option>
          `).join('')}
        `;
      }
      
      displayContacts();
    };
    reader.readAsText(file);
  });
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  const filterInput = document.getElementById('filterInput');
  const filterField = document.getElementById('filterField');
  const sortField = document.getElementById('sortField');
  const sortDirectionBtn = document.getElementById('sortDirection');
  
  // Filter input handlers
  if (filterInput && filterField) {
    filterInput.addEventListener('input', () => displayContacts());
    filterField.addEventListener('change', () => displayContacts());
  }

  // Sort handlers
  if (sortField && sortDirectionBtn) {
    // Sort field change handler
    sortField.addEventListener('change', (e) => {
      currentSortField = e.target.value;
      displayContacts();
    });

    // Sort direction button handler
    sortDirectionBtn.addEventListener('click', () => {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      
      // Clear existing content
      sortDirectionBtn.innerHTML = '';
      
      // Add single icon
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', sortDirection === 'asc' ? 'arrow-up' : 'arrow-down');
      sortDirectionBtn.appendChild(icon);
      
      lucide.createIcons();
      displayContacts();
    });
  }
});

// Add event delegation for modal close
document.addEventListener('click', (e) => {
  if (e.target.closest('#modal-close')) {
    const modal = document.getElementById("contact-modal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
});