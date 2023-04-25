const express = require('express');
const AppController = require('../controllers/AppController');
const {
  UsersController,
  UserController,
} = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require( '../controllers/FilesController' );
const SearchController = require('../controllers/SearchController');

const router = express.Router();

// Connection Information
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Users
router.post('/users', UsersController.postNew);

// Authentication
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UserController.getMe);

// Files
router.post('/files', FilesController.postUpload);
router.get('/files', FilesController.getIndex);
router.get('/files/:id', FilesController.getShow);
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnPublish);
router.get('/files/:id/data', FilesController.getFile);

router.post( '/files', FilesController.postUpload );

// Searches for videos by title, description, tags, filename, or fileId
router.get( '/api/v1/search', SearchController.getSearch );

module.exports = router;
