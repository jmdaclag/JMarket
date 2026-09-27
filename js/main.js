// Data Storage for Flower Inventory
let bouquets = [
    { id: 1, name: "Sunset Rose Bouquet", cost: 12.00, price: 30.00, qty: 15 },
    { id: 2, name: "Tulip Bliss Arrangement", cost: 18.50, price: 42.00, qty: 8 }
];

// Page Navigation Mapping
const pageInfo = {
    'flower-inventory': {
        title: 'Flower Bouquet Inventory & Accounts',
        desc: 'Manage stock, cost, and profit margins easily.'
    },
    'price-comparison': {
        title: 'Price Comparison Each',
        desc: 'Calculate unit prices to find the best market deal.'
    },
    'currency-hike': {
        title: 'Currency Conversion & Price Hike',
        desc: 'Live currency calculations & inflation tax impact modeling.'
    },
    'cinema-ticketing': {
        title: 'Cinema Ticketing System',
        desc: 'Process tickets, VIP passes, and calculate total receipts.'
    },
    'loan-calculator': {
        title: 'Loan & Savings Calculator',
        desc: 'Compute simple/compound loan repayments and savings growth.'
    }
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    renderBouquetTable();
    convertCurrency();
    setupCinemaForm();
});

// Tab Navigation Logic
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');

            navButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(target).classList.add('active');

            // Update Dynamic Header
            document.getElementById('page-title').innerText = pageInfo[target].title;
            document.getElementById('page-desc').innerText = pageInfo[target].desc;
        });
    });
}

// 1. FLOWER BOUQUET INVENTORY FUNCTIONS
const bouquetForm = document.getElementById('bouquet-form');
if (bouquetForm) {
    bouquetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('bq-name').value;
        const cost = parseFloat(document.getElementById('bq-cost').value);
        const price = parseFloat(document.getElementById('bq-price').value);
        const qty = parseInt(document.getElementById('bq-qty').value);

        bouquets.push({ id: Date.now(), name, cost, price, qty });
        bouquetForm.reset();
        renderBouquetTable();
    });
}

