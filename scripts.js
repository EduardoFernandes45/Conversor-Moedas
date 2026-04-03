// ============================================
// SELEÇÃO DE ELEMENTOS DO DOM (HTML)
// ============================================

// Seleciona o botão "Converter" pela classe CSS ".convert-button"
const convertButton = document.querySelector(".convert-button");

// Seleciona o select "converter para" pela classe ".currency-select"
const currencySelect = document.querySelector(".currency-select");

// Seleciona o select "converter de" pela classe ".currency-select-convert"
const currencySelectConvert = document.querySelector(".currency-select-convert");

// ============================================
// TAXAS DE CONVERSÃO PADRÃO (em relação a 1 Real)
// ============================================

// Objeto com as taxas padrão de cada moeda em relação ao Real Brasileiro
// Usado como fallback se a API não conseguir carregar os dados
const defaultRatesInBRL = {
  Real: 1,              // 1 Real = 1 Real
  Dolar: 5.2,           // 1 Dólar ≈ 5,2 Reais
  Euro: 6.2,            // 1 Euro ≈ 6,2 Reais
  Libra: 7.3,           // 1 Libra ≈ 7,3 Reais
  Bitcoin: 134000,      // 1 Bitcoin ≈ 134.000 Reais
  Iene: 0.038,          // 1 Iene ≈ 0,038 Reais
  Peso: 0.28,           // 1 Peso ≈ 0,28 Reais
  Rupia: 0.068,         // 1 Rupia ≈ 0,068 Reais
  Franco: 5.8,          // 1 Franco ≈ 5,8 Reais
};

// ============================================
// CONFIGURAÇÃO DE FORMATAÇÃO POR MOEDA
// ============================================

// Objeto que define como formatar cada moeda usando a API Intl.NumberFormat
// locale: idioma/país para formatação (pt-BR, en-US, etc)
// currency: código ISO da moeda (BRL, USD, EUR, etc)
const formatByCurrency = {
  Real: { locale: "pt-BR", currency: "BRL" },              // Formato Português Brasil
  Dolar: { locale: "en-US", currency: "USD" },            // Formato Inglês EUA
  Euro: { locale: "de-DE", currency: "EUR" },             // Formato Alemão
  Libra: { locale: "en-GB", currency: "GBP" },            // Formato Inglês GB
  Bitcoin: { locale: "en-US", currency: "BTC" },          // Formato EUA
  Iene: { locale: "ja-JP", currency: "JPY" },             // Formato Japonês
  Peso: { locale: "es-MX", currency: "MXN" },             // Formato Espanhol México
  Rupia: { locale: "en-IN", currency: "INR" },            // Formato Inglês Índia
  Franco: { locale: "fr-CH", currency: "CHF" },           // Formato Francês Suíça
};

// ============================================
// VARIÁVEL DE ESTADO - TAXAS ATUAIS
// ============================================

// Armazena as taxas de conversão atuais (começa com as taxas padrão)
// Será atualizada quando os dados da API forem carregados
let currentRatesInBRL = { ...defaultRatesInBRL };

// ============================================
// FUNÇÃO: Buscar Taxas da API
// ============================================

// Função assíncrona que fetcha as taxas de câmbio em tempo real
// Tenta buscar de uma API gratuita, e se falhar, usa os valores padrão
async function fetchRates() {
  // URL da API que retorna as taxas com base em Real Brasileiro (BRL)
  const apiUrl = "https://api.exchangerate.host/latest?base=BRL&symbols=USD,EUR,GBP,JPY,MXN,INR,CHF";
  
  try {
    // Faz a requisição HTTP para a API
    const response = await fetch(apiUrl);
    
    // Verifica se a resposta foi bem-sucedida (status 200-299)
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // Converte a resposta para JSON
    const data = await response.json();
    
    // Verifica se os dados foram recebidos corretamente
    if (!data || !data.rates) throw new Error("Dados inválidos da API");

    // Cria um novo objeto com as taxas recebidas da API
    // Se alguma taxa não vir da API, usa a taxa padrão
    const rates = {
      Real: 1,                                                              // Real sempre = 1
      Dolar: data.rates.USD ? 1 / data.rates.USD : defaultRatesInBRL.Dolar,     // Inverte a taxa (API retorna BRL/USD)
      Euro: data.rates.EUR ? 1 / data.rates.EUR : defaultRatesInBRL.Euro,       // Inverte a taxa
      Libra: data.rates.GBP ? 1 / data.rates.GBP : defaultRatesInBRL.Libra,     // Inverte a taxa
      Iene: data.rates.JPY ? 1 / data.rates.JPY : defaultRatesInBRL.Iene,       // Inverte a taxa
      Peso: data.rates.MXN ? 1 / data.rates.MXN : defaultRatesInBRL.Peso,       // Inverte a taxa
      Rupia: data.rates.INR ? 1 / data.rates.INR : defaultRatesInBRL.Rupia,     // Inverte a taxa
      Franco: data.rates.CHF ? 1 / data.rates.CHF : defaultRatesInBRL.Franco,   // Inverte a taxa
      Bitcoin: defaultRatesInBRL.Bitcoin,                                       // Bitcoin usa valor padrão
    };

    // Atualiza a variável global com as novas taxas
    currentRatesInBRL = rates;
    
    // Loga no console que as taxas foram atualizadas com sucesso
    console.log("Taxas atualizadas via API", currentRatesInBRL);
    
  } catch (error) {
    // Se algo der errado (sem internet, API indisponível, etc), usa valores padrão
    console.warn("Não foi possível carregar taxas de conversão, usando valores padrão", error);
    currentRatesInBRL = { ...defaultRatesInBRL };
  }
}

