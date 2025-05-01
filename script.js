document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Function to activate tab
    function activateTab(tabName) {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to corresponding button and content
        const tabButton = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        if (tabButton) tabButton.classList.add('active');
        
        const tabContent = document.getElementById(tabName + '-tab');
        if (tabContent) tabContent.classList.add('active');
    }
    
    // Tab button click handler
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            activateTab(button.dataset.tab);
        });
    });
    
    // Handle footer tab links
    const footerTabLinks = document.querySelectorAll('.footer-tab-link');
    footerTabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.dataset.tab;
            
            // If we're on the index page, activate the tab
            if (window.location.pathname.endsWith('index.html') || 
                window.location.pathname === '/' || 
                window.location.pathname.endsWith('/')) {
                activateTab(tabName);
                // Scroll to the calculators section
                document.querySelector('.calculator-tabs').scrollIntoView({ behavior: 'smooth' });
            } else {
                // If on another page, redirect to index with a fragment identifier
                window.location.href = 'index.html#' + tabName;
            }
        });
    });
    
    // Check for URL hash to activate tab on page load
    if (window.location.hash) {
        const tabName = window.location.hash.substring(1);
        activateTab(tabName);
        
        // If there's a tab-specific section in the URL (e.g., #percentage-calculators-basic),
        // scroll to that section
        if (tabName === 'percentage-calculators') {
            setTimeout(() => {
                // Check if there's a specific section to scroll to
                const hashParts = window.location.hash.split('-');
                if (hashParts.length > 2) {
                    const sectionId = hashParts[2]; // basic, find-percentage, percentage-change
                    const sectionElement = document.getElementById(sectionId + '-section');
                    if (sectionElement) {
                        sectionElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }, 300); // Small delay to ensure tab content is visible
        }
    }
    
    // Theme toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        const icon = themeToggleBtn.querySelector('i');
        const text = themeToggleBtn.querySelector('span');
        
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            text.textContent = 'Light Mode';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            text.textContent = 'Dark Mode';
        }
    });
    
    // ======== BASIC CALCULATOR ========
    const percentageInput = document.getElementById('percentage');
    const baseNumberInput = document.getElementById('baseNumber');
    const resultInput = document.getElementById('result');
    const calculationSummary = document.getElementById('calculation-summary');
    const errorMessage = document.getElementById('error-message');
    const resetBtn = document.getElementById('reset-btn');
    
    // Reset functionality
    resetBtn.addEventListener('click', function() {
        percentageInput.value = '';
        baseNumberInput.value = '';
        resultInput.value = '';
        calculationSummary.textContent = '';
        errorMessage.textContent = '';
        
        // Remove the active calculation class
        percentageInput.classList.remove('active-calculation');
        baseNumberInput.classList.remove('active-calculation');
        resultInput.classList.remove('active-calculation');
    });
    
    // Copy results functionality
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.addEventListener('click', function() {
        const percentageValue = percentageInput.value || '0';
        const baseNumberValue = baseNumberInput.value || '0';
        const resultValue = resultInput.value || '0';
        
        const results = `Percentage: ${percentageValue}%\nBase Number: ${baseNumberValue}\nResult: ${resultValue}`;
        
        try {
            // Use the Clipboard API if available
            navigator.clipboard.writeText(results).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            });
        } catch (err) {
            // Fallback for older browsers
            errorMessage.textContent = "Couldn't copy to clipboard. Your browser may not support this feature.";
        }
    });
    
    // Input event listeners for real-time calculation
    percentageInput.addEventListener('input', calculate);
    baseNumberInput.addEventListener('input', calculate);
    resultInput.addEventListener('input', calculate);
    
    // Main calculation function
    function calculate() {
        // Auto-clear fields when another field is being modified
        if (document.activeElement === percentageInput) {
            // User is entering percentage, auto-clear result
            resultInput.value = '';
        } else if (document.activeElement === baseNumberInput) {
            // User is entering base number, auto-clear result
            resultInput.value = '';
        } else if (document.activeElement === resultInput) {
            // User is entering result, no auto-clear needed
        }
    
        // Clear previous error
        errorMessage.textContent = '';
        
        // Get input values
        const percentageValue = percentageInput.value.trim();
        const baseNumberValue = baseNumberInput.value.trim();
        const resultValue = resultInput.value.trim();
        
        // Remove active calculation class from all inputs
        percentageInput.classList.remove('active-calculation');
        baseNumberInput.classList.remove('active-calculation');
        resultInput.classList.remove('active-calculation');
        
        // Count how many fields are filled with valid numbers
        let filledCount = 0;
        
        if (isValidNumber(percentageValue)) filledCount++;
        if (isValidNumber(baseNumberValue)) filledCount++;
        if (isValidNumber(resultValue)) filledCount++;
        
        // If fewer than 2 fields are filled, clear summary and return
        if (filledCount < 2) {
            calculationSummary.textContent = '';
            return;
        }
        
        // Basic calculator should focus on calculating the result field
        if (isValidNumber(percentageValue) && isValidNumber(baseNumberValue)) {
            // We have percentage and base number, calculate result
            const percentage = parseFloat(percentageValue);
            const baseNumber = parseFloat(baseNumberValue);
            
            const result = (percentage / 100) * baseNumber;
            resultInput.value = result.toFixed(2);
            resultInput.classList.add('active-calculation');
            
            // Update summary
            updateSummary(percentage, baseNumber, result);
            return;
        }
        
        // Check which two fields are filled and calculate the third
        if (!isValidNumber(percentageValue)) {
            // Calculate percentage
            const baseNumber = parseFloat(baseNumberValue);
            const result = parseFloat(resultValue);
            
            if (baseNumber === 0) {
                errorMessage.textContent = "Cannot calculate percentage: base number cannot be zero.";
                return;
            }
            
            const percentage = (result / baseNumber) * 100;
            percentageInput.value = percentage.toFixed(2);
            percentageInput.classList.add('active-calculation');
            
            updateSummary(percentage, baseNumber, result);
        } 
        else if (!isValidNumber(baseNumberValue)) {
            // Calculate base number
            const percentage = parseFloat(percentageValue);
            const result = parseFloat(resultValue);
            
            if (percentage === 0) {
                errorMessage.textContent = "Cannot calculate base number: percentage cannot be zero.";
                return;
            }
            
            const baseNumber = (result * 100) / percentage;
            baseNumberInput.value = baseNumber.toFixed(2);
            baseNumberInput.classList.add('active-calculation');
            
            updateSummary(percentage, baseNumber, result);
        } 
        else if (!isValidNumber(resultValue)) {
            // Calculate result
            const percentage = parseFloat(percentageValue);
            const baseNumber = parseFloat(baseNumberValue);
            
            const result = (percentage / 100) * baseNumber;
            resultInput.value = result.toFixed(2);
            resultInput.classList.add('active-calculation');
            
            updateSummary(percentage, baseNumber, result);
        }
    }
    
    // Update the calculation summary
    function updateSummary(percentage, baseNumber, result) {
        // Make sure we display the full values
        const displayPercentage = percentage.toFixed(2);
        const displayBaseNumber = baseNumber.toFixed(2);
        const displayResult = result.toFixed(2);
        calculationSummary.textContent = `${displayPercentage}% of ${displayBaseNumber} is ${displayResult}`;
    }
    
    // ======== FIND PERCENTAGE CALCULATOR ========
    const findPercentageXInput = document.getElementById('find-percentage-x');
    const findPercentageYInput = document.getElementById('find-percentage-y');
    const findPercentageResultInput = document.getElementById('find-percentage-result');
    const findPercentageSummary = document.getElementById('find-percentage-summary');
    const findPercentageError = document.getElementById('find-percentage-error');
    const findPercentageResetBtn = document.getElementById('find-percentage-reset-btn');
    const findPercentageCopyBtn = document.getElementById('find-percentage-copy-btn');
    
    // Reset functionality
    findPercentageResetBtn.addEventListener('click', function() {
        findPercentageXInput.value = '';
        findPercentageYInput.value = '';
        findPercentageResultInput.value = '';
        findPercentageSummary.textContent = '';
        findPercentageError.textContent = '';
        
        findPercentageXInput.classList.remove('active-calculation');
        findPercentageYInput.classList.remove('active-calculation');
        findPercentageResultInput.classList.remove('active-calculation');
    });
    
    // Copy results functionality
    findPercentageCopyBtn.addEventListener('click', function() {
        const xValue = findPercentageXInput.value || '0';
        const yValue = findPercentageYInput.value || '0';
        const percentage = findPercentageResultInput.value || '0';
        
        const results = `X: ${xValue}\nY: ${yValue}\nPercentage: ${percentage}%`;
        
        try {
            // Use the Clipboard API if available
            navigator.clipboard.writeText(results).then(() => {
                const originalText = findPercentageCopyBtn.innerHTML;
                findPercentageCopyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    findPercentageCopyBtn.innerHTML = originalText;
                }, 2000);
            });
        } catch (err) {
            // Fallback for older browsers
            findPercentageError.textContent = "Couldn't copy to clipboard. Your browser may not support this feature.";
        }
    });
    
    // Direct event binding with separate, simple functions
    findPercentageXInput.oninput = calculateWhatPercentage;
    findPercentageYInput.oninput = calculateWhatPercentage;
    findPercentageResultInput.oninput = calculateWhatPercentage;
    
    function calculateWhatPercentage() {
        // EMERGENCY DEBUG - Reset all inputs and start fresh
        if (document.activeElement === findPercentageXInput || 
            document.activeElement === findPercentageYInput) {
            // Only clear the percentage field when user is entering X or Y
            findPercentageResultInput.value = '';
        }
        
        // Clear previous messages
        findPercentageError.textContent = '';
        findPercentageSummary.textContent = '';
        
        // Remove calculation highlighting
        findPercentageXInput.classList.remove('active-calculation');
        findPercentageYInput.classList.remove('active-calculation');
        findPercentageResultInput.classList.remove('active-calculation');
        
        // Get raw values
        const xText = findPercentageXInput.value.trim();
        const yText = findPercentageYInput.value.trim();
        
        console.log("RAW INPUT:", {
            x: xText,
            y: yText
        });
        
        // Check if both X and Y have valid values - this is the key calculation path we're focused on
        if (isValidNumber(xText) && isValidNumber(yText)) {
            const x = parseFloat(xText);
            const y = parseFloat(yText);
            
            if (x === 0) {
                findPercentageError.textContent = "Cannot calculate percentage: X cannot be zero.";
                return;
            }
            
            // Calculate percentage: What percent of X is Y?
            // Example: What percent of 100 is 80? Answer: 80%
            const calculatedPercentage = (y / x) * 100;
            
            console.log("CALCULATED:", {
                x: x, 
                y: y, 
                percentage: calculatedPercentage
            });
            
            // Format to 2 decimal places for display
            const formattedPercentage = calculatedPercentage.toFixed(2);
            
            // Update percentage field
            findPercentageResultInput.value = formattedPercentage;
            findPercentageResultInput.classList.add('active-calculation');
            
            // Update summary text
            findPercentageSummary.textContent = 
                `${formattedPercentage}% of ${x.toFixed(2)} is ${y.toFixed(2)}`;
        }
    }
    
    // The "X is what % of Y" calculator section has been removed as requested
    
    // ======== PERCENTAGE CHANGE CALCULATOR ========
    const percentageChangeOldInput = document.getElementById('percentage-change-old');
    const percentageChangeNewInput = document.getElementById('percentage-change-new');
    const percentageChangeResultInput = document.getElementById('percentage-change-result');
    const percentageChangeSummary = document.getElementById('percentage-change-summary');
    const percentageChangeError = document.getElementById('percentage-change-error');
    const percentageChangeResetBtn = document.getElementById('percentage-change-reset-btn');
    const percentageChangeCopyBtn = document.getElementById('percentage-change-copy-btn');
    
    // Reset functionality
    percentageChangeResetBtn.addEventListener('click', function() {
        percentageChangeOldInput.value = '';
        percentageChangeNewInput.value = '';
        percentageChangeResultInput.value = '';
        percentageChangeSummary.textContent = '';
        percentageChangeError.textContent = '';
        
        // Remove the active calculation class
        percentageChangeOldInput.classList.remove('active-calculation');
        percentageChangeNewInput.classList.remove('active-calculation');
        percentageChangeResultInput.classList.remove('active-calculation');
        
        // Clear color classes
        percentageChangeResultInput.classList.remove('profit-text', 'loss-text', 'neutral-text');
        percentageChangeSummary.classList.remove('profit-text', 'loss-text', 'neutral-text');
    });
    
    // Copy results functionality
    percentageChangeCopyBtn.addEventListener('click', function() {
        const oldValue = percentageChangeOldInput.value || '0';
        const newValue = percentageChangeNewInput.value || '0';
        const percentageChange = percentageChangeResultInput.value || '0';
        
        // Determine if it's an increase or decrease
        let changeType = "";
        if (parseFloat(percentageChange) > 0) {
            changeType = "increase";
        } else if (parseFloat(percentageChange) < 0) {
            changeType = "decrease";
        } else {
            changeType = "change";
        }
        
        const results = `Original Value: ${oldValue}\nNew Value: ${newValue}\nPercentage Change: ${percentageChange}% (${changeType})`;
        
        try {
            // Use the Clipboard API if available
            navigator.clipboard.writeText(results).then(() => {
                const originalText = percentageChangeCopyBtn.innerHTML;
                percentageChangeCopyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    percentageChangeCopyBtn.innerHTML = originalText;
                }, 2000);
            });
        } catch (err) {
            // Fallback for older browsers
            percentageChangeError.textContent = "Couldn't copy to clipboard. Your browser may not support this feature.";
        }
    });
    
    // Input event listeners for real-time calculation
    percentageChangeOldInput.addEventListener('input', calculatePercentageChange);
    percentageChangeNewInput.addEventListener('input', calculatePercentageChange);
    percentageChangeResultInput.addEventListener('input', calculatePercentageChange);
    
    function calculatePercentageChange() {
        // Auto-clear fields when user changes inputs
        if (document.activeElement === percentageChangeOldInput || 
            document.activeElement === percentageChangeNewInput) {
            percentageChangeResultInput.value = '';
        }
    
        // Clear previous error
        percentageChangeError.textContent = '';
        percentageChangeSummary.textContent = '';
        
        // Get input values
        const oldValue = percentageChangeOldInput.value.trim();
        const newValue = percentageChangeNewInput.value.trim();
        
        // Remove active calculation class from all inputs
        percentageChangeOldInput.classList.remove('active-calculation');
        percentageChangeNewInput.classList.remove('active-calculation');
        percentageChangeResultInput.classList.remove('active-calculation');
        
        // Check if we have both old value and new value
        if (isValidNumber(oldValue) && isValidNumber(newValue)) {
            const oldVal = parseFloat(oldValue);
            const newVal = parseFloat(newValue);
            
            // Avoid division by zero
            if (oldVal === 0) {
                percentageChangeError.textContent = "Cannot calculate percentage change: original value cannot be zero.";
                return;
            }
            
            // Calculate the percentage change: ((new - old) / old) * 100
            const percentageChange = ((newVal - oldVal) / oldVal) * 100;
            
            console.log("Percentage Change Calculation:", {
                oldVal: oldVal,
                newVal: newVal,
                percentageChange: percentageChange
            });
            
            // Update the percentage change input
            percentageChangeResultInput.value = percentageChange.toFixed(2);
            percentageChangeResultInput.classList.add('active-calculation');
            
            // Add color classes to the result input
            percentageChangeResultInput.classList.remove('profit-text', 'loss-text', 'neutral-text');
            if (percentageChange > 0) {
                percentageChangeResultInput.classList.add('profit-text');
            } else if (percentageChange < 0) {
                percentageChangeResultInput.classList.add('loss-text');
            } else {
                percentageChangeResultInput.classList.add('neutral-text');
            }
            
            // Update the summary
            let changeType = "";
            if (percentageChange > 0) {
                changeType = "increase";
            } else if (percentageChange < 0) {
                changeType = "decrease";
            } else {
                changeType = "change";
            }
            
            const displayPercentage = Math.abs(percentageChange).toFixed(2);
            
            // Clear previous classes
            percentageChangeSummary.classList.remove('profit-text', 'loss-text', 'neutral-text');
            
            // Apply appropriate class based on change
            if (percentageChange > 0) {
                percentageChangeSummary.classList.add('profit-text');
            } else if (percentageChange < 0) {
                percentageChangeSummary.classList.add('loss-text');
            } else {
                percentageChangeSummary.classList.add('neutral-text');
            }
            
            percentageChangeSummary.textContent = 
                `From ${oldVal.toFixed(2)} to ${newVal.toFixed(2)} is a ${displayPercentage}% ${changeType}`;
        }
    }
    
    // Previous updatePercentageChangeSummary function has been integrated 
    // directly into the calculatePercentageChange function
    
    // Helper function to validate if a string is a valid number
    function isValidNumber(value) {
        // Check if value is empty
        if (value === '') return false;
        
        // Check if value is a valid number
        const num = parseFloat(value);
        return !isNaN(num) && isFinite(num);
    }
    
    // ======== PROFIT AND LOSS CALCULATOR ========
    const costPriceInput = document.getElementById('cost-price');
    const sellingPriceInput = document.getElementById('selling-price');
    const quantityInput = document.getElementById('quantity');
    const plResultType = document.getElementById('pl-result-type');
    const plAmount = document.getElementById('pl-amount');
    const plPercentage = document.getElementById('pl-percentage');
    const plTotalAmount = document.getElementById('pl-total-amount');
    const plSummary = document.getElementById('pl-summary');
    const plError = document.getElementById('pl-error');
    const plResetBtn = document.getElementById('pl-reset-btn');
    const plCopyBtn = document.getElementById('pl-copy-btn');
    const plResults = document.getElementById('pl-results');

    // Reset functionality
    plResetBtn.addEventListener('click', function() {
        costPriceInput.value = '';
        sellingPriceInput.value = '';
        quantityInput.value = '1';
        plResultType.textContent = 'Enter values to see results';
        plAmount.textContent = '0.00';
        plPercentage.textContent = '0.00';
        plTotalAmount.textContent = '0.00';
        plSummary.textContent = '';
        plError.textContent = '';
        
        // Reset result container styles
        plResults.classList.remove('profit-result', 'loss-result', 'neutral-result');
        plResultType.classList.remove('profit-text', 'loss-text', 'neutral-text');
    });

    // Copy results functionality
    plCopyBtn.addEventListener('click', function() {
        const cp = costPriceInput.value || '0';
        const sp = sellingPriceInput.value || '0';
        const qty = quantityInput.value || '1';
        const type = plResultType.textContent;
        const amount = plAmount.textContent;
        const percentage = plPercentage.textContent;
        const totalAmount = plTotalAmount.textContent;
        
        const results = `Type: ${type}\nCost Price: ₹${cp}\nSelling Price: ₹${sp}\nQuantity: ${qty}\nAmount: ₹${amount}\nPercentage: ${percentage}%\nTotal Amount: ₹${totalAmount}`;
        
        try {
            // Use the Clipboard API if available
            navigator.clipboard.writeText(results).then(() => {
                const originalText = plCopyBtn.innerHTML;
                plCopyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    plCopyBtn.innerHTML = originalText;
                }, 2000);
            });
        } catch (err) {
            // Fallback for older browsers
            plError.textContent = "Couldn't copy to clipboard. Your browser may not support this feature.";
        }
    });

    // Input event listeners for real-time calculation
    costPriceInput.addEventListener('input', calculateProfitLoss);
    sellingPriceInput.addEventListener('input', calculateProfitLoss);
    quantityInput.addEventListener('input', calculateProfitLoss);

    // Main profit loss calculation function
    function calculateProfitLoss() {
        // Clear previous error
        plError.textContent = '';
        
        // Get input values
        const cpText = costPriceInput.value.trim();
        const spText = sellingPriceInput.value.trim();
        const qtyText = quantityInput.value.trim();
        
        // Validate inputs
        if (!isValidNumber(cpText) || !isValidNumber(spText) || !isValidNumber(qtyText)) {
            // Reset results if inputs are not valid
            plResultType.textContent = 'Enter valid values';
            plAmount.textContent = '0.00';
            plPercentage.textContent = '0.00';
            plTotalAmount.textContent = '0.00';
            plSummary.textContent = '';
            plResults.classList.remove('profit-result', 'loss-result', 'neutral-result');
            plResultType.classList.remove('profit-text', 'loss-text', 'neutral-text');
            return;
        }
        
        // Parse input values
        const costPrice = parseFloat(cpText);
        const sellingPrice = parseFloat(spText);
        const quantity = parseFloat(qtyText);
        
        // Input validation
        if (costPrice < 0 || sellingPrice < 0 || quantity <= 0) {
            plError.textContent = "Please enter valid positive values. Quantity must be greater than zero.";
            return;
        }
        
        // Calculate profit or loss
        let amount, percentage, totalAmount, resultType, textClass, resultClass;
        
        if (sellingPrice > costPrice) {
            // Profit calculation
            amount = sellingPrice - costPrice;
            percentage = (amount / costPrice) * 100;
            totalAmount = amount * quantity;
            resultType = "Profit";
            textClass = "profit-text";
            resultClass = "profit-result";
        } else if (costPrice > sellingPrice) {
            // Loss calculation
            amount = costPrice - sellingPrice;
            percentage = (amount / costPrice) * 100;
            totalAmount = amount * quantity;
            resultType = "Loss";
            textClass = "loss-text";
            resultClass = "loss-result";
        } else {
            // No profit, no loss
            amount = 0;
            percentage = 0;
            totalAmount = 0;
            resultType = "No Profit, No Loss";
            textClass = "neutral-text";
            resultClass = "neutral-result";
        }
        
        // Update UI
        plResultType.textContent = resultType;
        plAmount.textContent = amount.toFixed(2);
        plPercentage.textContent = percentage.toFixed(2);
        plTotalAmount.textContent = totalAmount.toFixed(2);
        
        // Add appropriate styling classes
        plResults.classList.remove('profit-result', 'loss-result', 'neutral-result');
        plResultType.classList.remove('profit-text', 'loss-text', 'neutral-text');
        plResults.classList.add(resultClass);
        plResultType.classList.add(textClass);
        
        // Update summary text
        if (resultType === "Profit") {
            plSummary.textContent = `You made a profit of ₹${totalAmount.toFixed(2)} (${percentage.toFixed(2)}%) on selling ${quantity} item(s).`;
        } else if (resultType === "Loss") {
            plSummary.textContent = `You made a loss of ₹${totalAmount.toFixed(2)} (${percentage.toFixed(2)}%) on selling ${quantity} item(s).`;
        } else {
            plSummary.textContent = `You broke even on selling ${quantity} item(s). No profit, no loss.`;
        }
    }
    
    // ======== GST CALCULATOR ========
    const gstAmountInput = document.getElementById('gst-amount');
    const gstRateSelect = document.getElementById('gst-rate');
    const customGstRateGroup = document.getElementById('custom-gst-rate-group');
    const customGstRateInput = document.getElementById('custom-gst-rate');
    const includeGstRadio = document.getElementById('include-gst');
    const excludeGstRadio = document.getElementById('exclude-gst');
    
    // Get the result containers
    const includeGstResults = document.getElementById('include-gst-results');
    const extractGstResults = document.getElementById('extract-gst-results');
    
    // Get all result value elements
    const gstTaxAmount = document.getElementById('gst-tax-amount');
    const gstTaxAmountExtract = document.getElementById('gst-tax-amount-extract');
    const gstFinalAmount = document.getElementById('gst-final-amount');
    const gstBaseAmount = document.getElementById('gst-base-amount');
    
    const gstSummary = document.getElementById('gst-summary');
    const gstError = document.getElementById('gst-error');
    const gstResetBtn = document.getElementById('gst-reset-btn');
    const gstCopyBtn = document.getElementById('gst-copy-btn');
    
    // Show/hide custom GST rate input based on selection
    gstRateSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customGstRateGroup.classList.remove('hidden');
            customGstRateInput.focus();
        } else {
            customGstRateGroup.classList.add('hidden');
            calculateGST();
        }
    });
    
    // Add event listeners to inputs for real-time calculation
    gstAmountInput.addEventListener('input', calculateGST);
    customGstRateInput.addEventListener('input', calculateGST);
    
    // Toggle between Include GST and Extract GST modes
    includeGstRadio.addEventListener('change', function() {
        includeGstResults.classList.remove('hidden');
        extractGstResults.classList.add('hidden');
        calculateGST();
    });
    
    excludeGstRadio.addEventListener('change', function() {
        includeGstResults.classList.add('hidden');
        extractGstResults.classList.remove('hidden');
        calculateGST();
    });
    
    // Initialize view based on default selection
    if (includeGstRadio.checked) {
        includeGstResults.classList.remove('hidden');
        extractGstResults.classList.add('hidden');
    } else {
        includeGstResults.classList.add('hidden');
        extractGstResults.classList.remove('hidden');
    }
    
    // Reset functionality
    gstResetBtn.addEventListener('click', function() {
        gstAmountInput.value = '';
        gstRateSelect.value = '18';
        customGstRateGroup.classList.add('hidden');
        customGstRateInput.value = '';
        includeGstRadio.checked = true;
        excludeGstRadio.checked = false;
        
        // Reset display
        includeGstResults.classList.remove('hidden');
        extractGstResults.classList.add('hidden');
        
        // Reset values
        gstTaxAmount.textContent = '0.00';
        gstTaxAmountExtract.textContent = '0.00';
        gstFinalAmount.textContent = '0.00';
        gstBaseAmount.textContent = '0.00';
        gstSummary.textContent = '';
        gstError.textContent = '';
    });
    
    // Copy results functionality
    gstCopyBtn.addEventListener('click', function() {
        const results = includeGstRadio.checked
            ? `Amount: ₹${gstAmountInput.value || '0'}\nGST (${getGSTRate()}%): ₹${gstTaxAmount.textContent}\nTotal: ₹${gstFinalAmount.textContent}`
            : `Amount (with GST): ₹${gstAmountInput.value || '0'}\nGST (${getGSTRate()}%): ₹${gstTaxAmountExtract.textContent}\nBase Amount: ₹${gstBaseAmount.textContent}`;
            
        try {
            // Use the Clipboard API if available
            navigator.clipboard.writeText(results).then(() => {
                const originalText = gstCopyBtn.innerHTML;
                gstCopyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    gstCopyBtn.innerHTML = originalText;
                }, 2000);
            });
        } catch (err) {
            // Fallback for older browsers
            gstError.textContent = "Couldn't copy to clipboard. Your browser may not support this feature.";
        }
    });
    
    // Main GST calculation function
    function calculateGST() {
        // Clear error message
        gstError.textContent = '';
        
        // Get amount value
        const amountValue = gstAmountInput.value.trim();
        if (!isValidNumber(amountValue)) {
            gstTaxAmount.textContent = '0.00';
            gstTaxAmountExtract.textContent = '0.00';
            gstFinalAmount.textContent = '0.00';
            gstBaseAmount.textContent = '0.00';
            gstSummary.textContent = '';
            return;
        }
        
        const amount = parseFloat(amountValue);
        if (amount < 0) {
            gstError.textContent = "Amount cannot be negative.";
            return;
        }
        
        // Get GST rate
        const gstRate = getGSTRate();
        if (gstRate === null) {
            return; // Error is already shown in getGSTRate()
        }
        
        // Calculate GST based on selection
        if (includeGstRadio.checked) {
            // Add GST to amount
            const gstAmount = (amount * gstRate) / 100;
            const finalAmount = amount + gstAmount;
            
            // Update UI for Include GST mode
            gstTaxAmount.textContent = gstAmount.toFixed(2);
            gstFinalAmount.textContent = finalAmount.toFixed(2);
            gstSummary.textContent = `₹${amount.toFixed(2)} + ${gstRate}% GST (₹${gstAmount.toFixed(2)}) = ₹${finalAmount.toFixed(2)}`;
        } else {
            // Extract GST from amount
            const gstAmount = amount * (gstRate / (100 + gstRate));
            const baseAmount = amount - gstAmount;
            
            // Update UI for Extract GST mode
            gstTaxAmountExtract.textContent = gstAmount.toFixed(2);
            gstBaseAmount.textContent = baseAmount.toFixed(2);
            gstSummary.textContent = `₹${amount.toFixed(2)} includes ${gstRate}% GST (₹${gstAmount.toFixed(2)}). Base amount: ₹${baseAmount.toFixed(2)}`;
        }
    }
    
    // Helper function to get GST rate from selection or custom input
    function getGSTRate() {
        if (gstRateSelect.value === 'custom') {
            const customRateValue = customGstRateInput.value.trim();
            if (!isValidNumber(customRateValue)) {
                gstError.textContent = "Please enter a valid GST rate.";
                return null;
            }
            
            const customRate = parseFloat(customRateValue);
            if (customRate < 0 || customRate > 100) {
                gstError.textContent = "GST rate must be between 0 and 100.";
                return null;
            }
            
            return customRate;
        } else {
            return parseFloat(gstRateSelect.value);
        }
    }
});
