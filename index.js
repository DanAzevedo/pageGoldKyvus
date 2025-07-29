async function criarAssinaturaViaBackend(payload) {
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
      console.error("Erro do backend:", errorData);
      return { success: false, error: errorData };
    }

    const data = await response.json();
    console.log("Resposta do backend:", data);
    return { success: true, data };

  } catch (error) {
    console.error("Erro inesperado:", error);
    return { success: false, error };
  }
}

// Exemplo de uso:
const payload = {
  // Preencha com os dados da assinatura conforme a API Asaas espera
};

criarAssinaturaViaBackend(payload).then(result => {
  if (result.success) {
    alert("Assinatura criada com sucesso!");
  } else {
    alert("Erro ao criar assinatura. Veja console.");
  }
});