// ============================================
// FUNÇÃO: Converter Valores
// ============================================

// Função que realiza a conversão de uma moeda para outra
function convertValues() {
  // Pega o valor digitado no input e converte para número
  const inputValue = Number(document.querySelector(".input-currency").value);
  
  // Se o valor não for um número válido ou for negativo, interrompe a função
  // 0 é um valor válido e exibirá 0 na conversão
  if (isNaN(inputValue) || inputValue < 0) {
    return;
  }

  // Pega a moeda de origem (selecionada no primeiro select)
  const from = currencySelectConvert.value;
  
  // Pega a moeda de destino (selecionada no segundo select)
  const to = currencySelect.value;
  
  // Busca a taxa de conversão da moeda de origem
  const fromRate = currentRatesInBRL[from];
  
  // Busca a taxa de conversão da moeda de destino
  const toRate = currentRatesInBRL[to];

  // Se alguma taxa não existir, interrompe a função
  if (!fromRate || !toRate) {
    return;
  }

  // Converte o valor para Real (moeda neutra)
  // Exemplo: 100 Dólares * 5.2 = 520 Reais
  const valueInBRL = inputValue * fromRate;
  
  // Converte do Real para a moeda de destino
  // Exemplo: 520 Reais / 6.2 (Euro) ≈ 83,87 Euros
  const convertedValue = valueInBRL / toRate;

  // Pega a configuração de formatação da moeda de origem
  const fromFormat = formatByCurrency[from] || formatByCurrency.Real;
  
  // Pega a configuração de formatação da moeda de destino
  const toFormat = formatByCurrency[to] || formatByCurrency.Real;

  // Seleciona o elemento que mostra o valor de origem
  const currencyValueToConvert = document.querySelector(".currency-value-to-convert");
  
  // Seleciona o elemento que mostra o valor convertido
  const currencyValueConverted = document.querySelector(".currency-value");

  // Formata e exibe o valor de origem com a formatação correta da moeda
  currencyValueToConvert.innerHTML = new Intl.NumberFormat(fromFormat.locale, {
    style: "currency",          // Ativa o estilo de moeda
    currency: fromFormat.currency,  // Define qual moeda usar
  }).format(inputValue);

  // Formata e exibe o valor convertido com a formatação correta da moeda
  // Bitcoin recebe 8 casas decimais, outras moedas recebem 2
  currencyValueConverted.innerHTML = new Intl.NumberFormat(toFormat.locale, {
    style: "currency",                                              // Ativa o estilo de moeda
    currency: toFormat.currency,                                    // Define qual moeda usar
    maximumFractionDigits: to === "Bitcoin" ? 8 : 2,              // Bitcoin = 8 casas, outras = 2
  }).format(convertedValue);
}

// ============================================
// FUNÇÃO: Mudar Moeda de Destino
// ============================================

// Função que atualiza a UI quando o usuário muda a moeda de destino
function changeCurrency() {
  // Seleciona o elemento que mostra o nome da moeda
  const currencyName = document.getElementById("currency-name");
  
  // Seleciona a imagem da moeda de destino
  const currencyImg = document.querySelector(".currency-img");

  // Objeto que mapeia cada moeda para seu nome completo e imagem
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

  // Destructuring: pega o nome e a imagem da moeda selecionada
  // Se a moeda não existir, usa valores padrão
  const [nameText, imagePath] = labels[currencySelect.value] || ["Real Brasileiro", "./assets/real.png"];

  // Atualiza o texto com o nome da moeda
  currencyName.innerHTML = nameText;
  
  // Atualiza a imagem com o ícone da moeda
  currencyImg.src = imagePath;
  
  // Recalcula a conversão com a nova moeda selecionada
  convertValues();
}

// ============================================
// FUNÇÃO: Mudar Moeda de Origem
// ============================================

// Função que atualiza a UI quando o usuário muda a moeda de origem
function changeCurrencyFrom() {
  const currencyNameFrom = document.getElementById("currency-name-from");
  const currencyImgFrom = document.getElementById("currency-img-from");

  // Objeto que mapeia cada moeda para seu nome completo e imagem
  const fromLabels = {
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

  // Destructuring: pega o nome e a imagem da moeda selecionada
  // Se a moeda não existir, usa valores padrão
  const [nameText, imagePath] = fromLabels[currencySelectConvert.value] || ["Real Brasileiro", "./assets/real.png"];

  // Atualiza o texto com o nome da moeda
  currencyNameFrom.innerHTML = nameText;

  // Atualiza a imagem com o ícone da moeda
  currencyImgFrom.src = imagePath;

  // Recalcula a conversão com a nova moeda de origem
  convertValues();
}

// ============================================
// LISTENERS (Evento de Carregamento)
// ============================================

// Quando a página termina de carregar, executa essa função
window.addEventListener("load", async () => {
  // Busca as taxas atuais da API
  await fetchRates();

  // Atualiza a conversão inicial com seleções de moeda padrão
  changeCurrencyFrom();
  changeCurrency();

  // Atualiza as taxas automaticamente a cada 60.000 milissegundos (1 minuto)
  setInterval(fetchRates, 60_000);
});

// ============================================
// LISTENERS (Eventos de Interação)
// ============================================

// Quando o usuário muda o select "converter de", atualiza a moeda de origem e recalcula
currencySelectConvert.addEventListener("change", changeCurrencyFrom);

// Quando o usuário muda o select "converter para", atualiza a moeda e recalcula
currencySelect.addEventListener("change", changeCurrency);

// Quando o usuário clica no botão "Converter", executa a conversão
convertButton.addEventListener("click", convertValues);
