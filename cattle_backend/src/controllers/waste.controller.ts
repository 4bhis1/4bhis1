import { Request, Response, NextFunction } from 'express';
import { Sales } from '../models/finance.model';
import * as factory from './handlerFactory';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const createWaste = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Force recordType to be 'waste'
    req.body.recordType = 'waste';
    const doc = await Sales.create(req.body);

    res.status(201).json({
        status: 'success',
        data: doc
    });
});

export const getAllWaste = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Filter for waste
    const docs = await Sales.find({ recordType: 'waste' });

    res.status(200).json({
        status: 'success',
        results: docs.length,
        data: docs
    });
});

export const getWaste = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Sales.findOne({ _id: req.params.id, recordType: 'waste' });

    if (!doc) {
        return next(new AppError('No waste record found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: doc
    });
});

export const updateWaste = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Sales.findOneAndUpdate(
        { _id: req.params.id, recordType: 'waste' },
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!doc) {
        return next(new AppError('No waste record found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: doc
    });
});

export const deleteWaste = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Sales.findOneAndDelete({ _id: req.params.id, recordType: 'waste' });

    if (!doc) {
        return next(new AppError('No waste record found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
