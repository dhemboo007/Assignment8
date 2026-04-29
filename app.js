const form = document.getElementById("expenseForm");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");

const expenseList = document.getElementById("expenseList");
const totalElement = document.getElementById("total");

const filterCategory = document.getElementById("filterCategory");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let editIndex = -1;

// FORMAT RUPIAH
function formatRupiah(number){
  return new Intl.NumberFormat("id-ID", {
    style:"currency",
    currency:"IDR"
  }).format(number);
}

// SIMPAN KE LOCAL STORAGE
function saveToLocalStorage(){
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// TAMPILKAN DATA
function renderExpenses(){

  expenseList.innerHTML = "";

  let filteredExpenses = expenses;

  if(filterCategory.value !== "Semua"){
    filteredExpenses = expenses.filter(expense =>
      expense.category === filterCategory.value
    );
  }

  filteredExpenses.forEach((expense, index) => {

    expenseList.innerHTML += `
      <div class="expense-item">

        <div class="info">
          <h3>${expense.name}</h3>
          <p>${formatRupiah(expense.amount)}</p>
          <span class="category">${expense.category}</span>
        </div>

        <div class="actions">
          <button class="btn edit-btn" onclick="editExpense(${index})">
            Edit
          </button>

          <button class="btn delete-btn" onclick="deleteExpense(${index})">
            Hapus
          </button>
        </div>

      </div>
    `;
  });

  calculateTotal();
}

// TOTAL
function calculateTotal(){

  let total = 0;

  expenses.forEach(expense => {
    total += expense.amount;
  });

  totalElement.textContent = formatRupiah(total);
}

// TAMBAH / EDIT
form.addEventListener("submit", function(e){

  e.preventDefault();

  const name = nameInput.value.trim();
  const amount = parseInt(amountInput.value);
  const category = categoryInput.value;

  // VALIDASI
  if(name === "" || isNaN(amount) || amount <= 0 || category === ""){
    alert("Harap isi data dengan benar!");
    return;
  }

  const expenseData = {
    name,
    amount,
    category
  };

  // EDIT
  if(editIndex !== -1){

    expenses[editIndex] = expenseData;
    editIndex = -1;

  } else {

    expenses.push(expenseData);

  }

  saveToLocalStorage();
  renderExpenses();

  form.reset();
});

// HAPUS
function deleteExpense(index){

  if(confirm("Yakin ingin menghapus data ini?")){

    expenses.splice(index, 1);

    saveToLocalStorage();
    renderExpenses();
  }
}

// EDIT
function editExpense(index){

  const expense = expenses[index];

  nameInput.value = expense.name;
  amountInput.value = expense.amount;
  categoryInput.value = expense.category;

  editIndex = index;
}

// FILTER
filterCategory.addEventListener("change", renderExpenses);

// PERTAMA KALI LOAD
renderExpenses();