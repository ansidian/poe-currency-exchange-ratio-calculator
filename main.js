let isBuyMode = false;

const amountInput = document.getElementById('amount');
const ratioInput = document.getElementById('ratio');
const toggleSwitch = document.getElementById('toggleSwitch');
const sellLabel = document.getElementById('sellLabel');
const buyLabel = document.getElementById('buyLabel');
const resultContainer = document.getElementById('resultContainer');
const resultText = document.getElementById('resultText');
const resultValue = document.getElementById('resultValue');
const infoIcon = document.getElementById('infoIcon');
const modalOverlay = document.getElementById('modalOverlay');
const closeBtn = document.getElementById('closeBtn');

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

amountInput.addEventListener('input', calculate);
ratioInput.addEventListener('input', calculate);

function parseRatio(ratioStr) {
    if (!ratioStr || ratioStr.trim() === '') return null;

    try {
        ratioStr = ratioStr.trim();

        if (!/^[\d\s.\/+-]+$/.test(ratioStr)) {
            return null;
        }

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

    if (!amount || !ratioStr) {
        resultContainer.classList.remove('show');
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        showError('Currency amount should be a positive integer');
        return;
    }

    const price = parseRatio(ratioStr);
    if (price === null) {
        showError('Error parsing ratio');
        return;
    }

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

    resultText.textContent = 'Input this into Faustus (Want : Have)';
    resultValue.textContent = `${result.aSold} : ${result.bReceived}`;
}

function showError(message) {
    resultContainer.classList.add('error', 'show');
    resultText.textContent = 'Error';
    resultValue.textContent = message;
}

infoIcon.addEventListener('click', () => {
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

function closeModal() {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}