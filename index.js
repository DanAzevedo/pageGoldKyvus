// Captura os parâmetros da URL
const urlParams = new URLSearchParams(window.location.search);
const asaasId = urlParams.get('asaasId'); // ex: cus_000xxx
const carId = urlParams.get('carId');     // ex: ODvqxxx

const mensagemDiv = document.getElementById('mensagem');

// Verifica se os parâmetros existem
if (!asaasId || !carId) {
  mensagemDiv.textContent = 'Parâmetros ausentes na URL.';
  throw new Error('Parâmetros obrigatórios não fornecidos.');
}

// Gera data de vencimento (amanhã)
const today = new Date();
const nextDueDate = new Date(today.setDate(today.getDate() + 1))
  .toISOString()
  .split('T')[0]; // Formato YYYY-MM-DD

// Monta o corpo da requisição
const body = {
  billingType: "CREDIT_CARD",
  cycle: "MONTHLY",
  customer: asaasId,
  value: 9.90,
  nextDueDate: nextDueDate,
  description: "Assinatura mensal membro"
};

// Faz a requisição para o proxy
fetch("https://asaas-proxy-api-703360123160.southamerica-east1.run.app/api/criarAssinaturaMembroAsaas", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
})
.then(response => {
  if (!response.ok) {
    return response.text().then(text => {
      throw new Error(`Erro do servidor: ${text}`);
    });
  }
  return response.json();
})
.then(data => {
  console.log("Resposta da API:", data);
  mensagemDiv.innerHTML = `Assinatura criada com sucesso!<br><br>
    <a href="${data?.invoiceUrl || '#'}" target="_blank">Abrir link de pagamento</a>`;
})
.catch(error => {
  console.error("Erro ao processar pagamento:", error);
  mensagemDiv.textContent = "Erro ao processar pagamento: " + error.message;
});
