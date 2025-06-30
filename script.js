window.addEventListener('load', function() {

    // --- Accordion Logic ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = content.style.maxHeight;
            header.classList.toggle('active');
            if (isActive) {
                content.style.maxHeight = null;
                header.querySelector('.plus-minus').textContent = '+';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                header.querySelector('.plus-minus').textContent = '-';
            }
        });
    });

    // --- DUAL SIMULATOR LOGIC ---
    const allSliders = document.querySelectorAll('.slider');

    function updateAllFinancials() {
        if (allSliders.length === 0) return;
        
        const occupancy = parseInt(document.getElementById('occupancyRate').value);
        const eventCount = parseInt(document.getElementById('eventRentals').value);
        const bottlesSold = parseInt(document.getElementById('bottlesSold').value);
        const workshopRevenue = parseInt(document.getElementById('workshopRevenue').value);

        document.getElementById('occupancyValue').textContent = occupancy;
        document.getElementById('eventRentalsValue').textContent = eventCount;
        document.getElementById('bottlesSoldValue').textContent = bottlesSold;
        document.getElementById('workshopRevenueValue').textContent = workshopRevenue.toLocaleString();

        const nightlyRate = 1000;
        const eventRate = 2000;
        const bottlePrice = 290; // Corrected Price
        const bottleCostRate = 0.20;
        const fAndBRate = 60;
        const avgGuests = 8;
        const fixedRent = 3000;
        const managerSalary = 1657; // Using fixed salary from BP for simplicity
        const otherFixedCosts = 600 + 300 + 500 + 1000; // Cleaning + Mkt + Workshop + Misc

        const residentialRevenue = occupancy * nightlyRate;
        const eventRentalRevenue = eventCount * eventRate;
        const perfumeRevenue = bottlesSold * bottlePrice;
        const totalGrossRevenue = residentialRevenue + eventRentalRevenue + perfumeRevenue + workshopRevenue;
        
        const fAndBCost = occupancy * avgGuests * fAndBRate;
        const perfumeCost = perfumeRevenue * bottleCostRate;
        const totalOperatingCosts = fAndBCost + perfumeCost + managerSalary + otherFixedCosts;
        
        const netProfit = totalGrossRevenue - totalOperatingCosts - fixedRent;
        
        const ownerCommission = netProfit > 0 ? netProfit * 0.15 : 0;
        const ownerTotalIncome = fixedRent + ownerCommission;
        const mineriNetProfit = netProfit - ownerCommission;

        document.getElementById('simGrossRevenue').textContent = '$' + Math.round(totalGrossRevenue).toLocaleString();
        document.getElementById('simOwnerShare').textContent = '$' + Math.round(ownerTotalIncome).toLocaleString();
        document.getElementById('simMineriProfit').textContent = '$' + Math.round(mineriNetProfit).toLocaleString();
    }
    
    allSliders.forEach(slider => slider.addEventListener('input', updateAllFinancials));
    updateAllFinancials();

    // --- CONTRACT LOGIC (from hardcoded HTML) ---
    const contractOptions = document.querySelectorAll('#contract input[type="radio"]');
    const summaryList = document.getElementById('summary-list');
    
    function updateSummary() {
        if (!summaryList) return;
        const selectedOptions = document.querySelectorAll('#contract input[type="radio"]:checked');
        
        document.querySelectorAll('.option-label').forEach(label => label.classList.remove('selected'));
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
    updateSummary();
    
    // --- PRINT LOGIC ---
    const printButton = document.getElementById('printButton');
    if(printButton) {
        printButton.addEventListener('click', () => {
             const contractWrapper = document.getElementById('full-contract-content-wrapper');
             const printWindow = window.open('', '_blank');
             let clonedContract = contractWrapper.cloneNode(true);

             clonedContract.querySelectorAll('fieldset').forEach(fieldset => {
                const selectedRadio = fieldset.querySelector('input[type="radio"]:checked');
                fieldset.querySelectorAll('.option-label').forEach(label => {
                    if (selectedRadio && !label.contains(selectedRadio)) {
                        label.remove();
                    }
                });
             });

             const printableHTML = clonedContract.innerHTML;
             
             printWindow.document.write(`
                <html>
                    <head><title>MINĒRI - Partnership Agreement Proposal</title>
                    <style>
                        body { font-family: 'Times New Roman', Times, serif; line-height: 1.5; margin: 2cm; } 
                        h3, strong, legend { font-family: Arial, sans-serif; } 
                        h3 { color: #3C3232; border-top: 1px solid #ccc; padding-top: 1em; margin-top: 2em; font-size: 16pt; }
                        fieldset { border: 0; padding: 0; margin: 0; }
                        legend { font-size: 1.1em; margin-top: 1em; }
                        .option-label { border: 1px solid #ccc; padding: 1em; margin-top: 0.5em; page-break-inside: avoid; }
                        p { margin: 0.5em 0; }
                    </style>
                    </head>
                    <body>
                        <h2 style="text-align: center;">MASTER LEASE AGREEMENT</h2>
                        <p><strong>BETWEEN THE UNDERSIGNED...</strong></p>
                        ${printableHTML}
                        <br/><br/>
                        <table style="width: 100%; margin-top: 5em;">
                            <tr>
                                <td style="width: 50%;"><strong>THE OWNER</strong><br/><br/><br/>_________________________</td>
                                <td style="width: 50%;"><strong>THE MASTER LESSEE</strong><br/><br/><br/>_________________________</td>
                            </tr>
                        </table>
                    </body>
                </html>
             `);
             printWindow.document.close();
             printWindow.focus();
             setTimeout(() => { printWindow.print(); }, 500);
        });
    }
});
