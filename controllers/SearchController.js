const dbClient = require( '../utils/db' )

class SearchController {
  static async getSearch ( req, res ) {
    const { q } = req.query;
    if ( !q ) {
      return res.status( 400 ).json( { err: 'Bad Request' } );
    }
    const videos = await dbClient.getVideoSearch( q );
    res.json( videos );
  }
}

module.exports = SearchController
