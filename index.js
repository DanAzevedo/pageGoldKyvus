// Pega parâmetros da URL
const urlParams = new URLSearchParams(window.location.search);
const customer = urlParams.get('customer');
const nextDueDate = urlParams.get('nextDueDate');

// Verifica se os parâmetros obrigatórios estão presentes
if (!customer || !nextDueDate) {
  alert("Erro: customer ou nextDueDate não encontrados na URL.");
  throw new Error("Parâmetros obrigatórios ausentes.");
}

// Pegue seu botão no HTML
const botaoPlanoGold = document.querySelector('.bottom-button');

botaoPlanoGold.addEventListener('click', async () => {
  const payload = {
    customer: customer,
    billingType: "CREDIT_CARD",
    nextDueDate: nextDueDate,
    value: 9.90,
    cycle: "MONTHLY",
    description: "Assinatura Plano Gold",
  };

  try {
    const resposta = await fetch(
      "https://us-central1-kyvus-gold-page.cloudfunctions.net/asaasProxyApi/api/criarAssinaturaMembroAsaas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!resposta.ok) {
      const err = await resposta.json();
      console.error("Erro no backend:", err);
      alert("Erro ao criar assinatura. Veja console.");
      return;
    }

    const dados = await resposta.json();
    console.log("Sucesso:", dados);
    alert("Assinatura criada com sucesso!");

    if (dados.invoiceUrl) {
      window.location.href = dados.invoiceUrl; // redireciona para pagamento
    }

  } catch (err) {
    console.error("Erro inesperado:", err);
    alert("Erro inesperado. Veja console.");
  }
});
