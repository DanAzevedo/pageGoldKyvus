// Função para criar assinatura Asaas direto no navegador
async function criarAssinaturaMembroAsaas(payload) {
  try {
    const response = await fetch("https://www.asaas.com/api/v3/subscriptions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer SEU_TOKEN_AQUI", // substitua pelo seu token real
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao criar assinatura:", errorData);
      return { success: false, error: errorData };
    }

    const data = await response.json();
    console.log("Assinatura criada com sucesso", data);
    return { success: true, data };

  } catch (error) {
    console.error("Erro inesperado:", error);
    return { success: false, error };
  }
}

// Exemplo de uso:
const payload = {
  // coloque aqui os dados da assinatura que a API Asaas espera
};

criarAssinaturaMembroAsaas(payload).then(result => {
  if (result.success) {
    alert("Assinatura criada! Veja no console.");
  } else {
    alert("Erro ao criar assinatura. Veja console.");
  }
});
