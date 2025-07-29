// Captura o botão no seu HTML
const botaoPlanoGold = document.querySelector('.bottom-button');

botaoPlanoGold.addEventListener('click', async () => {
  // Dados que você quer enviar para criar a assinatura
  const payload = {
    customer: "cus_123456",  // Exemplo: id do cliente na Asaas
    billingType: "CREDIT_CARD",
    nextDueDate: "2025-08-30",
    value: 9.90,
    cycle: "MONTHLY",
    description: "Assinatura Plano Gold",
    // adicione outros campos conforme a API da Asaas exigir
  };

  try {
    const response = await fetch(
      "https://southamerica-east1-kyvus-gold-page.cloudfunctions.net/asaasProxyApi/api/criarAssinaturaMembroAsaas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao criar assinatura:", errorData);
      alert("Erro ao criar assinatura, veja console.");
      return;
    }

    const data = await response.json();
    console.log("Assinatura criada com sucesso:", data);
    alert("Assinatura criada com sucesso!");

    // Aqui você pode redirecionar o usuário para o link de pagamento, se existir:
    if (data.invoiceUrl) {
      window.location.href = data.invoiceUrl;
    }

  } catch (error) {
    console.error("Erro inesperado:", error);
    alert("Erro inesperado, veja console.");
  }
});
