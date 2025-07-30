document.addEventListener('DOMContentLoaded', () => {
  const pagarBtn = document.getElementById('pagarBtn');
  const statusEl = document.getElementById('status');

  // Captura parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  const idAsaas = urlParams.get('idAssas');
  const idCarro = urlParams.get('idCarro');

  if (!idAsaas || !idCarro) {
    statusEl.innerText = 'Parâmetros ausentes na URL.';
    pagarBtn.disabled = true;
    return;
  }

  pagarBtn.addEventListener('click', async () => {
    statusEl.innerText = 'Processando pagamento...';
    pagarBtn.disabled = true;

    try {
      const res = await fetch('https://asaas-proxy-api-703360123160.southamerica-east1.run.app/api/iniciarPagamentoMembro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer <se necessário>'
        },
        body: JSON.stringify({
          idAsaas: idAsaas,
          idCarro: idCarro
        })
      });

      if (!res.ok) {
        throw new Error(`Erro HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data?.invoiceUrl) {
        window.location.href = data.invoiceUrl;
      } else {
        statusEl.innerText = 'Pagamento iniciado, mas URL de cobrança não retornada.';
      }

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      statusEl.innerText = 'Erro ao processar pagamento. Veja o console para detalhes.';
      pagarBtn.disabled = false;
    }
  });
});
