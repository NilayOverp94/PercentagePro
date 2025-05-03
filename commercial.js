document.addEventListener('DOMContentLoaded', function() {
    // Commercial Calculator Tab Switching
    const commercialTabButtons = document.querySelectorAll('.calculator-tabs .tab-button');
    const commercialTabContents = document.querySelectorAll('.calculator-content');
    
    if (commercialTabButtons.length > 0) {
        commercialTabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                commercialTabButtons.forEach(btn => btn.classList.remove('active'));
                commercialTabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current button and content
                this.classList.add('active');
                const contentElement = document.getElementById(tabName);
                if (contentElement) {
                    contentElement.classList.add('active');
                }
            });
        });
    }
    
    // Currency exchange static rates (as of May 1, 2025)
    const exchangeRates = {
        'INR': {
            'USD': 0.012,
            'EUR': 0.011,
            'GBP': 0.0095,
            'INR': 1
        },
        'USD': {
            'INR': 83.33,
            'EUR': 0.92,
            'GBP': 0.79,
            'USD': 1
        },
        'EUR': {
            'INR': 90.91,
            'USD': 1.09,
            'GBP': 0.86,
            'EUR': 1
        },
        'GBP': {
            'INR': 105.26,
            'USD': 1.27,
            'EUR': 1.16,
            'GBP': 1
        }
    };
    
    // Currency symbols for display
    const currencySymbols = {
        'INR': '₹',
        'USD': '$',
        'EUR': '€',
        'GBP': '£'
    };
    
    // ======== SIMPLE INTEREST CALCULATOR ========
    const simplePrincipalInput = document.getElementById('simple-principal');
    const simpleRateInput = document.getElementById('simple-rate');
    const simpleTimeInput = document.getElementById('simple-time');
    const simpleInterestAmount = document.getElementById('simple-interest-amount');
    const simpleInterestTotal = document.getElementById('simple-interest-total');
    const simpleInterestError = document.getElementById('simple-interest-error');
    const simpleInterestSummary = document.getElementById('simple-interest-summary');
    const simpleInterestResetBtn = document.getElementById('simple-interest-reset-btn');
    const simpleInterestCopyBtn = document.getElementById('simple-interest-copy-btn');
    
    // Helper function to safely add event listener
    function safeAddEventListener(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
        }
    }
    
    // Input event listeners for real-time calculation
    safeAddEventListener(simplePrincipalInput, 'input', calculateSimpleInterest);
    safeAddEventListener(simpleRateInput, 'input', calculateSimpleInterest);
    safeAddEventListener(simpleTimeInput, 'input', calculateSimpleInterest);
    
    // Reset functionality
    safeAddEventListener(simpleInterestResetBtn, 'click', function() {
        if (simplePrincipalInput) simplePrincipalInput.value = '';
        if (simpleRateInput) simpleRateInput.value = '';
        if (simpleTimeInput) simpleTimeInput.value = '';
        if (simpleInterestAmount) simpleInterestAmount.textContent = '₹0.00';
        if (simpleInterestTotal) simpleInterestTotal.textContent = '₹0.00';
        if (simpleInterestError) simpleInterestError.textContent = '';
        if (simpleInterestSummary) simpleInterestSummary.textContent = '';
    });
    
    // Copy results functionality
    safeAddEventListener(simpleInterestCopyBtn, 'click', function() {
        const principal = simplePrincipalInput.value || '0';
        const rate = simpleRateInput.value || '0';
        const time = simpleTimeInput.value || '0';
        const interest = simpleInterestAmount.textContent;
        const total = simpleInterestTotal.textContent;
        
        const results = `Simple Interest Calculator Results\n` +
                        `Principal: ₹${principal}\n` +
                        `Rate: ${rate}%\n` +
                        `Time: ${time} years\n` +
                        `Interest: ${interest}\n` +
                        `Total Amount: ${total}`;
        
        copyToClipboard(results, simpleInterestCopyBtn, simpleInterestError);
    });
    
    // Calculate Simple Interest Function
    function calculateSimpleInterest() {
        // Clear previous error and summary
        simpleInterestError.textContent = '';
        simpleInterestSummary.textContent = '';
        
        // Get input values
        const principal = parseFloat(simplePrincipalInput.value);
        const rate = parseFloat(simpleRateInput.value);
        const time = parseFloat(simpleTimeInput.value);
        
        // Validate inputs
        if (!isValidNumber(principal) || !isValidNumber(rate) || !isValidNumber(time)) {
            simpleInterestAmount.textContent = '₹0.00';
            simpleInterestTotal.textContent = '₹0.00';
            return;
        }
        
        if (principal < 0 || rate < 0 || time < 0) {
            simpleInterestError.textContent = 'Please enter positive values only.';
            return;
        }
        
        // Calculate Simple Interest: P * R * T / 100
        const interest = (principal * rate * time) / 100;
        const totalAmount = principal + interest;
        
        // Update display
        simpleInterestAmount.textContent = `₹${interest.toFixed(2)}`;
        simpleInterestTotal.textContent = `₹${totalAmount.toFixed(2)}`;
        
        // Update summary
        simpleInterestSummary.textContent = 
            `For a principal of ₹${principal.toFixed(2)} at ${rate.toFixed(2)}% for ${time} year${time !== 1 ? 's' : ''}, ` +
            `the interest is ₹${interest.toFixed(2)}.`;
    }
    
    // ======== COMPOUND INTEREST CALCULATOR ========
    const compoundPrincipalInput = document.getElementById('compound-principal');
    const compoundRateInput = document.getElementById('compound-rate');
    const compoundTimeInput = document.getElementById('compound-time');
    const compoundFrequencySelect = document.getElementById('compound-frequency');
    const compoundInterestAmount = document.getElementById('compound-interest-amount');
    const compoundInterestTotal = document.getElementById('compound-interest-total');
    const compoundInterestError = document.getElementById('compound-interest-error');
    const compoundInterestSummary = document.getElementById('compound-interest-summary');
    const compoundInterestResetBtn = document.getElementById('compound-interest-reset-btn');
    const compoundInterestCopyBtn = document.getElementById('compound-interest-copy-btn');
    
    // Input event listeners for real-time calculation
    safeAddEventListener(compoundPrincipalInput, 'input', calculateCompoundInterest);
    safeAddEventListener(compoundRateInput, 'input', calculateCompoundInterest);
    safeAddEventListener(compoundTimeInput, 'input', calculateCompoundInterest);
    safeAddEventListener(compoundFrequencySelect, 'change', calculateCompoundInterest);
    
    // Reset functionality
    safeAddEventListener(compoundInterestResetBtn, 'click', function() {
        compoundPrincipalInput.value = '';
        compoundRateInput.value = '';
        compoundTimeInput.value = '';
        compoundFrequencySelect.value = '1';
        compoundInterestAmount.textContent = '₹0.00';
        compoundInterestTotal.textContent = '₹0.00';
        compoundInterestError.textContent = '';
        compoundInterestSummary.textContent = '';
    });
    
    // Copy results functionality
    safeAddEventListener(compoundInterestCopyBtn, 'click', function() {
        const principal = compoundPrincipalInput.value || '0';
        const rate = compoundRateInput.value || '0';
        const time = compoundTimeInput.value || '0';
        const frequency = compoundFrequencySelect.options[compoundFrequencySelect.selectedIndex].text;
        const interest = compoundInterestAmount.textContent;
        const total = compoundInterestTotal.textContent;
        
        const results = `Compound Interest Calculator Results\n` +
                        `Principal: ₹${principal}\n` +
                        `Rate: ${rate}%\n` +
                        `Time: ${time} years\n` +
                        `Compounding: ${frequency}\n` +
                        `Interest: ${interest}\n` +
                        `Total Amount: ${total}`;
        
        copyToClipboard(results, compoundInterestCopyBtn, compoundInterestError);
    });
    
    // Calculate Compound Interest Function
    function calculateCompoundInterest() {
        // Clear previous error and summary
        compoundInterestError.textContent = '';
        compoundInterestSummary.textContent = '';
        
        // Get input values
        const principal = parseFloat(compoundPrincipalInput.value);
        const rate = parseFloat(compoundRateInput.value);
        const time = parseFloat(compoundTimeInput.value);
        const frequency = parseInt(compoundFrequencySelect.value);
        
        // Validate inputs
        if (!isValidNumber(principal) || !isValidNumber(rate) || !isValidNumber(time)) {
            compoundInterestAmount.textContent = '₹0.00';
            compoundInterestTotal.textContent = '₹0.00';
            return;
        }
        
        if (principal < 0 || rate < 0 || time < 0) {
            compoundInterestError.textContent = 'Please enter positive values only.';
            return;
        }
        
        // Calculate Compound Interest: P(1 + r/n)^(nt) - P
        const r = rate / 100;
        const nt = frequency * time;
        const compoundAmount = principal * Math.pow(1 + r/frequency, nt);
        const interest = compoundAmount - principal;
        
        // Update display
        compoundInterestAmount.textContent = `₹${interest.toFixed(2)}`;
        compoundInterestTotal.textContent = `₹${compoundAmount.toFixed(2)}`;
        
        // Get frequency text
        let frequencyText = 'annually';
        switch(frequency) {
            case 2: frequencyText = 'semi-annually'; break;
            case 4: frequencyText = 'quarterly'; break;
            case 12: frequencyText = 'monthly'; break;
            case 365: frequencyText = 'daily'; break;
        }
        
        // Update summary
        compoundInterestSummary.textContent = 
            `For a principal of ₹${principal.toFixed(2)} at ${rate.toFixed(2)}% compounded ${frequencyText} for ${time} year${time !== 1 ? 's' : ''}, ` +
            `the interest is ₹${interest.toFixed(2)}.`;
    }
    
    // ======== EMI CALCULATOR ========
    const loanAmountInput = document.getElementById('loan-amount');
    const loanRateInput = document.getElementById('loan-rate');
    const loanTenureInput = document.getElementById('loan-tenure');
    const loanTenureTypeSelect = document.getElementById('loan-tenure-type');
    const monthlyEmi = document.getElementById('monthly-emi');
    const totalInterest = document.getElementById('total-interest');
    const totalPayment = document.getElementById('total-payment');
    const emiError = document.getElementById('emi-error');
    const emiSummary = document.getElementById('emi-summary');
    const emiResetBtn = document.getElementById('emi-reset-btn');
    const emiCopyBtn = document.getElementById('emi-copy-btn');
    
    // Input event listeners for real-time calculation
    safeAddEventListener(loanAmountInput, 'input', calculateEMI);
    safeAddEventListener(loanRateInput, 'input', calculateEMI);
    safeAddEventListener(loanTenureInput, 'input', calculateEMI);
    safeAddEventListener(loanTenureTypeSelect, 'change', calculateEMI);
    
    // Reset functionality
    safeAddEventListener(emiResetBtn, 'click', function() {
        loanAmountInput.value = '';
        loanRateInput.value = '';
        loanTenureInput.value = '';
        loanTenureTypeSelect.value = 'year';
        monthlyEmi.textContent = '₹0.00';
        totalInterest.textContent = '₹0.00';
        totalPayment.textContent = '₹0.00';
        emiError.textContent = '';
        emiSummary.textContent = '';
    });
    
    // Copy results functionality
    safeAddEventListener(emiCopyBtn, 'click', function() {
        const principal = loanAmountInput.value || '0';
        const rate = loanRateInput.value || '0';
        const tenure = loanTenureInput.value || '0';
        const tenureType = loanTenureTypeSelect.options[loanTenureTypeSelect.selectedIndex].text;
        const emi = monthlyEmi.textContent;
        const interest = totalInterest.textContent;
        const payment = totalPayment.textContent;
        
        const results = `EMI Calculator Results\n` +
                        `Loan Amount: ₹${principal}\n` +
                        `Interest Rate: ${rate}%\n` +
                        `Loan Tenure: ${tenure} ${tenureType}\n` +
                        `Monthly EMI: ${emi}\n` +
                        `Total Interest: ${interest}\n` +
                        `Total Payment: ${payment}`;
        
        copyToClipboard(results, emiCopyBtn, emiError);
    });
    
    // Calculate EMI Function
    function calculateEMI() {
        // Clear previous error and summary
        emiError.textContent = '';
        emiSummary.textContent = '';
        
        // Get input values
        const loanAmount = parseFloat(loanAmountInput.value);
        const interestRate = parseFloat(loanRateInput.value);
        const tenure = parseFloat(loanTenureInput.value);
        const tenureType = loanTenureTypeSelect.value;
        
        // Validate inputs
        if (!isValidNumber(loanAmount) || !isValidNumber(interestRate) || !isValidNumber(tenure)) {
            monthlyEmi.textContent = '₹0.00';
            totalInterest.textContent = '₹0.00';
            totalPayment.textContent = '₹0.00';
            return;
        }
        
        if (loanAmount <= 0 || interestRate < 0 || tenure <= 0) {
            emiError.textContent = 'Please enter valid positive values.';
            return;
        }
        
        // Convert tenure to months if needed
        const tenureInMonths = (tenureType === 'year') ? tenure * 12 : tenure;
        
        // Calculate monthly interest rate
        const monthlyRate = interestRate / (12 * 100);
        
        // Calculate EMI: P * r * (1+r)^n / ((1+r)^n - 1)
        const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths) / 
                  (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
        
        // Calculate total payment and interest
        const totalPay = emi * tenureInMonths;
        const totalInt = totalPay - loanAmount;
        
        // Update display
        monthlyEmi.textContent = `₹${emi.toFixed(2)}`;
        totalInterest.textContent = `₹${totalInt.toFixed(2)}`;
        totalPayment.textContent = `₹${totalPay.toFixed(2)}`;
        
        // Update summary
        const tenureDisplay = tenureType === 'year' ? 
            `${tenure} year${tenure !== 1 ? 's' : ''}` : 
            `${tenure} month${tenure !== 1 ? 's' : ''}`;
            
        emiSummary.textContent = 
            `For a loan of ₹${loanAmount.toFixed(2)} at ${interestRate.toFixed(2)}% for ${tenureDisplay}, ` +
            `your monthly EMI will be ₹${emi.toFixed(2)}.`;
    }
    
    // ======== CURRENCY CONVERTER ========
    const currencyAmountInput = document.getElementById('currency-amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const convertedAmount = document.getElementById('converted-amount');
    const exchangeRateDisplay = document.getElementById('exchange-rate');
    const currencyError = document.getElementById('currency-error');
    const currencyResetBtn = document.getElementById('currency-reset-btn');
    const currencyCopyBtn = document.getElementById('currency-copy-btn');
    
    // Input event listeners for real-time conversion
    safeAddEventListener(currencyAmountInput, 'input', convertCurrency);
    safeAddEventListener(fromCurrencySelect, 'change', convertCurrency);
    safeAddEventListener(toCurrencySelect, 'change', convertCurrency);
    
    // Reset functionality
    safeAddEventListener(currencyResetBtn, 'click', function() {
        currencyAmountInput.value = '';
        fromCurrencySelect.value = 'INR';
        toCurrencySelect.value = 'USD';
        convertedAmount.textContent = '$0.00';
        exchangeRateDisplay.textContent = '1 INR = 0.012 USD';
        currencyError.textContent = '';
    });
    
    // Copy results functionality
    safeAddEventListener(currencyCopyBtn, 'click', function() {
        const amount = currencyAmountInput.value || '0';
        const fromCurrency = fromCurrencySelect.options[fromCurrencySelect.selectedIndex].text;
        const toCurrency = toCurrencySelect.options[toCurrencySelect.selectedIndex].text;
        const converted = convertedAmount.textContent;
        const rate = exchangeRateDisplay.textContent;
        
        const results = `Currency Conversion Results\n` +
                        `Amount: ${currencySymbols[fromCurrencySelect.value]}${amount}\n` +
                        `From: ${fromCurrency}\n` +
                        `To: ${toCurrency}\n` +
                        `Converted Amount: ${converted}\n` +
                        `Exchange Rate: ${rate}`;
        
        copyToClipboard(results, currencyCopyBtn, currencyError);
    });
    
    // Convert Currency Function
    function convertCurrency() {
        // Clear previous error
        currencyError.textContent = '';
        
        // Get input values
        const amount = parseFloat(currencyAmountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        // Validate input
        if (!isValidNumber(amount)) {
            convertedAmount.textContent = `${currencySymbols[toCurrency]}0.00`;
            const rate = exchangeRates[fromCurrency][toCurrency];
            exchangeRateDisplay.textContent = `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
            return;
        }
        
        if (amount < 0) {
            currencyError.textContent = 'Please enter a positive amount.';
            return;
        }
        
        // Get the exchange rate
        const rate = exchangeRates[fromCurrency][toCurrency];
        
        // Calculate converted amount
        const result = amount * rate;
        
        // Update display
        convertedAmount.textContent = `${currencySymbols[toCurrency]}${result.toFixed(2)}`;
        exchangeRateDisplay.textContent = `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
    }
    
    // ======== PROFIT & LOSS CALCULATOR (BUSINESS) ========
    const costPriceBusinessInput = document.getElementById('cost-price-business');
    const sellingPriceBusinessInput = document.getElementById('selling-price-business');
    const markedPriceInput = document.getElementById('marked-price');
    const discountPercentageInput = document.getElementById('discount-percentage');
    const showQuantityCheckbox = document.getElementById('show-quantity');
    const quantityField = document.getElementById('quantity-field');
    const quantityBusinessInput = document.getElementById('quantity-business');
    const plResultTypeBusiness = document.getElementById('pl-result-type-business');
    const plAmountBusiness = document.getElementById('pl-amount-business');
    const plPercentageBusiness = document.getElementById('pl-percentage-business');
    const plTotalRow = document.getElementById('pl-total-row');
    const plTotalAmountBusiness = document.getElementById('pl-total-amount-business');
    const discountAmount = document.getElementById('discount-amount');
    const plBusinessError = document.getElementById('pl-business-error');
    const plBusinessSummary = document.getElementById('pl-business-summary');
    const plBusinessResetBtn = document.getElementById('pl-business-reset-btn');
    const plBusinessCopyBtn = document.getElementById('pl-business-copy-btn');
    
    // Show/hide quantity field based on checkbox
    safeAddEventListener(showQuantityCheckbox, 'change', function() {
        if (this.checked) {
            quantityField.classList.remove('hidden');
            plTotalRow.classList.remove('hidden');
        } else {
            quantityField.classList.add('hidden');
            plTotalRow.classList.add('hidden');
            quantityBusinessInput.value = '1';
        }
        calculateProfitLossBusiness();
    });
    
    // Input event listeners for real-time calculation
    safeAddEventListener(costPriceBusinessInput, 'input', calculateProfitLossBusiness);
    safeAddEventListener(sellingPriceBusinessInput, 'input', calculateProfitLossBusiness);
    safeAddEventListener(markedPriceInput, 'input', calculateProfitLossBusiness);
    safeAddEventListener(discountPercentageInput, 'input', calculateProfitLossBusiness);
    safeAddEventListener(quantityBusinessInput, 'input', calculateProfitLossBusiness);
    
    // Reset functionality
    safeAddEventListener(plBusinessResetBtn, 'click', function() {
        costPriceBusinessInput.value = '';
        sellingPriceBusinessInput.value = '';
        markedPriceInput.value = '';
        discountPercentageInput.value = '';
        quantityBusinessInput.value = '1';
        showQuantityCheckbox.checked = false;
        quantityField.classList.add('hidden');
        plTotalRow.classList.add('hidden');
        
        plResultTypeBusiness.textContent = 'Enter values to see results';
        plResultTypeBusiness.className = 'result-value';
        plAmountBusiness.textContent = '₹0.00';
        plPercentageBusiness.textContent = '0.00%';
        plTotalAmountBusiness.textContent = '₹0.00';
        discountAmount.textContent = '₹0.00';
        plBusinessError.textContent = '';
        plBusinessSummary.textContent = '';
    });
    
    // Copy results functionality
    safeAddEventListener(plBusinessCopyBtn, 'click', function() {
        const cp = costPriceBusinessInput.value || '0';
        const sp = sellingPriceBusinessInput.value || '0';
        const mp = markedPriceInput.value || 'N/A';
        const discount = discountPercentageInput.value || '0';
        const quantity = quantityBusinessInput.value || '1';
        const type = plResultTypeBusiness.textContent;
        const amount = plAmountBusiness.textContent;
        const percentage = plPercentageBusiness.textContent;
        const totalAmount = plTotalAmountBusiness.textContent;
        const discountAmt = discountAmount.textContent;
        
        let results = `Profit & Loss Calculator Results\n` +
                    `Type: ${type}\n` +
                    `Cost Price: ₹${cp}\n` +
                    `Selling Price: ₹${sp}\n`;
                    
        if (markedPriceInput.value) {
            results += `Marked Price: ₹${mp}\n`;
        }
        
        if (discountPercentageInput.value) {
            results += `Discount: ${discount}%\n` +
                       `Discount Amount: ${discountAmt}\n`;
        }
        
        results += `Amount: ${amount}\n` +
                   `Percentage: ${percentage}\n`;
                   
        if (showQuantityCheckbox.checked) {
            results += `Quantity: ${quantity}\n` +
                       `Total Amount: ${totalAmount}\n`;
        }
        
        copyToClipboard(results, plBusinessCopyBtn, plBusinessError);
    });
    
    // Calculate Profit & Loss (Business) Function
    function calculateProfitLossBusiness() {
        // Clear previous error and summary
        plBusinessError.textContent = '';
        plBusinessSummary.textContent = '';
        
        // Get input values
        const costPrice = parseFloat(costPriceBusinessInput.value);
        const sellingPrice = parseFloat(sellingPriceBusinessInput.value);
        const markedPrice = parseFloat(markedPriceInput.value);
        const discountPercentage = parseFloat(discountPercentageInput.value);
        const quantity = parseInt(quantityBusinessInput.value) || 1;
        
        // Reset result styling
        plResultTypeBusiness.className = 'result-value';
        
        // Validate primary inputs (cost price and selling price)
        if (!isValidNumber(costPrice) || !isValidNumber(sellingPrice)) {
            plResultTypeBusiness.textContent = 'Enter valid values';
            plAmountBusiness.textContent = '₹0.00';
            plPercentageBusiness.textContent = '0.00%';
            plTotalAmountBusiness.textContent = '₹0.00';
            discountAmount.textContent = '₹0.00';
            return;
        }
        
        // Input validation
        if (costPrice < 0 || sellingPrice < 0 || (isValidNumber(markedPrice) && markedPrice < 0) || 
            (isValidNumber(discountPercentage) && (discountPercentage < 0 || discountPercentage > 100)) || 
            quantity <= 0) {
            plBusinessError.textContent = "Please enter valid positive values. Discount should be between 0-100%.";
            return;
        }
        
        // Calculate discount amount if marked price and discount percentage are provided
        let actualDiscountAmount = 0;
        if (isValidNumber(markedPrice) && isValidNumber(discountPercentage)) {
            actualDiscountAmount = (markedPrice * discountPercentage) / 100;
            discountAmount.textContent = `₹${actualDiscountAmount.toFixed(2)}`;
            
            // Verify if calculated selling price matches entered selling price
            const calculatedSP = markedPrice - actualDiscountAmount;
            if (Math.abs(calculatedSP - sellingPrice) > 0.01) {
                plBusinessError.textContent = "Warning: The selling price doesn't match with marked price after discount.";
            }
        } else {
            discountAmount.textContent = '₹0.00';
        }
        
        // Calculate profit or loss
        let amount, percentage, totalAmount, resultType;
        
        if (sellingPrice > costPrice) {
            // Profit calculation
            amount = sellingPrice - costPrice;
            percentage = (amount / costPrice) * 100;
            totalAmount = amount * quantity;
            resultType = "Profit";
            plResultTypeBusiness.className = 'result-value profit-text';
        } else if (costPrice > sellingPrice) {
            // Loss calculation
            amount = costPrice - sellingPrice;
            percentage = (amount / costPrice) * 100;
            totalAmount = amount * quantity;
            resultType = "Loss";
            plResultTypeBusiness.className = 'result-value loss-text';
        } else {
            // No profit, no loss
            amount = 0;
            percentage = 0;
            totalAmount = 0;
            resultType = "No Profit/Loss";
            plResultTypeBusiness.className = 'result-value neutral-text';
        }
        
        // Update display
        plResultTypeBusiness.textContent = resultType;
        plAmountBusiness.textContent = `₹${amount.toFixed(2)}`;
        plPercentageBusiness.textContent = `${percentage.toFixed(2)}%`;
        plTotalAmountBusiness.textContent = `₹${totalAmount.toFixed(2)}`;
        
        // Update summary
        let summary = `For a cost price of ₹${costPrice.toFixed(2)} and selling price of ₹${sellingPrice.toFixed(2)}, `;
        
        if (isValidNumber(markedPrice) && isValidNumber(discountPercentage)) {
            summary += `with a marked price of ₹${markedPrice.toFixed(2)} and ${discountPercentage.toFixed(2)}% discount, `;
        }
        
        if (sellingPrice > costPrice) {
            summary += `you make a profit of ₹${amount.toFixed(2)} (${percentage.toFixed(2)}%).`;
        } else if (costPrice > sellingPrice) {
            summary += `you incur a loss of ₹${amount.toFixed(2)} (${percentage.toFixed(2)}%).`;
        } else {
            summary += `you break even (no profit, no loss).`;
        }
        
        if (quantity > 1) {
            summary += ` Total ${resultType.toLowerCase()} for ${quantity} units: ₹${totalAmount.toFixed(2)}.`;
        }
        
        plBusinessSummary.textContent = summary;
    }
    
    // ======== BREAK-EVEN POINT CALCULATOR ========
    const fixedCostInput = document.getElementById('fixed-cost');
    const variableCostInput = document.getElementById('variable-cost');
    const sellingPriceUnitInput = document.getElementById('selling-price-unit');
    const breakevenUnits = document.getElementById('breakeven-units');
    const breakevenRevenue = document.getElementById('breakeven-revenue');
    const contributionMargin = document.getElementById('contribution-margin');
    const contributionRatio = document.getElementById('contribution-ratio');
    const breakevenError = document.getElementById('breakeven-error');
    const breakevenSummary = document.getElementById('breakeven-summary');
    const breakevenResetBtn = document.getElementById('breakeven-reset-btn');
    const breakevenCopyBtn = document.getElementById('breakeven-copy-btn');
    
    // Input event listeners for real-time calculation
    safeAddEventListener(fixedCostInput, 'input', calculateBreakeven);
    safeAddEventListener(variableCostInput, 'input', calculateBreakeven);
    safeAddEventListener(sellingPriceUnitInput, 'input', calculateBreakeven);
    
    // Reset functionality
    safeAddEventListener(breakevenResetBtn, 'click', function() {
        fixedCostInput.value = '';
        variableCostInput.value = '';
        sellingPriceUnitInput.value = '';
        breakevenUnits.textContent = '0 units';
        breakevenRevenue.textContent = '₹0.00';
        contributionMargin.textContent = '₹0.00';
        contributionRatio.textContent = '0.00%';
        breakevenError.textContent = '';
        breakevenSummary.textContent = '';
    });
    
    // Copy results functionality
    safeAddEventListener(breakevenCopyBtn, 'click', function() {
        const fixedCost = fixedCostInput.value || '0';
        const variableCost = variableCostInput.value || '0';
        const sellingPrice = sellingPriceUnitInput.value || '0';
        const bepUnits = breakevenUnits.textContent;
        const bepRevenue = breakevenRevenue.textContent;
        const contMargin = contributionMargin.textContent;
        const contRatio = contributionRatio.textContent;
        
        const results = `Break-even Point Calculator Results\n` +
                        `Fixed Cost: ₹${fixedCost}\n` +
                        `Variable Cost per Unit: ₹${variableCost}\n` +
                        `Selling Price per Unit: ₹${sellingPrice}\n` +
                        `Break-even Point (Units): ${bepUnits}\n` +
                        `Break-even Point (Revenue): ${bepRevenue}\n` +
                        `Contribution Margin per Unit: ${contMargin}\n` +
                        `Contribution Margin Ratio: ${contRatio}`;
        
        copyToClipboard(results, breakevenCopyBtn, breakevenError);
    });
    
    // Calculate Break-even Point Function
    function calculateBreakeven() {
        // Clear previous error and summary
        breakevenError.textContent = '';
        breakevenSummary.textContent = '';
        
        // Get input values
        const fixedCost = parseFloat(fixedCostInput.value);
        const variableCost = parseFloat(variableCostInput.value);
        const sellingPrice = parseFloat(sellingPriceUnitInput.value);
        
        // Validate inputs
        if (!isValidNumber(fixedCost) || !isValidNumber(variableCost) || !isValidNumber(sellingPrice)) {
            breakevenUnits.textContent = '0 units';
            breakevenRevenue.textContent = '₹0.00';
            contributionMargin.textContent = '₹0.00';
            contributionRatio.textContent = '0.00%';
            return;
        }
        
        if (fixedCost < 0 || variableCost < 0 || sellingPrice <= 0) {
            breakevenError.textContent = 'Please enter valid positive values. Selling price must be greater than zero.';
            return;
        }
        
        // Calculate contribution margin per unit
        const contMargin = sellingPrice - variableCost;
        
        // Check if contribution margin is zero or negative
        if (contMargin <= 0) {
            breakevenError.textContent = 'Break-even cannot be achieved as variable cost exceeds or equals selling price.';
            breakevenUnits.textContent = 'Not possible';
            breakevenRevenue.textContent = 'Not possible';
            contributionMargin.textContent = `₹${contMargin.toFixed(2)}`;
            contributionRatio.textContent = `${((contMargin / sellingPrice) * 100).toFixed(2)}%`;
            return;
        }
        
        // Calculate contribution margin ratio
        const contRatio = (contMargin / sellingPrice) * 100;
        
        // Calculate break-even point in units
        const bepUnits = fixedCost / contMargin;
        
        // Calculate break-even point in revenue
        const bepRevenue = bepUnits * sellingPrice;
        
        // Update display
        breakevenUnits.textContent = `${Math.ceil(bepUnits)} units`;
        breakevenRevenue.textContent = `₹${bepRevenue.toFixed(2)}`;
        contributionMargin.textContent = `₹${contMargin.toFixed(2)}`;
        contributionRatio.textContent = `${contRatio.toFixed(2)}%`;
        
        // Update summary
        breakevenSummary.textContent = 
            `With fixed costs of ₹${fixedCost.toFixed(2)}, variable costs of ₹${variableCost.toFixed(2)} per unit, ` +
            `and a selling price of ₹${sellingPrice.toFixed(2)} per unit, you need to sell ${Math.ceil(bepUnits)} units ` +
            `(₹${bepRevenue.toFixed(2)} in revenue) to break even.`;
    }
    
    // ======== PERCENTAGE CHANGE CALCULATOR (BUSINESS) ========
    const oldValueBusinessInput = document.getElementById('old-value-business');
    const newValueBusinessInput = document.getElementById('new-value-business');
    const percentageChangeResultBusiness = document.getElementById('percentage-change-result-business');
    const absoluteChange = document.getElementById('absolute-change');
    const percentageChangeBusinessError = document.getElementById('percentage-change-business-error');
    const percentageChangeBusinessSummary = document.getElementById('percentage-change-business-summary');
    const percentageChangeBusinessResetBtn = document.getElementById('percentage-change-business-reset-btn');
    const percentageChangeBusinessCopyBtn = document.getElementById('percentage-change-business-copy-btn');
    
    // Input event listeners for real-time calculation
    safeAddEventListener(oldValueBusinessInput, 'input', calculatePercentageChangeBusiness);
    safeAddEventListener(newValueBusinessInput, 'input', calculatePercentageChangeBusiness);
    
    // Reset functionality
    safeAddEventListener(percentageChangeBusinessResetBtn, 'click', function() {
        oldValueBusinessInput.value = '';
        newValueBusinessInput.value = '';
        percentageChangeResultBusiness.textContent = '0.00%';
        percentageChangeResultBusiness.className = 'result-value';
        absoluteChange.textContent = '0.00';
        percentageChangeBusinessError.textContent = '';
        percentageChangeBusinessSummary.textContent = '';
    });
    
    // Copy results functionality
    safeAddEventListener(percentageChangeBusinessCopyBtn, 'click', function() {
        const oldValue = oldValueBusinessInput.value || '0';
        const newValue = newValueBusinessInput.value || '0';
        const percentageChange = percentageChangeResultBusiness.textContent;
        const absChange = absoluteChange.textContent;
        
        // Determine if it's an increase or decrease
        let changeType = "";
        const pctChange = parseFloat(percentageChange);
        if (pctChange > 0) {
            changeType = "increase";
        } else if (pctChange < 0) {
            changeType = "decrease";
        } else {
            changeType = "change";
        }
        
        const results = `Percentage Change Calculator Results\n` +
                        `Original Value: ${oldValue}\n` +
                        `New Value: ${newValue}\n` +
                        `Absolute Change: ${absChange}\n` +
                        `Percentage Change: ${percentageChange} (${changeType})`;
        
        copyToClipboard(results, percentageChangeBusinessCopyBtn, percentageChangeBusinessError);
    });
    
    // Calculate Percentage Change (Business) Function
    function calculatePercentageChangeBusiness() {
        // Clear previous error and summary
        percentageChangeBusinessError.textContent = '';
        percentageChangeBusinessSummary.textContent = '';
        
        // Reset styling
        percentageChangeResultBusiness.className = 'result-value';
        
        // Get input values
        const oldValue = parseFloat(oldValueBusinessInput.value);
        const newValue = parseFloat(newValueBusinessInput.value);
        
        // Validate inputs
        if (!isValidNumber(oldValue) || !isValidNumber(newValue)) {
            percentageChangeResultBusiness.textContent = '0.00%';
            absoluteChange.textContent = '0.00';
            return;
        }
        
        // Avoid division by zero
        if (oldValue === 0) {
            percentageChangeBusinessError.textContent = "Cannot calculate percentage change: original value cannot be zero.";
            return;
        }
        
        // Calculate absolute change
        const absChange = newValue - oldValue;
        
        // Calculate the percentage change: ((new - old) / old) * 100
        const percentageChange = (absChange / oldValue) * 100;
        
        // Update display
        percentageChangeResultBusiness.textContent = `${percentageChange.toFixed(2)}%`;
        absoluteChange.textContent = absChange.toFixed(2);
        
        // Add color classes
        if (percentageChange > 0) {
            percentageChangeResultBusiness.className = 'result-value profit-text';
        } else if (percentageChange < 0) {
            percentageChangeResultBusiness.className = 'result-value loss-text';
        } else {
            percentageChangeResultBusiness.className = 'result-value neutral-text';
        }
        
        // Update summary
        let changeType = percentageChange > 0 ? "increased" : (percentageChange < 0 ? "decreased" : "remained the same");
        const displayPercentage = Math.abs(percentageChange).toFixed(2);
        
        percentageChangeBusinessSummary.textContent = 
            `From ${oldValue.toFixed(2)} to ${newValue.toFixed(2)} is a ${displayPercentage}% ${changeType === "remained the same" ? "change" : changeType}.`;
    }
    
    // Helper function to validate if a string is a valid number
    function isValidNumber(value) {
        // Check if value is empty
        if (value === undefined || value === null) return false;
        
        // Check if value is a valid number
        return !isNaN(value) && isFinite(value);
    }
    
    // Helper function to copy text to clipboard
    function copyToClipboard(text, button, errorElement) {
        try {
            // Use the Clipboard API if available
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            });
        } catch (err) {
            // Fallback for older browsers
            errorElement.textContent = "Couldn't copy to clipboard. Your browser may not support this feature.";
        }
    }
});