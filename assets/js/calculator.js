function calculate(){
	const amount = input.get('home_loan_mount').gt(0).val();
	const interest = input.get('interest_rate').gt(0).val();
	const loanTermYears = input.get('loan_term_year').optional().val();
	const loanTermMonths = input.get('loan_term_month').optional().val();
	if(!input.valid()) return;
	const loanTerm = loanTermYears * 12 + loanTermMonths;
	if(loanTerm < 1) {
		return input.error('loan_term_year', 'Please enter a loan term', true);
	}
	const amortization = calculateAmortization(amount, loanTerm, interest);
	const payment = calculatePayment(amount, loanTerm, interest);
	showResult(amortization, payment);
}

function calculatePersonal(){
	const amount = input.get('personal_loan_mount').gt(0).val();
	const interest = input.get('interest_rate').gt(0).val();
	const loanTermYears = input.get('loan_term_year').optional().val();
	const loanTermMonths = input.get('loan_term_month').optional().val();
	if(!input.valid()) return;
	const loanTerm = loanTermYears * 12 + loanTermMonths;
	if(loanTerm < 1) {
		return input.error('loan_term_year', 'Please enter a loan term', true);
	}
	const amortization = calculateAmortization(amount, loanTerm, interest);
	const payment = calculatePayment(amount, loanTerm, interest);
	showResult(amortization, payment);
}

function calculateCar(){
	const amount = input.get('car_loan_mount').gt(0).val();
	const interest = input.get('interest_rate').gt(0).val();
	const loanTermYears = input.get('loan_term_year').optional().val();
	const loanTermMonths = input.get('loan_term_month').optional().val();
	const emiScheme = input.get('emi_scheme').raw();
	if(!input.valid()) return;
	const loanTerm = loanTermYears * 12 + loanTermMonths;
	if(loanTerm < 1) {
		return input.error('loan_term_year', 'Please enter a loan term', true);
	}
	let amortization = [];
	let payment = calculatePayment(amount, loanTerm, interest);
	let monthlyPayment = 0;
	if(emiScheme === 'arrears'){
		amortization = calculateAmortization(amount, loanTerm, interest);
	}
	else {
		monthlyPayment = payment - interest / 12 / 100 * payment;
		const firstMonth = {
			principle: amount - monthlyPayment,
			beginBalance: amount,
			interest: 0,
			payment: monthlyPayment,
			paymentToPrinciple: monthlyPayment,
			paymentToInterest: 0,
			date: new Date()
		}
		amortization = calculateAmortization(amount - monthlyPayment, loanTerm - 1, interest);
		amortization.unshift(firstMonth);
		payment = monthlyPayment;
	}

	showResult(amortization, payment);
}

function calculateAmortization(finAmount, finMonths, finInterest, finDate){
	var payment = calculatePayment(finAmount, finMonths, finInterest),
		balance = finAmount,
		interest = 0.0,
		totalInterest = 0.0,
		schedule = [],
		currInterest = null,
		currPrinciple = null,
		currDate = (finDate !== undefined && finDate.constructor === Date)? new Date(finDate) : (new Date());

	for(var i=0; i<finMonths; i++){
		currInterest = balance * finInterest/1200;
		totalInterest += currInterest;
		currPrinciple = payment - currInterest;
		balance -= currPrinciple;

		schedule.push({
			principle: balance < 0 ? 0 : balance,
			beginBalance: balance + currPrinciple,
			interest: totalInterest,
			payment: payment,
			paymentToPrinciple: currPrinciple,
			paymentToInterest: currInterest,
			date: new Date(currDate.getTime())
		});

		currDate.setMonth(currDate.getMonth()+1);
	}

	return schedule;
}

function calculatePayment(finAmount, finMonths, finInterest){
	var result = 0;

	if(finInterest == 0){
		result = finAmount / finMonths;
	}
	else{
		var i = ((finInterest/100) / 12),
			i_to_m = Math.pow((i + 1), finMonths),
			p = finAmount * ((i * i_to_m) / (i_to_m - 1));
		result = Math.round(p * 100) / 100;
	}

	return result;
}


