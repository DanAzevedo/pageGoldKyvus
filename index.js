const urlParams = new URLSearchParams(window.location.search);
const asaasId = urlParams.get("asaasId");
const carId = urlParams.get("carId");
const botao = document.querySelector('.bottom-button');

botao.addEventListener('click', async () => {
    if (!userId) {
        alert('ID de usuário não encontrado. Acesse o link corretamente.');
        return;
    }

    botao.disabled = true;
    botao.textContent = 'Processando...';

    try {
        const db = firebase.firestore();
        const doc = await db.collection('users').doc(userId).get();

        if (!doc.exists) {
            alert('Usuário não encontrado.');
            botao.disabled = false;
            botao.textContent = 'Adquira o Plano Gold';
            return;
        }

        const userData = doc.data();
        const email = userData.email;

        if (!email) {
            alert('E-mail do usuário não está cadastrado.');
            botao.disabled = false;
            botao.textContent = 'Adquira o Plano Gold';
            return;
        }

        const hoje = new Date().toISOString().split('T')[0];

        const res = await fetch('https://danazevedo.github.io/pageGoldKyvus/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                valor: 9.90,
                vencimento: hoje
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
