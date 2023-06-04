var chartId = 0;

document.getElementById('investmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var initialInvestment = Number(document.getElementById('investment').value);
    var interestRate = Number(document.getElementById('interestRate').value);
    var years = Number(document.getElementById('years').value);
    var annualExpense = Number(document.getElementById('annualExpense').value);
    var inflationRate = Number(document.getElementById('inflationRate').value);
    var retirementYears = Number(document.getElementById('retirementYears').value);
    var firstAnnualAddition = 0;
    
    // Calculate gains over the specified number of years
    var labels = [];
    var dataAccumulation = [];
    var dataGain = [];
    var dataAddition = [];
    var dataWithdrawal = [];
    var targetAmount = 0;

    // Calculate annualExpense at retirement
    annualExpense = annualExpense * Math.pow(1 + (inflationRate / 100), years);
    for (var year = 1; year <= years + retirementYears; year++) {
        // Create an array of annual initial with 0s to fill in later
        dataAccumulation.push("0");
        dataGain.push("0");

        if (year <= years) {
            // Before retirement, withdraw 0
            dataWithdrawal.push("0");
        } else { // After retirement
            // Withdrawal money every year after retirement 
            annualExpense *= (1 + (inflationRate / 100));
            dataWithdrawal.push((-1 * annualExpense).toFixed(2));
        }
        labels.push('Year ' + year);
    }
    
    // In the last year, withdraw all the remaining money. Also, every year after retirement, there is still interest gain.
    for (let year = years + retirementYears - 2; year >= years; year--) {
        dataAccumulation[year] = ((dataAccumulation[year+1] / (1 + (interestRate / 100))) - Number(dataWithdrawal[year])).toFixed(2);
        dataGain[year] = (dataAccumulation[year] * (interestRate / 100)).toFixed(2);
    }

    // Target amount is equal to the initial sum of the 1st year after retirement
    targetAmount = Number(dataAccumulation[years]);    
        
    // Calculate annual addition to reach target amount
    // The total investment plus the total gain should be equal to the target amount
    // Y: annual investment
    // a: interest rate
    // X: target amount
    // Then:
    // Y.a^years + Y.a^(years-1) + ... + Y.a + Y = X
    //<=> Y.(a^years + a^(years-1) + ... + a + 1) = X
    //<=> Y = X / (a^years + a^(years-1) + ... + a + 1)

    accumulatedInterestRateAfterYears = 0;
    for (let i = 0; i < years; i++) {
        accumulatedInterestRateAfterYears += Math.pow(1 + (interestRate / 100), i)* Math.pow(1 + (inflationRate / 100), years - i - 1);
    }
    var firstAnnualAddition = targetAmount/accumulatedInterestRateAfterYears;

    // First year is special because it has no gain
    dataAccumulation[0] = initialInvestment.toFixed(2);
    dataGain[0] = 0;
    dataAddition[0] = firstAnnualAddition.toFixed(2);    

    // Calculate the initial, gain and additional investment for each working year
    for (let year = 1; year < years ; year++) {
        // The initial investment for each year is the sum of the previous year's initial investment, gain and additional investment
        dataAccumulation[year] = (Number(dataAccumulation[year-1]) + Number(dataGain[year-1]) + Number(dataAddition[year-1])).toFixed(2);
        // Calculate the gain for each year
        dataGain[year] = (dataAccumulation[year] * (interestRate / 100)).toFixed(2);
        // The additional investment for each year
        dataAddition[year] = (dataAddition[year-1] * (1 + (inflationRate / 100))).toFixed(2);
    }

    // Clear previous chart if it exists
    if (chartId !== 0) {
        var previousChart = document.getElementById('myChart-' + chartId);
        if (previousChart) {
            previousChart.remove();
        }
    }

    // Create a new canvas element with a unique ID
    var canvasContainer = document.getElementById('canvasContainer');
    var canvas = document.createElement('canvas');
    var canvasId = 'myChart-' + ++chartId;
    canvas.setAttribute('id', canvasId);
    canvasContainer.appendChild(canvas);

    // Display the chart
    var ctx = document.getElementById(canvasId).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Accumulated Investment',
                data: dataAccumulation,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
                label: 'Gain',
                data: dataGain,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
                label: 'Additional Investment',
                data: dataAddition,
                backgroundColor: 'rgba(255, 206, 86, 0.5)',
            },
            {
                label: 'Withdrawal',
                data: dataWithdrawal,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true
                },
                x: {
                    beginAtZero: true,
                    stacked: true
                }
            }
        }
    });

    // Generate the table
    var tableContainer = document.getElementById('tableContainer');
    var table = document.createElement('table');
    table.className = 'data-table';
    var tableHeader = document.createElement('thead');
    var headerRow = document.createElement('tr');
    var headerLabels = ['Year', 'Initial Investment', 'Gain', 'Additional Investment', 'Withdrawal'];
    for (var i = 0; i < headerLabels.length; i++) {
        var headerCell = document.createElement('th');
        headerCell.textContent = headerLabels[i];
        headerRow.appendChild(headerCell);
    }
    tableHeader.appendChild(headerRow);

    var tableBody = document.createElement('tbody');
    for (var rowIndex = 0; rowIndex < labels.length; rowIndex++) {
        var row = document.createElement('tr');
        var cells = [
            labels[rowIndex],
            dataAccumulation[rowIndex],
            dataGain[rowIndex],
            dataAddition[rowIndex],
            dataWithdrawal[rowIndex],
        ];
        for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
            var cell = document.createElement('td');
            cell.textContent = cells[cellIndex];
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }

    table.appendChild(tableHeader);
    table.appendChild(tableBody);

    // Clear previous table if it exists
    if (tableContainer.firstChild) {
        tableContainer.firstChild.remove();
    }

    tableContainer.appendChild(table);
});
