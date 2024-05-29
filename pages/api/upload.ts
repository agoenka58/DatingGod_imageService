import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import * as formidable from 'formidable';

import fs from 'fs';

export const config = {
    api: {
        bodyParser: false
    }
};

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//     if (req.method === 'POST') {
//         const form = new formidable.IncomingForm();
//         form.parse(req, async (err, fields, files) => {
//             if (err) {
//                 return res.status(500).json({ error: err.message });
//             }

//             const file = files.file as unknown as formidable.File;
//             const filePath = file.filepath;

//             const fileContent = fs.readFileSync(filePath);
//             const { data, error } = await supabase.storage
//                 .from('images')
//                 .upload(`public/${file.newFilename}`, fileContent, {
//                     cacheControl: '3600',
//                     upsert: false
//                 });

//             if (error) {
//                 return res.status(500).json({ error: error.message });
//             }

//             const publicUrl = supabase.storage.from('images').getPublicUrl(`public/${file.newFilename}`);

//             res.status(200).json({ url: publicUrl });
//         });
//     } else {
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// };

// export default handler;
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        //console.log("req:", req)
        const form = new formidable.IncomingForm();
        //console.log("form", form)
        form.parse(req, async (err, fields, files) => {
            console.log("files:", files)
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const file = Array.isArray(files.file) ? files.file[0] : files.file; // Get the first file if it's an array

            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const filePath = file.filepath;

            const fileContent = fs.readFileSync(filePath);
            const { data, error } = await supabase.storage
                .from('images')
                .upload(`public/${file.newFilename}`, fileContent, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            const publicUrl = supabase.storage.from('images').getPublicUrl(`public/${file.newFilename}`);

            res.status(200).json({ url: publicUrl });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
export default handler;



