import express from 'express';
import * as wasteController from '../controllers/waste.controller';

const router = express.Router();

router
    .route('/')
    .get(wasteController.getAllWaste)
    .post(wasteController.createWaste);

router
    .route('/:id')
    .get(wasteController.getWaste)
    .patch(wasteController.updateWaste)
    .delete(wasteController.deleteWaste);

export default router;
