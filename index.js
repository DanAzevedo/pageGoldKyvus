const urlParams = new URLSearchParams(window.location.search);
const asaasId = urlParams.get("asaasId");
const carId = urlParams.get("carId");
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

        // Busca o usuário pelo campo asaas_id dentro da coleção tb_users
        const userQuery = await db.collection('tb_users')
            .where('asaas_id', '==', asaasId)
            .limit(1)
            .get();

        if (userQuery.empty) {
            alert('Usuário não encontrado.');
            botao.disabled = false;
            botao.textContent = 'Adquira o Plano Gold';
            return;
        }

        const userData = userQuery.docs[0].data();
        const email = userData.email;

        if (!email) {
            alert('E-mail do usuário não está cadastrado.');
            botao.disabled = false;
            botao.textContent = 'Adquira o Plano Gold';
            return;
        }

        const hoje = new Date().toISOString().split('T')[0];

        const res = await fetch('https://pagegoldkyvus.onrender.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                valor: 9.90,
                vencimento: hoje,
                carroId: carId
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
