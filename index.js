const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Libera CORS para qualquer origem OU especifique seu domínio:
app.use(cors({ origin: true })); // ou: cors({ origin: "https://danazevedo.github.io" })

app.use(express.json());

app.post("/api/criarAssinaturaMembroAsaas", async (req, res) => {
  try {
    const payload = req.body;

    const response = await axios.post(
      "https://www.asaas.com/api/v3/subscriptions",
      payload,
      {
        headers: {
          Authorization: "access_token": "$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmIzZGI5MGVlLTYyYzAtNGM0NC04MzAwLTIwY2FhNWVlODRkMzo6JGFhY2hfMTMxMWNlNWUtMTdhZi00ODBhLTg0Y2ItNDBkN2QwZWFkZjIx",
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "Assinatura criada com sucesso",
      invoiceUrl: response.data?.invoiceUrl || null,
      response: response.data,
    });

  } catch (error) {
    console.error("Erro ao criar assinatura:", error?.response?.data || error.message);
    res.status(500).json({
      message: "Erro ao criar assinatura",
      error: error?.response?.data || error.message,
    });
  }
});

// Exporta a função Cloud Function
exports.asaasProxyApi = functions
  .region("southamerica-east1")
  .https.onRequest(app);
