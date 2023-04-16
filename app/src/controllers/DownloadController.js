import { S3, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from 'stream';
import { config } from 'dotenv';
import dbClient from '../utils/db';

config();

const s3 = new S3( {
    region: process.env.S3_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
class DownloadController {
    static async getDownload ( req, res ) {
        try {
            // Get Video metadata from MongoDB
            const { id } = req.params
            const video = await dbClient.findById( id );

            if ( !video ) {
                return res.status( 404 ).json( { message: 'Video not found' } );
            }

            // Get Video Metadata from AWS S3 Bucket
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${ id }.mp4`,
            }

            const command = new GetObjectCommand( params );
            const response = await s3.send( command );

            // if ( response.ContentType !== 'video/mp4' ) {
                // // return res.status( 400 ).json( { message: 'Invalid file format' } );
            // }

            const stream = Readable.from( response.Body );

            // Send Video to the client
            res.set( 'Content-Type', response.ContentType );
            res.set( 'Content-Disposition', `attachment; filename=${ video.title }.mp4` );
            stream.pipe( res );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: 'Failed to download video' } );
        }
    }
}

export default DownloadController;
