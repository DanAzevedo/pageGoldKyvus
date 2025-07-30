document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idAsaas = params.get("idAssas");
  const idCarro = params.get("idCarro");

  const btnPagar = document.getElementById("btn-pagamento");

  btnPagar.addEventListener("click", async () => {
    try {
      const response = await fetch("https://www.asaas.com/api/v3/subscriptions/" + idAsaas + "/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer eTL6MkRCywEA5wnP8NUMQbu0vxZ1uhUJj7hPbUgEJgTVA38dwcRYt98XTUcE03cCT" // ⚠️ NÃO USAR EM PRODUÇÃO
        },
        body: JSON.stringify({
          billingType: "CREDIT_CARD",
          cycle: "MONTHLY",
          value: 9.90,
          nextDueDate: new Date().toISOString().split("T")[0],
          description: "Assinatura mensal membro"
        })
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const result = await response.json();

      // Redireciona para o link de pagamento (se existir)
      if (result?.invoiceUrl || result?.bankSlipUrl || result?.checkoutUrl) {
        window.location.href = result.invoiceUrl || result.bankSlipUrl || result.checkoutUrl;
      } else {
        alert("Pagamento criado, mas sem URL para redirecionamento.");
        console.log("Resposta da API:", result);
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Erro ao processar pagamento: " + error.message);
    }
  });
});