function renderBouquetTable() {
    const tableBody = document.getElementById('bouquet-table');
    tableBody.innerHTML = '';

    let totalQty = 0;
    let totalVal = 0;
    let totalProfit = 0;

    bouquets.forEach(item => {
        const itemVal = item.cost * item.qty;
        const itemProfit = (item.price - item.cost) * item.qty;

        totalQty += item.qty;
        totalVal += itemVal;
        totalProfit += itemProfit;

        const margin = (((item.price - item.cost) / item.price) * 100).toFixed(1);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td>$${item.cost.toFixed(2)}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.qty}</td>
            <td><span style="color: green; font-weight: 600;">${margin}%</span></td>
            <td><button class="btn btn-danger" onclick="deleteBouquet(${item.id})"><i class="fa-solid fa-trash"></i></button></td>
        `;
        tableBody.appendChild(row);
    });

    // Update Stats Cards
    document.getElementById('stat-bouquets').innerText = `${totalQty} Items`;
    document.getElementById('stat-val').innerText = `$${totalVal.toFixed(2)}`;
    document.getElementById('stat-profit').innerText = `$${totalProfit.toFixed(2)}`;
}

function deleteBouquet(id) {
    bouquets = bouquets.filter(b => b.id !== id);
    renderBouquetTable();
}

// 2. PRICE COMPARISON LOGIC
function comparePrices() {
    const nameA = document.getElementById('itemA-name').value || 'Option A';
    const priceA = parseFloat(document.getElementById('itemA-price').value);
    const qtyA = parseFloat(document.getElementById('itemA-qty').value);
    const unitA = document.getElementById('itemA-unit').value;

    const nameB = document.getElementById('itemB-name').value || 'Option B';
    const priceB = parseFloat(document.getElementById('itemB-price').value);
    const qtyB = parseFloat(document.getElementById('itemB-qty').value);
    const unitB = document.getElementById('itemB-unit').value;

    const resultDiv = document.getElementById('compare-result');

    if (!priceA || !qtyA || !priceB || !qtyB) {
        alert("Please enter valid prices and quantities for both options.");
        return;
    }

    const unitPriceA = priceA / qtyA;
    const unitPriceB = priceB / qtyB;

    let text = "";
    if (unitPriceA < unitPriceB) {
        const diff = (((unitPriceB - unitPriceA) / unitPriceB) * 100).toFixed(1);
        text = `🏆 <strong>${nameA}</strong> is the better value! It is <strong>${diff}% cheaper</strong> per ${unitA} ($${unitPriceA.toFixed(4)} vs $${unitPriceB.toFixed(4)}).`;
    } else if (unitPriceB < unitPriceA) {
        const diff = (((unitPriceA - unitPriceB) / unitPriceA) * 100).toFixed(1);
        text = `🏆 <strong>${nameB}</strong> is the better value! It is <strong>${diff}% cheaper</strong> per ${unitB} ($${unitPriceB.toFixed(4)} vs $${unitPriceA.toFixed(4)}).`;
    } else {
        text = `⚖️ Both options cost exactly the same per unit ($${unitPriceA.toFixed(4)}).`;
    }

    resultDiv.innerHTML = text;
    resultDiv.classList.remove('hidden');
}

// 3. CURRENCY & PRICE HIKE LOGIC
const rates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    PHP: 56.5,
    JPY: 155.2
};

function convertCurrency() {
    const amount = parseFloat(document.getElementById('curr-amount').value) || 0;
    const from = document.getElementById('curr-from').value;
    const to = document.getElementById('curr-to').value;

    const amountInUSD = amount / rates[from];
    const converted = amountInUSD * rates[to];

    document.getElementById('curr-result').innerText = `${converted.toFixed(2)} ${to}`;
}

function calculateHike() {
    const basePrice = parseFloat(document.getElementById('hike-price').value) || 0;
    const hikeRate = parseFloat(document.getElementById('hike-rate').value) || 0;
    const taxRate = parseFloat(document.getElementById('hike-tax').value) || 0;

    const hikeAmount = basePrice * (hikeRate / 100);
    const priceAfterHike = basePrice + hikeAmount;
    const taxAmount = priceAfterHike * (taxRate / 100);
    const finalPrice = priceAfterHike + taxAmount;

    const resBox = document.getElementById('hike-result');
    resBox.innerHTML = `
        <p>Original Price: <strong>$${basePrice.toFixed(2)}</strong></p>
        <p>Price Hike Impact (+${hikeRate}%): <strong>+$${hikeAmount.toFixed(2)}</strong></p>
        <p>Local Tax (+${taxRate}%): <strong>+$${taxAmount.toFixed(2)}</strong></p>
        <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid #cbd5e1;">
        <h4>Estimated Final Price: <span style="color: var(--primary);">$${finalPrice.toFixed(2)}</span></h4>
    `;
    resBox.classList.remove('hidden');
}

// 4. CINEMA TICKETING SYSTEM
function setupCinemaForm() {
    const form = document.getElementById('cinema-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const movieSelect = document.getElementById('movie-select');
            const movieTitle = movieSelect.options[movieSelect.selectedIndex].text;
            const basePrice = parseFloat(movieSelect.value);

            const stdQty = parseInt(document.getElementById('tkt-standard').value) || 0;
            const vipQty = parseInt(document.getElementById('tkt-vip').value) || 0;
            const popcornQty = parseInt(document.getElementById('tkt-popcorn').value) || 0;

            const stdTotal = stdQty * basePrice;
            const vipTotal = vipQty * (basePrice + 5.00);
            const popcornTotal = popcornQty * 6.50;

            const subtotal = stdTotal + vipTotal + popcornTotal;
            const tax = subtotal * 0.10; // 10% tax
            const grandTotal = subtotal + tax;

            const receiptContainer = document.getElementById('cinema-receipt');
            receiptContainer.innerHTML = `
                <div class="receipt-row"><strong>JMarket Cinema Receipt</strong></div>
                <div class="receipt-row"><span>Movie:</span> <span>${movieTitle.split('(')[0]}</span></div>
                <hr style="margin: 0.5rem 0;">
                ${stdQty > 0 ? `<div class="receipt-row"><span>Standard x${stdQty}</span> <span>$${stdTotal.toFixed(2)}</span></div>` : ''}
                ${vipQty > 0 ? `<div class="receipt-row"><span>VIP Pass x${vipQty}</span> <span>$${vipTotal.toFixed(2)}</span></div>` : ''}
                ${popcornQty > 0 ? `<div class="receipt-row"><span>Popcorn Combo x${popcornQty}</span> <span>$${popcornTotal.toFixed(2)}</span></div>` : ''}
                <hr style="margin: 0.5rem 0;">
                <div class="receipt-row"><span>Subtotal:</span> <span>$${subtotal.toFixed(2)}</span></div>
                <div class="receipt-row"><span>Tax (10%):</span> <span>$${tax.toFixed(2)}</span></div>
                <div class="receipt-row receipt-total"><span>Total Paid:</span> <span>$${grandTotal.toFixed(2)}</span></div>
            `;
        });
    }
}

// 5. LOAN & SAVINGS CALCULATOR
function calculateFinancials() {
    const amount = parseFloat(document.getElementById('calc-amount').value) || 0;
    const rate = (parseFloat(document.getElementById('calc-rate').value) || 0) / 100;
    const years = parseFloat(document.getElementById('calc-years').value) || 0;
    const mode = document.getElementById('calc-mode').value;

    const resBox = document.getElementById('calc-result');

    if (mode === 'loan') {
        const monthlyRate = rate / 12;
        const totalMonths = years * 12;
        const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
        const totalPaid = monthlyPayment * totalMonths;
        const totalInterest = totalPaid - amount;

        resBox.innerHTML = `
            <h4>Monthly Payment: <span style="color: var(--primary);">$${monthlyPayment.toFixed(2)}/mo</span></h4>
            <p style="margin-top: 0.5rem;">Total Payment over ${years} years: <strong>$${totalPaid.toFixed(2)}</strong> (Interest: $${totalInterest.toFixed(2)})</p>
        `;
    } else {
        // Compound Savings Growth
        const futureValue = amount * Math.pow((1 + rate), years);
        const totalGained = futureValue - amount;

        resBox.innerHTML = `
            <h4>Future Investment Value: <span style="color: var(--accent-green);">$${futureValue.toFixed(2)}</span></h4>
            <p style="margin-top: 0.5rem;">Total Interest Earned: <strong>+$${totalGained.toFixed(2)}</strong></p>
        `;
    }
    resBox.classList.remove('hidden');
}