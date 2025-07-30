document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idAsaas = params.get("idAsaas");  // Corrigido para 'idAsaas' conforme URL
  const idCarro = params.get("idCarro");

  const btnPagar = document.getElementById("btn-pagamento");

  if (!btnPagar) {
    console.error("Botão para pagamento não encontrado!");
    return;
  }

  btnPagar.addEventListener("click", async () => {
    if (!idAsaas || !idCarro) {
      alert("Erro: parâmetros 'idAsaas' ou 'idCarro' ausentes na URL.");
      console.error("Parâmetros URL ausentes:", { idAsaas, idCarro });
      return;
    }

    try {
      const response = await fetch("https://asaas-proxy-api-703360123160.southamerica-east1.run.app/api/iniciarPagamentoMembro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idAsaas: idAsaas,
          idCarro: idCarro,
          access_token: "eTL6MkRCywEA5wnP8NUMQbu0vxZ1uhUJj7hPbUgEJgTVA38dwcRYt98XTUcE03cCT"  // Só se sua API exigir
        })
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result?.url) {
        window.location.href = result.url;
      } else {
        alert("Erro: resposta sem URL");
        console.log("Resposta:", result);
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Erro ao processar pagamento: " + error.message);
    }
  });
});
