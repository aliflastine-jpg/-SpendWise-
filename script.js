
let transactions = JSON.parse(
    localStorage.getItem("spendwiseTransactions")
) || [];

const form = document.getElementById("transactionForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (!name || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid name and amount.");
        return;
    }

    const transaction = {
        id: Date.now(),
        name: name,
        amount: amount,
        type: type,
        category: category,
        date: new Date().toLocaleDateString()
    };

    transactions.push(transaction);

    saveTransactions();
    displayTransactions();
    form.reset();
});

function saveTransactions() {
    localStorage.setItem(
        "spendwiseTransactions",
        JSON.stringify(transactions)
    );
}

function calculateBalance() {
    let income = 0;
    let expenses = 0;

    transactions.forEach(function(transaction) {
        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;
        }
    });

    document.getElementById("income").textContent =
        "KSh " + income.toLocaleString();

    document.getElementById("expenses").textContent =
        "KSh " + expenses.toLocaleString();

    document.getElementById("balance").textContent =
        "KSh " + (income - expenses).toLocaleString();
}

function displayTransactions() {
    const list = document.getElementById("transactionList");

    list.innerHTML = "";

    if (transactions.length === 0) {
        list.innerHTML =
            '<tr><td colspan="5">No transactions yet.</td></tr>';
    }

    transactions.forEach(function(transaction) {
        const row = document.createElement("tr");

        const values = [
            transaction.name,
            (transaction.type === "income" ? "+" : "-") +
                " KSh " + transaction.amount.toLocaleString(),
            transaction.category,
            transaction.date
        ];

        values.forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            transactions = transactions.filter(
                item => item.id !== transaction.id
            );

            saveTransactions();
            displayTransactions();
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        list.appendChild(row);
    });

    calculateBalance();
}

displayTransactions();
