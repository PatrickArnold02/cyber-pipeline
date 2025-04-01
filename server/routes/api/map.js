import express from 'express';

const router = express.Router();

router.post('/map', async (req, res) => {
  const { districts } = req.body;

  if (!districts) {
    return res.status(400).json({ error: 'Districts data is required' });
  }

  try {
    // Logic to generate the SVG URL based on districts
    const svgUrl = `https://k12map.cs.ksu.edu/Map?districts=${encodeURIComponent(districts)}`;
    res.json({ svgUrl });
  } catch (error) {
    console.error('Error generating map:', error);
    res.status(500).json({ error: 'Failed to generate map' });
  }

  console.log("Received districts:", districts);

});

export default router;