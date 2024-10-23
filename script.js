document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalIncome = document.getElementById('total-income');
    const filterCategory = document.getElementById('filter-category');
    const notification = document.getElementById('notification');
    const toggleModeButton = document.getElementById('toggle-mode');
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let darkMode = false;
    let editIndex = null; 

    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function calculateAndRender() {
        let totalExpenseAmount = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
                totalExpenseAmount += transaction.amount;
            }
        });

        totalIncome.textContent = totalExpenseAmount.toFixed(2);
    }

    function renderTransactions() {
        expenseList.innerHTML = '';
        let filteredTransactions = transactions.filter(transaction => 
            filterCategory.value === 'All' || transaction.category === filterCategory.value
        );

        filteredTransactions.forEach((transaction, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span style="color: ${transaction.color}">${transaction.name} - ₹${transaction.amount.toFixed(2)} (${transaction.category}) - ${transaction.date}</span>
                <div>
                    <button onclick="editTransaction(${index})">Edit</button>
                    <button onclick="deleteTransaction(${index})">Delete</button>
                </div>
            `;
            expenseList.appendChild(li);
        });

        calculateAndRender();
    }

    function addTransaction(event) {
        event.preventDefault();
        const name = document.getElementById('expense-name').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const date = document.getElementById('expense-date').value;
        const color = document.getElementById('expense-color').value;

        if (!name || amount <= 0 || !category) {
            alert('Please fill in all fields correctly.');
            return;
        }

        const transactionDate = date || new Date().toISOString().split('T')[0];

        const newTransaction = {
            name,
            amount,
            type: 'expense',
            category,
            date: transactionDate,
            color
        };

        if (editIndex !== null) {
            transactions[editIndex] = newTransaction;
            editIndex = null; 
            notification.textContent = "Transaction updated successfully.";
        } else {
            transactions.push(newTransaction);
            notification.textContent = "Transaction added successfully.";
        }

        updateLocalStorage();
        renderTransactions();
        expenseForm.reset();

        if (amount > 5000) {
            notification.textContent += ` Alert! Amount exceeds 5000! Current Value: ₹${amount.toFixed(2)}`;
            notification.style.display = 'block';
            //  notification.style.backgroundColor = ' Light gray'; 
            notification.style.color = '#000'; 
        } else {
            notification.style.display = 'none';
        }
    }

    window.deleteTransaction = function(index) {
        transactions.splice(index, 1);
        updateLocalStorage();
        renderTransactions();
    };

    window.editTransaction = function(index) {
        const transaction = transactions[index];
        document.getElementById('expense-name').value = transaction.name;
        document.getElementById('expense-amount').value = transaction.amount;
        document.getElementById('expense-category').value = transaction.category;
        document.getElementById('expense-date').value = transaction.date;
        document.getElementById('expense-color').value = transaction.color;

        editIndex = index;
        expenseForm.querySelector('button[type="submit"]').textContent = 'Update Transaction'; 
    };

    toggleModeButton.addEventListener('click', function () {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        toggleModeButton.textContent = darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });

    expenseForm.addEventListener('submit', addTransaction);
    filterCategory.addEventListener('change', renderTransactions);

    renderTransactions();
});
