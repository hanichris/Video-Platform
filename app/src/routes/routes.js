import { Router } from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';
import UsersController from '../controllers/UsersController';

const router = Router();

router.get('/status', AppController.getStatus); // GET /status.
router.get('/stats', AppController.getStats); // GET /stats.
router.post('/users', UsersController.postNew); // POST /users.
router.get('/users/me', UsersController.getMe); // GET /users/me
router.get('/connect', AuthController.getConnect); // GET /connect
router.get('/disconnect', AuthController.getDisconnect); // GET /disconnect
router.post('/files', FilesController.postUpload); // POST /files
router.get('/files/:id', FilesController.getShow); // GET /files/:id
router.get('/files', FilesController.getIndex); // GET /files
router.put('/files/:id/publish', FilesController.putPublish); // PUT /files/:id/publish
router.put('/files/:id/unpublish', FilesController.putUnpublish); // PUT /files/:id/unpublish
router.get('/files/:id/data', FilesController.getFile); // GET /files/:id/data

module.exports = router;
