import { Request, Response, NextFunction } from 'express';
import nodeHtmlToImage from 'node-html-to-image';
import Cattle from '../models/cattle.model';
import Milk from '../models/milk.model';
import { Sales } from '../models/finance.model';
import { catchAsync } from '../utils/catchAsync';

export const getDataImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Fetch Stats
    const cattleCount = await Cattle.countDocuments();

    const milkRecords = await Milk.find();
    const totalMilk = milkRecords.reduce((sum, record) => sum + record.quantity, 0);

    const salesRecords = await Sales.find({ recordType: 'sale' });
    const totalRevenue = salesRecords.reduce((sum, record) => sum + (record.totalAmount || 0), 0);

    // 2. Generate Image
    const html = `
    <html>
      <head>
        <style>
          body {
            width: 600px;
            height: 300px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
          }
          h1 {
            font-size: 32px;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .stats {
            display: flex;
            justify-content: space-around;
            width: 100%;
          }
          .stat {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            backdrop-filter: blur(5px);
            min-width: 120px;
          }
          .value {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .label {
            font-size: 14px;
            opacity: 0.8;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <h1>Cattle Manager Stats</h1>
        <div class="stats">
          <div class="stat">
            <div class="value">${cattleCount}</div>
            <div class="label">Cattle</div>
          </div>
          <div class="stat">
            <div class="value">${Math.round(totalMilk)} L</div>
            <div class="label">Milk Produced</div>
          </div>
          <div class="stat">
            <div class="value">₹${Math.round(totalRevenue)}</div>
            <div class="label">Revenue</div>
          </div>
        </div>
      </body>
    </html>
    `;

    const image = await nodeHtmlToImage({
        html: html,
        puppeteerArgs: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(image, 'binary');
});
