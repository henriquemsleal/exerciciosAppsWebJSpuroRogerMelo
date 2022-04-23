// obter as referencias dos selects
const currencyOneEl = document.querySelector('[data-js="currency-one"]');
const currencyTwoEl = document.querySelector('[data-js="currency-two"]');
const currenciesEl = document.querySelector('[data-js="currencies-container"]');
const convertedValueEl = document.querySelector('[data-js="converted-value"]');
const valuePrecisionEl = document.querySelector('[data-js="conversion-precision"]');
const timesCurrencyOneEl = document.querySelector('[data-js="currency-one-times"]');
let internalExchangeRate = {};
//
const getUrl = currency => `https://v6.exchangerate-api.com/v6/4334271bc99c509bbf822836/latest/${currency}`;

/* encadear nesse objeto a propriedade que o errorType recebeu.
vai retornar o resultado de obj[errorType] */
const getErrormessage = errorType =>
  ({
    'unsupported-code': 'A moeda não existe em nosso banco de dados.',
    'malformed-request':
      'O seu request precisa seguir a seguinte estrutura:\nhttps://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD.',
    'invalid-key': 'A chave da API não é válida.',
    'inactive-account': 'Conta inativa para a API.',
    'quota-reached': 'O limite de requests, para a conta, foi alcançado.',
  })[errorType] || 'Não foi possível obter as informações.';
// se for undefined, resultará na expressão à direita do OR

// dentro de try para tratar possíveis erros
const fetchExchangeRate = async url => {
  try {
    // await faz com que nenhum código abaixo dele seja executado, enquanto espera a requisição
    const response = await fetch(url); // vai rejeitar a promise quando um erro de conexão acontecer

    if (!response.ok) {
      throw new Error('Sua conexão falhou. Não foi possível obter as informações.');
    }

    const exchangeRateData = await response.json(); // checar se objeto gerado é um objeto de erro

    if (exchangeRateData.result === 'error') {
      throw new Error(getErrormessage(exchangeRateData['error-type']));
    }

    return exchangeRateData;
  } catch (err) {
    // erro lançado sem catch vai travar o código

    // alert(err.message); retirado o alert, para exibir o erro na página com HTML.

    const div = document.createElement('div');
    const button = document.createElement('button');

    div.textContent = err.message;
    div.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show');
    div.setAttribute('role', 'alert');

    button.classList.add('btn-close');
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', 'Close');

    button.addEventListener('click', () => {
      div.remove();
    });

    div.appendChild(button); // para inserir o button na div
    currenciesEl.insertAdjacentElement('afterend', div);
  }
};

/* 
const init = async () => {
  const exchangeRateData = await fetchExchangeRate(getUrl('USD'));

  internalExchangeRate = { ...exchangeRateData};

  const getOptions = selectedCurrency => Object.keys(exchangeRateData.conversion_rates)
      .map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}>${currency}</option>`)
      .join('');

  currencyOneEl.innerHTML = getOptions('USD');
  currencyTwoEl.innerHTML = getOptions('BRL');

  convertedValueEl.textContent = exchangeRateData.conversion_rates.BRL.toFixed(2);
  valuePrecisionEl.textContent = `1 USD = ${exchangeRateData.conversion_rates.BRL} BRL`;
};
*/
const init = async () => {
  internalExchangeRate = { ...(await fetchExchangeRate(getUrl('USD'))) };

  const getOptions = selectedCurrency => Object.keys(internalExchangeRate.conversion_rates)
      .map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}>${currency}</option>`)
      .join('');

  currencyOneEl.innerHTML = getOptions('USD');
  currencyTwoEl.innerHTML = getOptions('BRL');

  convertedValueEl.textContent = internalExchangeRate.conversion_rates.BRL.toFixed(2);
  valuePrecisionEl.textContent = `1 USD = ${internalExchangeRate.conversion_rates.BRL} BRL`;
};

timesCurrencyOneEl.addEventListener('input', e => {
  convertedValueEl.textContent = (
    e.target.value * internalExchangeRate.conversion_rates[currencyTwoEl.value]
  ).toFixed(2);
});

currencyTwoEl.addEventListener('input', e => {
  //console.log(internalExchangeRate.conversion_rates[e.target.value]) // testa o funcionamento
  const currencyTwoValue = internalExchangeRate.conversion_rates[e.target.value];

  convertedValueEl.textContent = (timesCurrencyOneEl.value * currencyTwoValue).toFixed(2);
  /* valuePrecisionEl.textContent = `1 USD = ${1 * internalExchangeRate.conversion_rates[currencyTwoEl.alue]} ${currencyTwoEl.value}`; */
  valuePrecisionEl.textContent = `1 ${currencyOneEl.value} = ${1 * internalExchangeRate.conversion_rates[currencyTwoEl.value]} ${currencyTwoEl.value}`;
});

/* currencyOneEl.addEventListener('input', () => {
	console.log('Olá')
}); */

/* currencyOneEl.addEventListener('input', async e => {
	//   console.log(await fetchExchangeRate(getUrl(e.target.value)))});
	const exchangeRateData = await fetchExchangeRate(getUrl(e.target.value))
	
	internalExchangeRate = { ...exchangeRateData };
}); */
  
currencyOneEl.addEventListener('input', async e => {
	internalExchangeRate = { ...(await fetchExchangeRate(getUrl(e.target.value))) };

	convertedValueEl.textContent = (timesCurrencyOneEl.value * internalExchangeRate.conversion_rates[currencyTwoEl.value]).toFixed(2);
	valuePrecisionEl.textContent = `1 ${currencyOneEl.value} = ${1 * internalExchangeRate.conversion_rates[currencyTwoEl.value]} ${currencyTwoEl.value}`
});

init();

/* console.log(currencyOneEl, currencyTwoEl); */ // exibir no console as referencias dos selects
