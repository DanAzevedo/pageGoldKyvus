const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

exports.pageGoldKyvus = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const asaasId = req.query.asaasId;
      const carId = req.query.carId;

      if (!asaasId || !carId) {
        return res.status(400).json({ error: "Parâmetros ausentes." });
      }

      // Buscar usuário pelo campo IDAssas
      const userSnapshot = await db.collection('tb_users')
        .where('IDAssas', '==', asaasId)
        .get();

      if (userSnapshot.empty) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const user = userSnapshot.docs[0].data();

      // Buscar carro pelo ID
      const carRef = await db.collection('tb_carros').doc(carId).get();
      if (!carRef.exists) {
        return res.status(404).json({ error: "Carro não encontrado." });
      }

      const car = carRef.data();

      // Montar corpo da requisição da assinatura
      const assinaturaBody = {
        billingType: "CREDIT_CARD",
        cycle: "MONTHLY",
        customer: asaasId,
        value: 9.90,
        nextDueDate: new Date().toISOString().split("T")[0], // hoje
        description: "Assinatura mensal membro"
      };

      // Chamada à API de criação de assinatura
      const response = await fetch('https://asaas-proxy-api-703360123160.southamerica-east1.run.app/api/criarAssinaturaMembroAsaas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assinaturaBody)
      });

      if (!response.ok) {
        const erro = await response.text();
        throw new Error(`Erro ao criar assinatura: ${erro}`);
      }

      const resultado = await response.json();

      return res.status(200).json({
        message: "Assinatura criada com sucesso!",
        user: user.name || user.email || "Usuário encontrado",
        car: car.modelo || "Carro encontrado",
        pagamento: resultado
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro interno: " + err.message });
    }
  });
});
