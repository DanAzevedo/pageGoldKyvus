// Pegue seu botão no HTML
const botaoPlanoGold = document.querySelector('.bottom-button');

botaoPlanoGold.addEventListener('click', async () => {
  // Monte o payload que a API da Asaas espera
  const payload = {
    customer: "cus_000123842344",        // Pode vir da URL, localStorage, etc
    billingType: "CREDIT_CARD",
    nextDueDate: "2025-08-29",
    value: 9.90,
    cycle: "MONTHLY",
    description: "Assinatura Plano Gold",
    // outros campos se precisar
  };

  try {
    const resposta = await fetch(
      "https://southamerica-east1-kyvus-gold-page.cloudfunctions.net/asaasProxyApi/api/criarAssinaturaMembroAsaas",
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
