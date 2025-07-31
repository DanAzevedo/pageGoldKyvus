try {
  const response = await fetch("https://asaas-proxy-api-703360123160.southamerica-east1.run.app/api/iniciarPagamentoMembro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access_token": "eTL6MkRCywEA5wnP8NUMQbu0vxZ1uhUJj7hPbUgEJgTVA38dwcRYt98XTUcE03cCT"
    },
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();

  console.log("📥 Status da resposta:", response.status);
  console.log("📥 Texto bruto da resposta:", responseText);

  if (!response.ok) {
    console.error("❌ Erro retornado pela API:", responseText);
    alert("Erro retornado pela API:\n" + responseText);
    return;
  }

  let result;
  try {
    result = JSON.parse(responseText);
  } catch (e) {
    console.error("⚠️ Erro ao fazer parse do JSON:", e);
    alert("Erro ao interpretar a resposta da API.");
    return;
  }

  if (result?.url) {
    console.log("🔁 Redirecionando para:", result.url);
    window.location.href = result.url;
  } else {
    alert("Erro: resposta da API não contém uma URL.");
    console.log("Resposta completa da API:", result);
  }

} catch (error) {
  console.error("❌ Erro de rede ou sistema:", error);
  alert("Erro ao processar pagamento: " + error.message);
}
