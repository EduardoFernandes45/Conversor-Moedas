const convertButton = document.querySelector(".convert-button");
const currencySelect = document.querySelector(".currency-select");

function convertValues() {
  const inputCurrencyValue = document.querySelector(".input-currency").value;
  const currencyValueToConvert = document.querySelector(".currency-value-to-convert"); //valor em real
  const currencyValueConverted = document.querySelector(".currency-value"); //valor de outras moedas
  
  console.log(currencySelect.value)
  const dolarToday = 5.2;
  const euroToday = 6.2;
  const bitcoinToday = 134000;
  const libraToday = 7.3;

  if (currencySelect.value == "Dolar") {
    currencyValueConverted.innerHTML = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(inputCurrencyValue / dolarToday)
  }
  if (currencySelect.value == "Euro") {
    currencyValueConverted.innerHTML = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(inputCurrencyValue / euroToday)
  }

  if (currencySelect.value == "Libra") {
    currencyValueConverted.innerHTML = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(inputCurrencyValue / libraToday)
  }

  if (currencySelect.value == "Bitcoin") {
    currencyValueConverted.innerHTML = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "BTC",
  }).format(inputCurrencyValue / bitcoinToday)
  }
  
  currencyValueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(inputCurrencyValue)

  
  console.log(convertedValue);
}

function changeCurrency() {
    const currencyName = document.getElementById("currency-name")
    const currencyImg = document.querySelector(".currency-img")

    if (currencySelect.value === "Dolar") {
        currencyName.innerHTML = "Dólar Americano"
        currencyImg.src = "./assets/dolar.png"
    }
    if (currencySelect.value === "Euro") {
        currencyName.innerHTML = "Euro"
        currencyImg.src = "./assets/euro.png"
    }

    if (currencySelect.value === "Libra") {
        currencyName.innerHTML = "Libra Esterlina"
        currencyImg.src = "./assets/libra.png"
    }

    if (currencySelect.value === "Bitcoin") {
        currencyName.innerHTML = "Bitcoin"
        currencyImg.src = "./assets/bitcoin.png"
    }
    convertValues()
}


currencySelect.addEventListener("change", changeCurrency);
convertButton.addEventListener("click", convertValues);
