let isBuyMode = false;

const amountInput = document.getElementById('amount');
const ratioInput = document.getElementById('ratio');
const toggleSwitch = document.getElementById('toggleSwitch');
const sellLabel = document.getElementById('sellLabel');
const buyLabel = document.getElementById('buyLabel');
const resultContainer = document.getElementById('resultContainer');
const resultText = document.getElementById('resultText');
const resultValue = document.getElementById('resultValue');

// Toggle functionality
toggleSwitch.addEventListener('click', () => {
    isBuyMode = !isBuyMode;
    toggleSwitch.classList.toggle('active');

    if (isBuyMode) {
        buyLabel.classList.add('active');
        sellLabel.classList.remove('active');
    } else {
        sellLabel.classList.add('active');
        buyLabel.classList.remove('active');
    }

    calculate();
});

// Real-time calculation
amountInput.addEventListener('input', calculate);
ratioInput.addEventListener('input', calculate);

function parseRatio(ratioStr) {
    if (!ratioStr || ratioStr.trim() === '') return null;

    try {
        ratioStr = ratioStr.trim();

        // Only allow numbers, spaces, dots, slashes, and basic operators for safety
        if (!/^[\d\s.\/+-]+$/.test(ratioStr)) {
            return null;
        }

        // Use eval for flexible parsing (same as original)
        const price = eval(ratioStr);
        if (typeof price !== "number" || !isFinite(price) || price <= 0) {
            return null;
        }
        return price;

    } catch (e) {
        return null;
    }
}

function calculateMaxTrade(amountA, price, buySell) {
    for (let a = amountA; a > 0; a--) {
        let b = a / price;
        if (Math.abs(b - Math.round(b)) < 0.000001) {
            if (buySell === "buy") {
                return {aSold: a, bReceived: Math.round(b)};
            } else {
                return {aSold: Math.round(b), bReceived: a};
            }
        }
    }
    return {aSold: 0, bReceived: 0};
}

function calculate() {
    const amount = parseInt(amountInput.value);
    const ratioStr = ratioInput.value;

    // Hide result if inputs are empty
    if (!amount || !ratioStr) {
        resultContainer.classList.remove('show');
        return;
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
        showError('Currency amount should be a positive integer');
        return;
    }

    // Parse and validate ratio
    const price = parseRatio(ratioStr);
    if (price === null) {
        showError('Error parsing ratio');
        return;
    }

    // Calculate using the exact logic from the original
    const buySell = isBuyMode ? "buy" : "sell";
    const result = calculateMaxTrade(amount, price, buySell);

    if (result.aSold > 0) {
        showResult(result);
    } else {
        showError('Error - no valid trade possible');
    }
}

function showResult(result) {
    resultContainer.classList.remove('error');
    resultContainer.classList.add('show');

    resultText.textContent = 'Input this into the trade:';
    resultValue.textContent = `${result.aSold}:${result.bReceived}`;
}

function showError(message) {
    resultContainer.classList.add('error', 'show');
    resultText.textContent = 'Error';
    resultValue.textContent = message;
}