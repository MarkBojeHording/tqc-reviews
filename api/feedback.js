export default async function handler(req, res) {
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appk1zyqYItYtfbYt';
  const TABLE_ID = 'tbl63MP7Ntj1UGQdz';

  res.setHeader('Access-Control-Allow-Origin', '*');

  let records = [];
  let offset = null;

  try {
    do {
      const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`);
      url.searchParams.set('pageSize', '100');
      if (offset) url.searchParams.set('offset', offset);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });

      if (!response.ok) throw new Error(`Airtable error ${response.status}`);

      const data = await response.json();
      records = records.concat(data.records);
      offset = data.offset || null;
    } while (offset);

    res.status(200).json({ records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
