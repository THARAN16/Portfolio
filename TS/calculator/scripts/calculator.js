let display = document.getElementById('display');

function appendToDisplay(value) {
    const lastChar = display.value.slice(-1);
    const operators = ['+', '-', '*', '/'];
    
    // Prevent duplicate operators
    if (operators.includes(value) && operators.includes(lastChar)) {
        return;
    }
    
    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function deleteLastChar() {
    display.value = display.value.slice(0,-1);
}

function calculateResult() {
    try {
        // Replace × with * for calculation
        const expression = display.value.replace(/×/g, '*');
        display.value = eval(expression);
    } catch (error) {
        display.value = 'Error';
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers and decimal point
    if ((key >= '0' && key <= '9') || key === '.') {
        appendToDisplay(key);
    }
    
    // Operators
    if (key === '+' || key === '-' || key === '/') {
        appendToDisplay(key);
    }
    
    if (key === '*') {
        appendToDisplay('*');
    }
    
    // Enter or = for calculation
    if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    }
    
    // Backspace for delete
    if (key === 'Backspace') {
        event.preventDefault();
        deleteLastChar();
    }
    
    // Escape or Delete for clear
    if (key === 'Escape' || key === 'Delete') {
        clearDisplay();
    }
});