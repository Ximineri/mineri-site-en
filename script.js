window.addEventListener('load', function() {

    // --- GENERAL ACCORDION LOGIC ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = content.style.maxHeight;
            
            // This logic ensures only one accordion is open at a time
            document.querySelectorAll('.accordion-content').forEach(acc => {
                if (acc !== content) {
                    acc.style.maxHeight = null;
                    if(acc.previousElementSibling) {
                       acc.previousElementSibling.classList.remove('active');
                       acc.previousElementSibling.querySelector('.plus-minus').textContent = '+';
                    }
                }
            });

            // Toggle the clicked accordion
            if (isActive) {
                content.style.maxHeight = null;
                header.classList.remove('active');
                header.querySelector('.plus-minus').textContent = '+';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                header.classList.add('active');
                header.querySelector('.plus-minus').textContent = '-';
            }
        });
    });

    // --- DUAL SIMULATOR LOGIC ---
    const sliders = document.querySelectorAll('.slider');

    function updateAllFinancials() {
        // Get all current values from sliders if they exist
        const occupancy = document.getElementById('occupancyRate') ? parseInt(document.getElementById('occupancyRate').value) : 0;
        const eventCount = document.getElementById('eventRentals') ? parseInt(document.getElementById('eventRentals').value) : 0;
        const bottlesSold = document.getElementById('bottlesSold') ? parseInt(document.getElementById('bottlesSold').value) : 0;
        const workshopRevenue = document.getElementById('workshopRevenue') ? parseInt(document.getElementById('workshopRevenue').value) : 0;

        // Update display values next to sliders
        if(document.getElementById('occupancyValue')) document.getElementById('occupancyValue').textContent = occupancy;
        if(document.getElementById('eventRentalsValue')) document.getElementById('eventRentalsValue').textContent = eventCount;
        if(document.getElementById('bottlesSoldValue')) document.getElementById('bottlesSoldValue').textContent = bottlesSold;
        if(document.getElementById('workshopRevenueValue')) document.getElementById('workshopRevenueValue').textContent = workshopRevenue.toLocaleString();

        // Constants from Business Plan
        const nightlyRate = 1000;
        const eventRate = 2000;
        const bottlePrice = 390;
        const bottleCost = bottlePrice * 0.20;
        const fAndBCostPerGuest = 60;
        const avgGuests = 8;
        const fixedRent = 3000;
        const managerBaseSalary = 1000;
        const managerCommissionRate = 0.02;
        const otherFixedCosts = 600 + 300 + 500 + 1000; // Cleaning + Mkt + Workshop + Misc

        // --- Revenue Calculation ---
        const residentialRevenue = (occupancy / 100) * 30 * nightlyRate;
        const eventRevenue = eventCount * eventRate;
        const perfumeRevenue = bottlesSold * bottlePrice;
        const totalGrossRevenue = residentialRevenue + eventRevenue + perfumeRevenue + workshopRevenue;

        // --- Cost Calculation ---
        const fAndBCost = (occupancy / 100) * 30 * avgGuests * fAndBCostPerGuest;
        const perfumeCost = bottlesSold * bottleCost;
        const totalManagerSalary = managerBaseSalary + (totalGrossRevenue * managerCommissionRate);
        const totalOperatingCosts = totalManagerSalary + fAndBCost + perfumeCost + otherFixedCosts;
        
        // --- Profit Calculation & Distribution ---
        const grossProfit = totalGrossRevenue - totalOperatingCosts - fixedRent;
        const ownerCommission = grossProfit > 0 ? grossProfit * 0.15 : 0;
        const ownerTotalIncome = fixedRent + ownerCommission;
        const mineriNetProfit = grossProfit - ownerCommission;

        // --- Update Display ---
        if(document.getElementById('simGrossRevenue')) document.getElementById('simGrossRevenue').textContent = '$' + Math.round(totalGrossRevenue).toLocaleString();
        if(document.getElementById('simOwnerShare')) document.getElementById('simOwnerShare').textContent = '$' + Math.round(ownerTotalIncome).toLocaleString();
        if(document.getElementById('simMineriProfit')) document.getElementById('simMineriProfit').textContent = '$' + Math.round(mineriNetProfit).toLocaleString();
    }
    
    sliders.forEach(slider => slider.addEventListener('input', updateAllFinancials));
    
    // --- CONTRACT LOGIC ---
    const contractWrapper = document.getElementById('full-contract-content-wrapper');
    if (contractWrapper) {
        // Here we just attach listeners, assuming contract is in HTML
        const contractOptions = contractWrapper.querySelectorAll('input[type="radio"]');
        const summaryList = document.getElementById('summary-list');
        
        function updateSummary() {
            if (!summaryList) return;
            const selectedOptions = contractWrapper.querySelectorAll('input[type="radio"]:checked');
            
            contractWrapper.querySelectorAll('.option-label').forEach(label => label.classList.remove('selected'));
            selectedOptions.forEach(radio => radio.closest('.option-label').classList.add('selected'));
            
            summaryList.innerHTML = ''; 
            
            if (selectedOptions.length === 0) {
                summaryList.innerHTML = `<li><p>Please select an option in each category...</p></li>`;
            } else {
                selectedOptions.forEach(option => {
                    const groupNameEl = option.closest('fieldset').querySelector('legend');
                    const optionTitleEl = option.closest('.option-label').querySelector('strong');
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${groupNameEl.textContent}:</strong> ${optionTitleEl.textContent}`;
                    summaryList.appendChild(li);
                });
            }

            const accordionContent = summaryList.closest('.accordion-content');
            if (accordionContent && accordionContent.style.maxHeight) {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
            }
        }

        contractOptions.forEach(option => option.addEventListener('change', updateSummary));
        updateSummary(); // Initial call
    }

    // --- PRINT LOGIC ---
    const printButton = document.getElementById('printButton');
    if(printButton) {
        printButton.addEventListener('click', () => {
            const contractContent = document.getElementById('full-contract-content-wrapper').innerHTML;
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head><title>MINĒRI - Partnership Agreement Proposal</title>
                    <style>
                        body { font-family: 'Times New Roman', Times, serif; line-height: 1.5; margin: 2cm; }
                        h1, h2, h3, h4, strong, legend { font-family: Arial, sans-serif; }
                        h3 { color: #BC9C2F; border-top: 1px solid #ccc; padding-top: 1em; margin-top: 1em; }
                        fieldset { border: 0; padding: 0; margin-top: 1em; }
                        .option-label { border: 1px solid #ccc; padding: 1em; margin-top: 0.5em; }
                        .option-label.selected { border: 2px solid #BC9C2F; background-color: #fdfaf2; }
                    </style>
                    </head>
                    <body>
                        <h1>MINĒRI - Partnership Agreement Proposal</h1>
                        <p>This document is generated based on the options selected on the presentation website. It outlines the full terms for discussion.</p>
                        <hr>
                        ${contractContent}
                        <hr>
                        <br/><br/>
                        <p><strong>THE OWNER</strong><br/><br/>_________________________<br/>[FULL NAME OF OWNER]</p>
                        <br/><br/>
                        <p><strong>THE MASTER LESSEE</strong><br/>For Thang Long Event<br/><br/>_________________________<br/>Mr. LERALE Alexis, Founder</p>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => { printWindow.print(); }, 500);
        });
    }

    // Initial calculations on page load
    updateAllFinancials();
});