function showResult(amortization, payment){
	let annualResults = [];
	let annualInterest = 0;
	let annualPrincipal = 0;
	let beginBalance = 0;
	let monthlyResultsHtml = '';
	let years = Math.ceil(amortization.length / 12);
	amortization.forEach((item, index) => {
		monthlyResultsHtml += `<tr>
			<td class="text-center">${index + 1}</td>
			<td>${currencyFormat(item.beginBalance)}</td>
			<td>${currencyFormat(item.paymentToInterest)}</td>
			<td>${currencyFormat(item.paymentToPrinciple)}</td>
			<td>${currencyFormat(item.principle)}</td>
		</tr>`;
		if((index + 1) % 12 === 0 || (index + 1) === amortization.length) {
			let title = 'Year #{1} End'.replace('{1}', Math.ceil((index + 1) / 12).toString());
			monthlyResultsHtml += `<th class="indigo text-center" colspan="5">${title}</th>`;
		}
		annualInterest += item.paymentToInterest;
		annualPrincipal += item.paymentToPrinciple;
		if(index === 0 || (index % 12) === 0){
			beginBalance = item.beginBalance;
		}
		if((index + 1) % 12 === 0 || (index + 1) === amortization.length){
			annualResults.push({
				"date": item.date,
				"beginBalance": beginBalance,
				"interest": item.interest,
				"paymentToInterest": annualInterest,
				"paymentToPrinciple": annualPrincipal,
				"principle": item.principle,
			});
			annualInterest = 0;
			annualPrincipal = 0;
		}
	});

	let chartLegendHtml = '';
	for(let i = 0; i <= years / 5; i++){
		chartLegendHtml += `<p class="result-text result-text--small">${i * 5} yr</p>`;
	}
	if(years % 5 !== 0){
		chartLegendHtml += `<p class="result-text result-text--small">${years} yr</p>`;
	}
	const totalInterest = annualResults.reduce((total, item) => total + item.paymentToInterest, 0);
	const totalPrincipal = annualResults.reduce((total, item) => total + item.paymentToPrinciple, 0);
	const totalPayment = totalInterest + totalPrincipal;
	const interestPercent = +(totalInterest / totalPayment * 100).toFixed(0);
	const principalPercent = +(totalPrincipal / totalPayment * 100).toFixed(0);
	const donutData = [interestPercent, principalPercent];

	let annualResultsHtml = '';
	const chartData = [[], [], [], []];
	let prevInterest = 0;
	let prevPrincipal = 0;
	annualResults.forEach((r, index) => {
		annualResultsHtml += `<tr>
			<td class="text-center">${index + 1}</td>
			<td>${currencyFormat(r.beginBalance)}</td>
			<td>${currencyFormat(r.paymentToInterest)}</td>
			<td>${currencyFormat(r.paymentToPrinciple)}</td>
			<td>${currencyFormat(r.principle)}</td>
	</tr>`;
		prevInterest = r.paymentToInterest + prevInterest;
		prevPrincipal = r.paymentToPrinciple + prevPrincipal;
		chartData[0].push((index + 1));
		chartData[1].push(+r.principle.toFixed(2));
		chartData[2].push(+prevInterest.toFixed(2));
		chartData[3].push(+prevPrincipal.toFixed(2));
	});
	_('chart__legend').innerHTML = chartLegendHtml;
	changeChartData(donutData, chartData);
	output.val(annualResultsHtml).set('annual-results');
	output.val(monthlyResultsHtml).set('monthly-results');
	output.val(currencyFormat(totalInterest + totalPrincipal)).set('total-payment');
	output.val(currencyFormat(totalInterest)).set('total-interest');
	output.val(currencyFormat(payment)).set('emi-payment');
}

function currencyFormat(price){
	return '$' + price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
