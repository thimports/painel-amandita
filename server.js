
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const SHOPIFY_DOMAIN = '0f8e33.myshopify.com';
const ADMIN_TOKEN = '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';

app.get('/pedidos-shopify', async (req, res) => {
  try {
    const response = await axios.get(`https://${SHOPIFY_DOMAIN}/admin/api/2023-10/orders.json?financial_status=paid&fulfillment_status=unfulfilled`, {
      headers: {
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    const pedidos = response.data.orders.map(pedido => ({
      id: pedido.id,
      nome: pedido.customer?.first_name + ' ' + pedido.customer?.last_name,
      telefone: pedido.phone || pedido.customer?.phone || '',
      email: pedido.email
    }));

    res.json(pedidos);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Erro ao buscar pedidos');
  }
});

const PORT = process.env.PORT; // sem fallback
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

