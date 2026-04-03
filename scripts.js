const convertButton = document.querySelector(".convert-button");
const currencySelect = document.querySelector(".currency-select");
const currencySelectConvert = document.querySelector(".currency-select-convert");

const defaultRatesInBRL = {
  Real: 1,
  Dolar: 5.2,
  Euro: 6.2,
  Libra: 7.3,
  Bitcoin: 134000,
  Iene: 0.038,
  Peso: 0.28,
  Rupia: 0.068,
  Franco: 5.8,
};

const formatByCurrency = {
  Real: { locale: "pt-BR", currency: "BRL" },
  Dolar: { locale: "en-US", currency: "USD" },
  Euro: { locale: "de-DE", currency: "EUR" },
  Libra: { locale: "en-GB", currency: "GBP" },
  Bitcoin: { locale: "en-US", currency: "BTC" },
  Iene: { locale: "ja-JP", currency: "JPY" },
  Peso: { locale: "es-MX", currency: "MXN" },
  Rupia: { locale: "en-IN", currency: "INR" },
  Franco: { locale: "fr-CH", currency: "CHF" },
};

let currentRatesInBRL = { ...defaultRatesInBRL };

async function fetchRates() {
  const apiUrl = "https://api.exchangerate.host/latest?base=BRL&symbols=USD,EUR,GBP,JPY,MXN,INR,CHF";
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!data || !data.rates) throw new Error("Dados inválidos da API");

    const rates = {
      Real: 1,
      Dolar: data.rates.USD ? 1 / data.rates.USD : defaultRatesInBRL.Dolar,
      Euro: data.rates.EUR ? 1 / data.rates.EUR : defaultRatesInBRL.Euro,
      Libra: data.rates.GBP ? 1 / data.rates.GBP : defaultRatesInBRL.Libra,
      Iene: data.rates.JPY ? 1 / data.rates.JPY : defaultRatesInBRL.Iene,
      Peso: data.rates.MXN ? 1 / data.rates.MXN : defaultRatesInBRL.Peso,
      Rupia: data.rates.INR ? 1 / data.rates.INR : defaultRatesInBRL.Rupia,
      Franco: data.rates.CHF ? 1 / data.rates.CHF : defaultRatesInBRL.Franco,
      Bitcoin: defaultRatesInBRL.Bitcoin,
    };

    currentRatesInBRL = rates;
    console.log("Taxas atualizadas via API", currentRatesInBRL);
  } catch (error) {
    console.warn("Não foi possível carregar taxas de conversão, usando valores padrão", error);
    currentRatesInBRL = { ...defaultRatesInBRL };
  }
}

function convertValues() {
  const inputValue = Number(document.querySelector(".input-currency").value);
  if (isNaN(inputValue) || inputValue <= 0) {
    return;
  }

  const from = currencySelectConvert.value;
  const to = currencySelect.value;
  const fromRate = currentRatesInBRL[from];
  const toRate = currentRatesInBRL[to];

  if (!fromRate || !toRate) {
    return;
  }

  const valueInBRL = inputValue * fromRate;
  const convertedValue = valueInBRL / toRate;

  const fromFormat = formatByCurrency[from] || formatByCurrency.Real;
  const toFormat = formatByCurrency[to] || formatByCurrency.Real;

  const currencyValueToConvert = document.querySelector(".currency-value-to-convert");
  const currencyValueConverted = document.querySelector(".currency-value");

  currencyValueToConvert.innerHTML = new Intl.NumberFormat(fromFormat.locale, {
    style: "currency",
    currency: fromFormat.currency,
  }).format(inputValue);

  currencyValueConverted.innerHTML = new Intl.NumberFormat(toFormat.locale, {
    style: "currency",
    currency: toFormat.currency,
    maximumFractionDigits: to === "Bitcoin" ? 8 : 2,
  }).format(convertedValue);
}

function changeCurrency() {
  const currencyName = document.getElementById("currency-name");
  const currencyImg = document.querySelector(".currency-img");

  const labels = {
    Real: ["Real Brasileiro", "./assets/real.png"],
    Dolar: ["Dólar Americano", "./assets/dolar.png"],
    Euro: ["Euro", "./assets/euro.png"],
    Libra: ["Libra Esterlina", "./assets/libra.png"],
    Bitcoin: ["Bitcoin", "./assets/bitcoin.png"],
    Iene: ["Iene Japonês", "./assets/iene.png"],
    Peso: ["Peso Mexicano", "./assets/peso.png"],
    Rupia: ["Rupia Indiana", "./assets/rupia.png"],
    Franco: ["Franco Suíço", "./assets/franco.png"],
  };

  const [nameText, imagePath] = labels[currencySelect.value] || ["Real Brasileiro", "./assets/real.png"];

  currencyName.innerHTML = nameText;
  currencyImg.src = imagePath;
  convertValues();
}

window.addEventListener("load", () => {
  fetchRates();
  setInterval(fetchRates, 60_000); // atualiza taxas a cada 60 segundos
});

currencySelectConvert.addEventListener("change", convertValues);
currencySelect.addEventListener("change", changeCurrency);
convertButton.addEventListener("click", convertValues);
