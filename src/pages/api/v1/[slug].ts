import { NextApiRequest, NextApiResponse } from 'next';

import {ENVIRONMENT_VARIABLE} from '@/types/env.config.d'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (req.method === 'GET') {
    try {
      if (slug === 'bff') {
        res.json({
          message: `${ENVIRONMENT_VARIABLE}`,
        });
        return;
      }
    } catch (error) {
      res.end(`${slug}, not found`, error);
    }
  }
  res.status(404).json({
    message: ' Not found',
  });
}
