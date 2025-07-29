const urlParams = new URLSearchParams(window.location.search);
const asaasId = urlParams.get("asaasId"); // id do usuário Asaas
const carId = urlParams.get("carId");     // id do carro
const botao = document.querySelector('.bottom-button');

botao.addEventListener('click', async () => {
    if (!asaasId || !carId) {
        alert('Parâmetros ausentes. Acesse o link corretamente.');
        return;
    }

    botao.disabled = true;
    botao.textContent = 'Processando...';

    try {
        const db = firebase.firestore();

        // Busca o usuário na coleção tb_users pelo campo IDAssas
        const querySnapshot = await db.collection('tb_users')
            .where('IDAssas', '==', asaasId)
            .limit(1)
            .get();

        console.log("Buscando IDAssas com:", asaasId);

        const docs = await db.collection('tb_users').get();
        docs.forEach(d => {
          const data = d.data();
          console.log("DOC:", d.id, "IDAssas:", data.IDAssas);
        });


        if (querySnapshot.empty) {
            alert('Usuário não encontrado.');
            botao.disabled = false;
            botao.textContent = 'Adquira o Plano Gold';
            return;
        }

        const doc = querySnapshot.docs[0];
        const userData = doc.data();
        const email = userData.email;

        if (!email) {
            alert('E-mail do usuário não está cadastrado.');
            botao.disabled = false;
            botao.textContent = 'Adquira o Plano Gold';
            return;
        }

        const hoje = new Date().toISOString().split('T')[0];

        // Chama seu backend enviando email, valor, vencimento, asaasId e carId
        const res = await fetch('https://asaas-proxy-api-703360123160.southamerica-east1.run.app/api/criarAssinaturaMembroAsaas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                valor: 9.90,
                vencimento: hoje,
                asaasId: asaasId,
                carId: carId
            })
        });

        const result = await res.json();

        if (result.checkoutUrl) {
            window.location.href = result.checkoutUrl;
        } else {
            throw new Error(result.error || 'Erro inesperado ao gerar pagamento.');
        }

    } catch (err) {
        console.error(err);
        alert('Erro ao processar pagamento: ' + err.message);
        botao.disabled = false;
        botao.textContent = 'Adquira o Plano Gold';
    }
});
