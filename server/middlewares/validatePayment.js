import { body, validationResult } from 'express-validator';

export const validatePayment = [
    body('orderId').isMongoId().withMessage('Invalid orderId'),
    body('userId').isMongoId().withMessage('Invalid userId'),
    body('amount').isFloat({ min: 0 }).withMessage('Invalid amount'),
    body('method').isIn(['UPI', 'Card', 'NetBanking', 'Cash']).withMessage('Invalid payment method'),
    body('transactionId').notEmpty().withMessage('Transaction ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];