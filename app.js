const addExpenseBtn = document.getElementById("addExpenseBtn");
const downloadCSVBtn = document.getElementById("downloadCSVBtn");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseDate = document.getElementById("expenseDate");
const expenseType = document.getElementById("expenseType");
const expenseTableBody = document.querySelector("#expenseTable tbody");
const totalAmountCell = document.getElementById("totalAmount");

let total = 0;

// Update total considering Credit (+) and Debit (-)
function updateTotal() {
  let rows = expenseTableBody.querySelectorAll("tr");
  let newTotal = 0;
  rows.forEach(row => {
    const amount = parseFloat(row.querySelector(".amount").textContent);
    const type = row.querySelector(".type").textContent;
    if (type === "Credit") newTotal += amount;
    else newTotal -= amount;
  });
  total = newTotal;
  totalAmountCell.textContent = total.toFixed(2);
}

// Sort table by date ascending
function sortTableByDate() {
  const rows = Array.from(expenseTableBody.querySelectorAll("tr"));
  rows.sort((a, b) => new Date(a.cells[0].textContent) - new Date(b.cells[0].textContent));
  rows.forEach(row => expenseTableBody.appendChild(row));
}

// Add expense row
function addExpense() {
  const date = expenseDate.value;
  const name = expenseName.value.trim();
  const amount = parseFloat(expenseAmount.value);
  const type = expenseType.value;

  if (!date || !name || !amount || amount <= 0) {
    alert("Please fill all fields with valid values");
    return;
  }

  const tr = document.createElement("tr");

  const tdDate = document.createElement("td");
  tdDate.textContent = date;

  const tdName = document.createElement("td");
  tdName.textContent = name;

  const tdAmount = document.createElement("td");
  tdAmount.textContent = amount.toFixed(2);
  tdAmount.className = "amount " + (type === "credit" ? "credit" : "debit");

  const tdType = document.createElement("td");
  tdType.textContent = type.charAt(0).toUpperCase() + type.slice(1);
  tdType.className = "type";

  const tdAction = document.createElement("td");
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => {
    tr.remove();
    updateTotal();
  });
  tdAction.appendChild(deleteBtn);

  tr.appendChild(tdDate);
  tr.appendChild(tdName);
  tr.appendChild(tdAmount);
  tr.appendChild(tdType);
  tr.appendChild(tdAction);

  expenseTableBody.appendChild(tr);

  sortTableByDate();
  updateTotal();

  // Clear inputs
  expenseDate.value = "";
  expenseName.value = "";
  expenseAmount.value = "";
}

// Export table as Excel
function downloadCSV() {
  const rows = Array.from(expenseTableBody.querySelectorAll("tr"));
  const data = [];
  
  // Add header
  data.push(["Date", "Name", "Amount", "Type"]);
  
  // Add rows
  rows.forEach(row => {
    const cols = Array.from(row.querySelectorAll("td")).slice(0, 4);
    data.push(cols.map(col => col.textContent));
  });
  
  // Add total row
  data.push(["Total", "", totalAmountCell.textContent, ""]);
  
  // Check if XLSX library is available
  if (typeof XLSX === 'undefined') {
    alert("Excel library not loaded. Please try again or check your internet connection.");
    return;
  }
  
  try {
    // Create workbook and worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    
    // Download the file
    XLSX.writeFile(workbook, "expenses.xlsx");
  } catch (error) {
    console.error("Error downloading file:", error);
    alert("Failed to download expense details. Please try again.");
  }
}

// Attach events
addExpenseBtn.addEventListener("click", addExpense);
downloadCSVBtn.addEventListener("click", downloadCSV);
