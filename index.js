// Seleciona o botão com a classe CSS
const botaoPlanoGold = document.querySelector('.bottom-button');

botaoPlanoGold.addEventListener('click', async () => {
  // Captura parâmetros da URL (ex: ?customer=cus_123&nextDueDate=2025-08-29)
  const urlParams = new URLSearchParams(window.location.search);
  const customer = urlParams.get("customer");
  const nextDueDate = urlParams.get("nextDueDate");

  if (!customer || !nextDueDate) {
    alert("Erro: customer ou nextDueDate não encontrados na URL.");
    console.error("Parâmetros ausentes: ", { customer, nextDueDate });
    return;
  }

  // Monta o payload para a API Asaas
  const payload = {
    customer,
    billingType: "CREDIT_CARD",
    nextDueDate,
    value: 9.90,
    cycle: "MONTHLY",
    description: "Assinatura Plano Gold"
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
      alert("Erro ao criar assinatura. Veja o console.");
      return;
    }

    const dados = await resposta.json();
    console.log("Sucesso:", dados);
    alert("Assinatura criada com sucesso!");

    // Redireciona para o link da cobrança
    if (dados.invoiceUrl) {
      window.location.href = dados.invoiceUrl;
    } else {
      alert("Assinatura criada, mas sem link de pagamento retornado.");
    }

  } catch (err) {
    console.error("Erro inesperado:", err);
    alert("Erro inesperado ao tentar criar a assinatura.");
  }
});
