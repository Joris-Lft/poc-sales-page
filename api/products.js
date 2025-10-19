// Vercel Serverless Function pour sécuriser Airtable
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const personalAccessToken = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!personalAccessToken || !baseId) {
      throw new Error(
        "Configuration manquante - Personal Access Token ou Base ID manquant"
      );
    }

    const url = `https://api.airtable.com/v0/${baseId}/Produits?filterByFormula={Actif}=1&sort[0][field]=Ordre&sort[0][direction]=asc`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${personalAccessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur Airtable: ${response.status}`);
    }

    const data = await response.json();

    // Transformer les données
    const products = data.records.map((record) => ({
      id: record.id,
      name: record.fields.Nom || "Produit sans nom",
      description: record.fields.Description || "Aucune description",
      price: record.fields.Prix || 0,
      image: record.fields.Image ? record.fields.Image[0] : null,
      active: record.fields.Actif || false,
    }));

    res.status(200).json({
      success: true,
      products,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors du chargement des produits",
      timestamp: new Date().toISOString(),
    });
  }
}
