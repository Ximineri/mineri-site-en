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

        const nightlyRate = 1000, eventRate = 2000, bottlePrice = 390;
        const bottleCostRate = 0.20, fAndBRate = 60, avgGuests = 8;
        const fixedRent = 3000, managerBase = 1000, managerComm = 0.02, ownerComm = 0.15;
        const otherCosts = 600 + 300 + 500 + 1000;

        const residentialRevenue = occupancy * nightlyRate;
        const eventRentalRevenue = eventCount * eventRate;
        const perfumeRevenue = bottlesSold * bottlePrice;
        const totalGrossRevenue = residentialRevenue + eventRentalRevenue + perfumeRevenue + workshopRevenue;
        
        const fAndBCost = occupancy * avgGuests * fAndBRate;
        const perfumeCost = perfumeRevenue * bottleCostRate;
        const managerSalary = managerBase + (totalGrossRevenue * managerComm);
        const totalOperatingCosts = fAndBCost + perfumeCost + managerSalary + otherFixedCosts;
        
        const netProfit = totalGrossRevenue - totalOperatingCosts - fixedRent;
        
        const ownerCommission = netProfit > 0 ? netProfit * ownerComm : 0;
        const ownerTotalIncome = fixedRent + ownerCommission;
        const mineriNetProfit = netProfit - ownerCommission;

        document.getElementById('simGrossRevenue').textContent = '$' + Math.round(totalGrossRevenue).toLocaleString();
        document.getElementById('simOwnerShare').textContent = '$' + Math.round(ownerTotalIncome).toLocaleString();
        document.getElementById('simMineriProfit').textContent = '$' + Math.round(mineriNetProfit).toLocaleString();
    }
    
    allSliders.forEach(slider => slider.addEventListener('input', updateAllFinancials));
    updateAllFinancials();

    // --- CONTRACT LOGIC ---
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
             let printableHTML = `
                <html>
                    <head>
                        <title>MINĒRI - Partnership Agreement Proposal</title>
                        <style>
                            body { font-family: 'Times New Roman', Times, serif; line-height: 1.5; margin: 2cm; } 
                            h2, h3, h4, strong, legend { font-family: Arial, sans-serif; } 
                            h2 { text-align: center; font-size: 22pt; }
                            h3 { color: #3C3232; border-top: 1px solid #ccc; padding-top: 1em; margin-top: 2em; font-size: 16pt; }
                            h4 { font-size: 14pt; margin-top: 1.5em; }
                            p { margin: 0.5em 0; }
                            .selected-option { border: 1px solid #ccc; padding: 1em; margin-top: 0.5em; background-color: #f9f9f9; }
                        </style>
                    </head>
                    <body>
                        <h2>MASTER LEASE AGREEMENT</h2>
                        <p><strong>BETWEEN THE UNDERSIGNED:</strong> ...</p>
                        <p><strong>AND:</strong> The company Thang Long Event...</p>
                        <hr>`;
            
             contractWrapper.querySelectorAll('.contract-article').forEach(article => {
                const h3 = article.querySelector('h3');
                printableHTML += h3.outerHTML;

                article.querySelectorAll('p').forEach(p => {
                    if (!p.closest('fieldset')) {
                        printableHTML += p.outerHTML;
                    }
                });

                article.querySelectorAll('fieldset').forEach(fieldset => {
                    const legend = fieldset.querySelector('legend');
                    const selectedRadio = fieldset.querySelector('input[type="radio"]:checked');
                    printableHTML += `<h4>${legend.textContent}</h4>`;
                    if (selectedRadio) {
                        const selectedLabel = selectedRadio.closest('.option-label');
                        printableHTML += `<div class="selected-option">${selectedLabel.querySelector('div').innerHTML}</div>`;
                    } else {
                        printableHTML += `<p><em>No option selected for this section.</em></p>`;
                    }
                });
             });

            printableHTML += `<br/><br/><br/>
                <table style="width: 100%;">
                    <tr>
                        <td style="width: 50%; text-align: center;"><strong>THE OWNER</strong></td>
                        <td style="width: 50%; text-align: center;"><strong>THE MASTER LESSEE</strong></td>
                    </tr>
                    <tr>
                        <td style="padding-top: 4em;">_________________________</td>
                        <td style="padding-top: 4em;">_________________________</td>
                    </tr>
                     <tr>
                        <td style="text-align: center;">[FULL NAME OF OWNER]</td>
                        <td style="text-align: center;">Mr. Xi Minēri (Alexis Lerale)</td>
                    </tr>
                </table>
            `;

             printWindow.document.write(printableHTML + '</body></html>');
             printWindow.document.close();
             printWindow.focus();
             setTimeout(() => { printWindow.print(); }, 500);
        });
    }
});
