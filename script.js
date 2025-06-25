document.addEventListener('DOMContentLoaded', function() {

    // --- Accordion Logic ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = content.style.maxHeight;
            
            // This part closes any open accordion before opening a new one.
            document.querySelectorAll('.accordion-content').forEach(c => {
                c.style.maxHeight = null;
                if(c.previousElementSibling) {
                    c.previousElementSibling.querySelector('.plus-minus').textContent = '+';
                }
            });

            // If the clicked one wasn't active, open it
            if (!isActive) {
                content.style.maxHeight = content.scrollHeight + "px";
                header.querySelector('.plus-minus').textContent = '-';
            }
        });
    });

    // --- Business Plan Simulator Logic ---
    const occupancySlider = document.getElementById('occupancyRate');
    const nightlyRateSlider = document.getElementById('nightlyRate');

    function calculateFinancials() {
        if (!occupancySlider || !nightlyRateSlider) return;
        
        const occupancy = parseInt(occupancySlider.value);
        const rate = parseInt(nightlyRateSlider.value);

        document.getElementById('occupancyValue').textContent = occupancy;
        document.getElementById('nightlyRateValue').textContent = rate;

        const nightsPerMonth = 30;
        const eventRevenue = 4000;
        const fAndBCostPerNight = 480; // 8 guests * $60
        const otherCosts = 1000 + 1480 + 600 + 300; // Misc + Salary + Cleaning + Marketing
        const ownerFixedRent = 3000;
        const ownerCommissionRate = 0.15;

        const occupiedNights = nightsPerMonth * (occupancy / 100);
        const residentialRevenue = occupiedNights * rate;
        const totalGrossRevenue = residentialRevenue + eventRevenue;
        
        const ownerShare = ownerFixedRent + (totalGrossRevenue * ownerCommissionRate);
        const totalOperationalCosts = otherCosts + (occupiedNights * fAndBCostPerNight);
        const mineriProfit = totalGrossRevenue - ownerShare - totalOperationalCosts;

        document.getElementById('simGrossRevenue').textContent = '$' + Math.round(totalGrossRevenue).toLocaleString();
        document.getElementById('simOwnerShare').textContent = '$' + Math.round(ownerShare).toLocaleString();
        document.getElementById('simMineriProfit').textContent = '$' + Math.round(mineriProfit).toLocaleString();
    }

    if (occupancySlider) {
        occupancySlider.addEventListener('input', calculateFinancials);
        nightlyRateSlider.addEventListener('input', calculateFinancials);
        calculateFinancials();
    }

    // --- Interactive Contract Logic ---
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

    if (contractOptions.length > 0) {
        contractOptions.forEach(option => option.addEventListener('change', updateSummary));
        updateSummary();
    }
    
    // --- Print Logic ---
    const printButton = document.getElementById('printButton');
    if(printButton) {
        printButton.addEventListener('click', () => {
            const printWindow = window.open('', '_blank');
            const contractHTML = document.getElementById('full-contract-content-wrapper').innerHTML;
            
            // Create a temporary element to parse and manipulate the contract HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = contractHTML;

            // Remove unselected options
            tempDiv.querySelectorAll('fieldset').forEach(fieldset => {
                const selectedRadio = fieldset.querySelector('input[type="radio"]:checked');
                if (selectedRadio) {
                    fieldset.querySelectorAll('.option-label').forEach(label => {
                        if (!label.contains(selectedRadio)) {
                            label.remove();
                        } else {
                             label.style.border = '2px solid #770099';
                             label.style.backgroundColor = '#f8e6ff';
                        }
                    });
                }
            });
            
            printWindow.document.write(`
                <html>
                    <head>
                        <title>MINĒRI - Master Lease Agreement for Signature</title>
                        <style>
                            body { font-family: 'Times New Roman', Times, serif; line-height: 1.5; margin: 2cm; } 
                            h2, h3, h4, strong, legend { font-family: Arial, sans-serif; } 
                            h3 { color: #770099; border-top: 1px solid #ccc; padding-top: 1em; margin-top: 1em; }
                            fieldset { border: 0; padding: 0; margin: 0; }
                            legend { font-weight: bold; padding-left: 0; font-size: 1.1em; margin-top: 1em; }
                            .option-label { border: 1px solid #ccc; padding: 1em; margin-top: 1em; page-break-inside: avoid; }
                            p { margin-top: 0.5em; margin-bottom: 0.5em; }
                        </style>
                    </head>
                    <body>
                        <h1>MASTER LEASE AGREEMENT</h1>
                        <p><strong>BETWEEN THE UNDERSIGNED...</strong></p> 
                        ${tempDiv.innerHTML}
                        <br/><br/><p><strong>THE OWNER</strong><br/><br/>_________________________</p>
                        <br/><br/><p><strong>THE MASTER LESSEE</strong><br/>For Thang Long Event<br/><br/>_________________________<br/>Mr. LERALE Alexis</p>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => { printWindow.print(); }, 500);
        });
    }
});
