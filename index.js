// Função para pegar parâmetros da URL
function getQueryParams() {
  const params = {};
  window.location.search
    .substring(1)
    .split("&")
    .forEach(pair => {
      const [key, value] = pair.split("=");
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || "");
    });
  return params;
}

const params = getQueryParams();

const botaoPlanoGold = document.querySelector('.bottom-button');

botaoPlanoGold.addEventListener('click', async () => {
  // Monta o payload usando parâmetros da URL
  const payload = {
    customer: params.customer || "",           // Exemplo: id do cliente vindo na URL
    nextDueDate: params.nextDueDate || "",     // Data de vencimento na URL
    billingType: params.billingType || "CREDIT_CARD", // Ou qualquer valor fixo/variável
    value: parseFloat(params.value) || 9.90,   // Valor passado na URL ou default
    cycle: params.cycle || "MONTHLY",
    description: params.description || "Assinatura Plano Gold",
    // Adicione outros campos que precisar...
  };

  if (!payload.customer || !payload.nextDueDate) {
    alert("Parâmetros essenciais ausentes na URL!");
    return;
  }

  try {
    const response = await fetch(
      "https://southamerica-east1-kyvus-gold-page.cloudfunctions.net/asaasProxyApi/api/criarAssinaturaMembroAsaas",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    if (data.invoiceUrl) {
      window.location.href = data.invoiceUrl;
    }

  } catch (error) {
    console.error("Erro inesperado:", error);
    alert("Erro inesperado, veja console.");
  }
});
