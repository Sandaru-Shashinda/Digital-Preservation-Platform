import Inscription from '../models/Inscription.js';

export const getInscriptions = async (req, res, next) => {
  try {
    const { search, location, historicalPeriod, scriptType, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (search?.trim()) filter.$text = { $search: search.trim() };
    if (location) filter['location.name'] = { $regex: location, $options: 'i' };
    if (historicalPeriod) filter.historicalPeriod = { $regex: historicalPeriod, $options: 'i' };
    if (scriptType) filter.scriptType = scriptType;

    const skip = (Number(page) - 1) * Number(limit);
    const [inscriptions, total] = await Promise.all([
      Inscription.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Inscription.countDocuments(filter),
    ]);

    res.json({
      inscriptions,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) { next(err); }
};

export const getInscriptionById = async (req, res, next) => {
  try {
    const inscription = await Inscription.findById(req.params.id);
    if (!inscription) { const e = new Error('Inscription not found'); e.statusCode = 404; return next(e); }
    res.json(inscription);
  } catch (err) { next(err); }
};

export const createInscription = async (req, res, next) => {
  try {
    const inscription = await Inscription.create(req.body);
    res.status(201).json(inscription);
  } catch (err) { next(err); }
};

export const updateInscription = async (req, res, next) => {
  try {
    const inscription = await Inscription.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!inscription) { const e = new Error('Inscription not found'); e.statusCode = 404; return next(e); }
    res.json(inscription);
  } catch (err) { next(err); }
};

export const deleteInscription = async (req, res, next) => {
  try {
    const inscription = await Inscription.findByIdAndDelete(req.params.id);
    if (!inscription) { const e = new Error('Inscription not found'); e.statusCode = 404; return next(e); }
    res.json({ message: 'Inscription deleted successfully', id: req.params.id });
  } catch (err) { next(err); }
};

export const getFilterOptions = async (req, res, next) => {
  try {
    const [locations, periods, scripts] = await Promise.all([
      Inscription.distinct('location.name'),
      Inscription.distinct('historicalPeriod'),
      Inscription.distinct('scriptType'),
    ]);
    res.json({
      locations: locations.filter(Boolean).sort(),
      periods: periods.filter(Boolean).sort(),
      scripts: scripts.filter(Boolean).sort(),
    });
  } catch (err) { next(err); }
};
