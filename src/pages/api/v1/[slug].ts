import { NextApiRequest, NextApiResponse } from 'next';

import nextConnect from 'next-connect';
import cors from 'cors';

import { getAllData } from '@/lib/dato-cms';


const handler = nextConnect()
.use(cors(
  {
    methods: ['GET'],
    origin: 'http://localhost:3000',
  },
  ))
  .get(async (req:NextApiRequest, res:NextApiResponse) => {
    const { slug } = req.query
    const perPage = req.query.per_page || 5;
    const curPage = req.query.page || 1;

    let skip = (Number(curPage) - 1) * Number(perPage);

    if (slug === "lab") {
      try {
        const data = await getAllData(Number(perPage), skip);

        res.status(200).json({
          data: data.data,
          count: data.meta.count,
        });
        return;
      } catch (error) {
        res.end('Not found', error);
      }
    }

    res.end('Not found');

  });

export default handler;
