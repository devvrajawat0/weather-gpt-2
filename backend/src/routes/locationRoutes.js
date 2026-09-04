import express from 'express';
import { INDIAN_DISTRICTS } from '../data/districts.js';
import { WORLD_CAPITALS } from '../data/capitals.js';

const router = express.Router();

/**
 * GET /api/locations/search?q=query
 */
router.get('/search', (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  if (!query) {
    return res.json({ success: true, results: [] });
  }

  // Filter Indian districts
  const matchedDistricts = INDIAN_DISTRICTS.filter(d => 
    d.name.toLowerCase().includes(query) || d.state.toLowerCase().includes(query)
  );

  // Filter World Capitals
  const matchedCapitals = WORLD_CAPITALS.filter(c => 
    c.name.toLowerCase().includes(query) || c.country.toLowerCase().includes(query)
  );

  const combined = [...matchedDistricts, ...matchedCapitals].slice(0, 20);

  res.json({
    success: true,
    total: combined.length,
    results: combined
  });
});

/**
 * GET /api/locations/districts
 * Returns all Indian districts grouped by state
 */
router.get('/districts', (req, res) => {
  const grouped = {};
  for (const d of INDIAN_DISTRICTS) {
    if (!grouped[d.state]) {
      grouped[d.state] = [];
    }
    grouped[d.state].push(d);
  }

  res.json({
    success: true,
    statesCount: Object.keys(grouped).length,
    totalDistricts: INDIAN_DISTRICTS.length,
    districtsByState: grouped,
    allDistricts: INDIAN_DISTRICTS
  });
});

/**
 * GET /api/locations/capitals
 * Returns all world capitals
 */
router.get('/capitals', (req, res) => {
  const grouped = {};
  for (const c of WORLD_CAPITALS) {
    const cont = c.continent || 'Global';
    if (!grouped[cont]) {
      grouped[cont] = [];
    }
    grouped[cont].push(c);
  }

  res.json({
    success: true,
    totalCapitals: WORLD_CAPITALS.length,
    capitalsByContinent: grouped,
    allCapitals: WORLD_CAPITALS
  });
});

export default router;
