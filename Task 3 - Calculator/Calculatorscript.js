/* ============================================================
   script.js — Calculator Logic
   Uses: event listeners, if-else statements, operators, loops
   ============================================================ */

// ── STATE ─────────────────────────────────────────────────
var currentInput   = '';      // what the user is currently typing
var previousInput  = '';      // the first operand
var operator       = '';      // current operator (+, −, ×, ÷)
var shouldResetScreen = false; // flag: next digit press resets the display

// ── DOM REFERENCES ────────────────────────────────────────
var displayResult     = document.getElementById('result');
var displayExpression = document.getElementById('expression');

// ── EVENT LISTENERS ───────────────────────────────────────
// Single delegated listener on the entire button grid
var btnGrid = document.querySelector('.btn-grid');

btnGrid.addEventListener('click', function(event) {
  var btn = event.target.closest('.btn');
  if (!btn) return; // clicked outside a button

  var action = btn.dataset.action;
  var value  = btn.dataset.value;

  // Route to the correct handler using if-else
  if (action === 'number') {
    handleNumber(value);
  } else if (action === 'operator') {
    handleOperator(value);
  } else if (action === 'equals') {
    handleEquals();
  } else if (action === 'clear') {
    handleClear();
  } else if (action === 'sign') {
    handleSign();
  } else if (action === 'percent') {
    handlePercent();
  } else if (action === 'decimal') {
    handleDecimal();
  }

  // Animate the result display
  triggerPop();
});

// ── KEYBOARD SUPPORT ──────────────────────────────────────
document.addEventListener('keydown', function(event) {
  var key = event.key;

  if (key >= '0' && key <= '9') {
    handleNumber(key);
    triggerPop();
  } else if (key === '+') {
    handleOperator('+');
  } else if (key === '-') {
    handleOperator('−');
  } else if (key === '*') {
    handleOperator('×');
  } else if (key === '/') {
    event.preventDefault();
    handleOperator('÷');
  } else if (key === 'Enter' || key === '=') {
    handleEquals();
    triggerPop();
  } else if (key === 'Backspace') {
    handleBackspace();
    triggerPop();
  } else if (key === 'Escape') {
    handleClear();
  } else if (key === '.') {
    handleDecimal();
    triggerPop();
  } else if (key === '%') {
    handlePercent();
    triggerPop();
  }
});

// ── HANDLERS ──────────────────────────────────────────────

// NUMBER: append a digit to the current input
function handleNumber(num) {
  // If we just calculated, start fresh
  if (shouldResetScreen) {
    currentInput = '';
    shouldResetScreen = false;
  }

  // Prevent leading zeros (except "0.")
  if (currentInput === '0' && num !== '.') {
    currentInput = num;
  } else {
    // Limit to 12 digits to avoid display overflow
    if (currentInput.replace('.', '').replace('-', '').length < 12) {
      currentInput += num;
    }
  }

  updateDisplay();
}

// OPERATOR: store the first operand and the chosen operator
function handleOperator(op) {
  // Clear active state from all operator buttons
  clearActiveOperators();

  if (currentInput === '' && previousInput === '') return;

  // If user chains operators, calculate on the fly
  if (currentInput !== '' && previousInput !== '') {
    calculate();
  }

  previousInput = currentInput !== '' ? currentInput : previousInput;
  operator = op;
  currentInput = '';
  shouldResetScreen = false;

  // Highlight the active operator button
  highlightOperator(op);

  // Show expression in the upper display
  displayExpression.textContent = previousInput + ' ' + operator;
}

// EQUALS: perform the calculation
function handleEquals() {
  if (operator === '' || previousInput === '') return;
  if (currentInput === '') currentInput = previousInput;

  // Show full expression before result
  displayExpression.textContent = previousInput + ' ' + operator + ' ' + currentInput + ' =';

  calculate();

  operator = '';
  previousInput = '';
  shouldResetScreen = true;

  clearActiveOperators();
}

// CLEAR: reset everything
function handleClear() {
  currentInput  = '';
  previousInput = '';
  operator      = '';
  shouldResetScreen = false;

  displayResult.textContent     = '0';
  displayExpression.textContent = '\u00A0'; // non-breaking space

  clearActiveOperators();
  adjustFontSize('0');
}

