import express, {json, urlencoded} from 'express';
import router from './app/src/routes/routes';

const port = +process.env.PORT || 5000;
const app = express();

app.use( json() ); // for parsing application/json.
app.use(urlencoded(), { extended: true }); // for parsing application/x-www-form-urlencoded.
app.use('/api/v1', router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
