import { Router } from 'express';
import {
  getInscriptions,
  getInscriptionById,
  createInscription,
  updateInscription,
  deleteInscription,
  getFilterOptions,
} from '../controllers/inscriptionController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/filters', getFilterOptions);
router.route('/').get(getInscriptions).post(requireAuth, createInscription);
router.route('/:id').get(getInscriptionById).put(requireAuth, updateInscription).delete(requireAuth, deleteInscription);

export default router;
