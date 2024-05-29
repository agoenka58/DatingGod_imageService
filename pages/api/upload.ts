import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import * as formidable from 'formidable';
import { RemoveBgResult, RemoveBgError, removeBackgroundFromImageUrl } from "remove.bg";


import fs from 'fs';

export const config = {
    api: {
        bodyParser: false
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const file = Array.isArray(files.file) ? files.file[0] : files.file; // Get the first file if it's an array

            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const filePath = file.filepath;

            const fileContent = fs.readFileSync(filePath);

            await supabase.storage
                .from('images')
                .upload(`${fields.user_id}/profile_original`, fileContent, {
                    cacheControl: '3600',
                    upsert: true, //overwrite if exist
                }).then()
                .catch(err => res.status(500).json({ error: err.message }));


            const publicUrl = supabase.storage.from('images').getPublicUrl(`${fields.user_id}/profile_original`);

            //remove bg + save processed image
            const url = publicUrl.data.publicUrl;
            const outputFile = `./processed.png`;
            const removeBGKey: string = process.env.NEXT_PUBLIC_REMOVE_BG_KEY || "removeBgApiKey"

            removeBackgroundFromImageUrl({
                url,
                apiKey: removeBGKey,
                size: "regular",
                type: "person",
                outputFile
            }).then(async (result: RemoveBgResult) => {
                console.log(`File saved to ${outputFile}`);
                //const base64img = result.base64img;
                const processedFileContent = fs.readFileSync(outputFile);

                //saving processed image
                await supabase.storage
                    .from('images')
                    .upload(`${fields.user_id}/profile_bg_removed`, processedFileContent, {
                        cacheControl: '3600',
                        upsert: true,
                    }).then()
                    .catch(err => res.status(500).json({ error: err.message }));
                const publicProcessedUrl = supabase.storage.from('images').getPublicUrl(`${fields.user_id}/profile_bg_removed`);

                res.status(200).json({ url: publicUrl, processedUrl: publicProcessedUrl });

            }).catch((errors: Array<RemoveBgError>) => {
                console.log(JSON.stringify(errors));
            });
            //res.status(200).json({ url: publicUrl, processedUrl: "publicProcessedUrl" });


        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
export default handler;



