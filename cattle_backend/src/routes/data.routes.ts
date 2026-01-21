import express from 'express';
import * as dataController from '../controllers/data.controller';

const router = express.Router();

router.get('/', dataController.getDataImage);

export default router;
