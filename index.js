document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idAsaas = params.get("idAsaas");
  const idCarro = params.get("idCarro");

  console.log("🔍 Parâmetros da URL:");
  console.log("idAsaas:", idAsaas);
  console.log("idCarro:", idCarro);

  const btnPagar = document.getElementById("btn-pagamento");

  if (!btnPagar) {
    console.error("❌ Botão para pagamento não encontrado!");
    return;
  }

  btnPagar.addEventListener("click", async () => {
    if (!idAsaas || !idCarro) {
      alert("Erro: parâmetros 'idAsaas' ou 'idCarro' ausentes na URL.");
      console.error("❌ Parâmetros ausentes:", { idAsaas, idCarro });
      return;
    }

    const payload = {
      idAsaas: idAsaas,
      idCarro: idCarro
    };

    console.log("📦 Enviando para API:", payload);

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

      console.log("📥 Resposta da API:");
      console.log("Status:", response.status);
      console.log("Texto da resposta:", responseText);

      if (!response.ok) {
        console.error("❌ Erro retornado pela API:", responseText);
        throw new Error(`Erro HTTP ${response.status}: ${responseText}`);
      }

      let result = {};
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.warn("⚠️ Resposta não era JSON válido.");
      }

      if (result?.url) {
        console.log("🔁 Redirecionando para:", result.url);
        window.location.href = result.url;
      } else {
        alert("Erro: resposta da API não contém uma URL.");
        console.log("Resposta da API:", result);
      }

    } catch (error) {
      console.error("❌ Erro ao processar pagamento:", error);
      alert("Erro ao processar pagamento: " + error.message);
    }
  });
});
