import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

type Item = {
    id: number;
    name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            const { data: items, error: getError } = await supabase.from('items').select('*');
            if (getError) return res.status(500).json({ error: getError.message });
            res.status(200).json(items);
            break;
        case 'POST':
            const newItem = req.body as Item;
            const { data: insertedItem, error: insertError } = await supabase.from('items').insert(newItem).single();
            if (insertError) return res.status(500).json({ error: insertError.message });
            res.status(201).json(insertedItem);
            break;
        case 'PUT':
            const updatedItem = req.body as Item;
            const { data: updated, error: updateError } = await supabase.from('items').update(updatedItem).eq('id', updatedItem.id).single();
            if (updateError) return res.status(500).json({ error: updateError.message });
            res.status(200).json(updated);
            break;
        case 'DELETE':
            const { id } = req.body as { id: number };
            const { error: deleteError } = await supabase.from('items').delete().eq('id', id);
            if (deleteError) return res.status(500).json({ error: deleteError.message });
            res.status(204).end();
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