// SIGN: toggle positive / negative
function handleSign() {
  if (currentInput === '' || currentInput === '0') return;

  if (currentInput.startsWith('-')) {
    currentInput = currentInput.slice(1);
  } else {
    currentInput = '-' + currentInput;
  }

  updateDisplay();
}

// PERCENT: divide by 100
function handlePercent() {
  if (currentInput === '') return;

  currentInput = String(parseFloat(currentInput) / 100);
  updateDisplay();
}

// DECIMAL: add a decimal point
function handleDecimal() {
  if (shouldResetScreen) {
    currentInput = '0';
    shouldResetScreen = false;
  }

  // Only add decimal if there isn't one already
  if (currentInput.indexOf('.') === -1) {
    if (currentInput === '') {
      currentInput = '0';
    }
    currentInput += '.';
  }

  updateDisplay();
}

// BACKSPACE: remove the last character
function handleBackspace() {
  if (shouldResetScreen) return;

  if (currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
  }

  updateDisplay();
}

// ── CORE CALCULATION ──────────────────────────────────────
function calculate() {
  var a = parseFloat(previousInput);
  var b = parseFloat(currentInput);
  var result;

  // if-else chain for each operator
  if (operator === '+') {
    result = a + b;
  } else if (operator === '−') {
    result = a - b;
  } else if (operator === '×') {
    result = a * b;
  } else if (operator === '÷') {
    if (b === 0) {
      // Handle division by zero
      displayResult.textContent = 'Error';
      displayExpression.textContent = 'Cannot ÷ by 0';
      currentInput  = '';
      previousInput = '';
      operator      = '';
      shouldResetScreen = true;
      return;
    }
    result = a / b;
  } else {
    return;
  }

  // Round to avoid floating-point issues (e.g. 0.1 + 0.2)
  result = parseFloat(result.toPrecision(12));

  // Remove trailing zeros after decimal
  currentInput = String(result);
  previousInput = currentInput;

  updateDisplay();
}

// ── DISPLAY HELPERS ───────────────────────────────────────

// Update the main result display
function updateDisplay() {
  var displayValue = currentInput === '' ? '0' : currentInput;

  // Format large numbers with commas (for display only)
  var formatted = formatNumber(displayValue);

  displayResult.textContent = formatted;
  adjustFontSize(formatted);
}

// Add thousand separators for readability
function formatNumber(value) {
  // Don't format if it ends with a decimal point or has trailing zeros after decimal
  if (value.endsWith('.')) return value;

  var parts = value.split('.');
  var intPart = parts[0];
  var decPart = parts.length > 1 ? '.' + parts[1] : '';

  // Use a loop to insert commas every 3 digits
  var result = '';
  var count  = 0;
  var start  = intPart.startsWith('-') ? 1 : 0;
  var prefix = intPart.startsWith('-') ? '-' : '';
  var digits = intPart.slice(start);

  for (var i = digits.length - 1; i >= 0; i--) {
    result = digits[i] + result;
    count++;
    if (count % 3 === 0 && i !== 0) {
      result = ',' + result;
    }
  }

  return prefix + result + decPart;
}

// Shrink font if number is long
function adjustFontSize(value) {
  var len = value.replace(',', '').length;

  if (len > 12) {
    displayResult.classList.add('small');
  } else {
    displayResult.classList.remove('small');
  }
}

// Pop animation on result
function triggerPop() {
  displayResult.classList.remove('pop');
  // Force reflow so animation re-triggers
  void displayResult.offsetWidth;
  displayResult.classList.add('pop');
}

// ── OPERATOR HIGHLIGHT ────────────────────────────────────

// Highlight the selected operator button
function highlightOperator(op) {
  var opBtns = document.querySelectorAll('.btn-op');
  for (var i = 0; i < opBtns.length; i++) {
    if (opBtns[i].dataset.value === op) {
      opBtns[i].classList.add('active');
    }
  }
}

// Remove active state from all operator buttons
function clearActiveOperators() {
  var opBtns = document.querySelectorAll('.btn-op');
  for (var i = 0; i < opBtns.length; i++) {
    opBtns[i].classList.remove('active');
  }
}