/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../src/models/user.model';
import { ChannelModel as Channel } from '../../src/models/channel.model';
import {
  CreateUserInput,
  LoginUserInput,
} from '../../src/services/user.service';
import { AuthController, exclude } from '../../src/controllers/auth.controller';

describe('AuthController', () => {
  describe('registerHandler', () => {
    it('should create a new user, save it, and return a response with status 201', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password',
          // ...other user input properties
        },
      } as unknown as Request<object, object, CreateUserInput>;
      const resp = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        cookie: sinon.stub(),
      } as unknown as Response;
      const next = sinon.stub() as unknown as NextFunction;

      const genSaltSyncStub = sinon.stub(bcrypt, 'genSaltSync').returns('salt');
      const hashSyncStub = sinon
        .stub(bcrypt, 'hashSync')
        .returns('hashedPassword');
      const saveUserStub = sinon.stub(User.prototype, 'save').resolves();
      const randomUUIDStub = sinon.stub().returns('randomUUID');
      sinon.replace(Channel.prototype, 'save', sinon.stub().resolves());
      const jwtSignStub = sinon.stub(jwt, 'sign');
      // .returns('token');

      await AuthController.registerHandler(req, resp, next);

      expect((resp.status as sinon.SinonStub).calledWith(201)).to.be.true;
      expect(
        (resp.json as sinon.SinonStub).calledWith({
          status: 'success',
          data: {
            user: exclude(
              {
                email: 'test@example.com',
                password: undefined,
                // ...other user properties
              },
              ['password'],
            ),
          },
        }),
      ).to.be.true;
      expect(
        (resp.cookie as sinon.SinonStub).calledWith('auth_token', 'token', {
          expires: sinon.match.instanceOf(Date),
          httpOnly: true,
        }),
      ).to.be.true;

      expect(genSaltSyncStub.calledWith(10)).to.be.true;
      expect(hashSyncStub.calledWith('password', 'salt')).to.be.true;
      expect(saveUserStub.calledOnce).to.be.true;
      expect(randomUUIDStub.calledOnce).to.be.true;
      expect(jwtSignStub.calledOnce).to.be.true;

      sinon.restore();
    });

    it('should return status 409 if the user email already exists', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password',
          // ...other user input properties
        },
      } as unknown as Request<object, object, CreateUserInput>;
      const resp = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      } as unknown as Response;
      const next = sinon.stub() as unknown as NextFunction;

      const saveUserStub = sinon.stub(User.prototype, 'save').rejects({
        code: 'P2002',
      });

      await AuthController.registerHandler(req, resp, next);

      expect((resp.status as sinon.SinonStub).calledWith(409)).to.be.true;
      expect(
        (resp.json as sinon.SinonStub).calledWith({
          status: 'fail',
          message: 'Email already exist',
        }),
      ).to.be.true;

      expect(saveUserStub.calledOnce).to.be.true;

      sinon.restore();
    });

    it('should call the next function with an error if an error occurs', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password',
          // ...other user input properties
        },
      } as unknown as Request<object, object, CreateUserInput>;
      const resp = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        cookie: sinon.stub(),
      } as unknown as Response;
      const next = sinon.stub() as unknown as NextFunction;

      const error = new Error('Some error');
      const saveUserStub = sinon.stub(User.prototype, 'save').rejects(error);

      await AuthController.registerHandler(req, resp, next);

      expect((next as sinon.SinonStub).calledWith(error)).to.be.true;

      expect(saveUserStub.calledOnce).to.be.true;

      sinon.restore();
    });
  });

  describe('loginHandler', () => {
    it('should authenticate a user and return a response with status 200', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password',
        },
      } as unknown as Request<object, object, LoginUserInput>;
      const resp = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        cookie: sinon.stub(),
      } as unknown as Response;
      const next = sinon.stub() as unknown as NextFunction;

      const findOneStub = sinon.stub(User, 'findOne').resolves({
        email: 'test@example.com',
        password: 'hashedPassword',
        // ...other user properties
      });
      const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);
      const jwtSignStub = sinon.stub(jwt, 'sign');
      // .returns('token');

      await AuthController.loginHandler(req, resp, next);

      expect((resp.status as sinon.SinonStub).calledWith(200)).to.be.true;
      expect(
        (resp.json as sinon.SinonStub).calledWith({
          status: 'success',
        }),
      ).to.be.true;
      expect(
        (resp.cookie as sinon.SinonStub).calledWith('auth_token', 'token', {
          expires: sinon.match.instanceOf(Date),
          httpOnly: true,
        }),
      ).to.be.true;

      expect(findOneStub.calledWith({ email: 'test@example.com' })).to.be.true;
      expect(compareStub.calledWith('password', 'hashedPassword')).to.be.true;
      expect(jwtSignStub.calledOnce).to.be.true;

      sinon.restore();
    });

    // Write additional test cases for loginHandler
    // to cover other scenarios such as user not found,
    // incorrect password, and error handling.
  });

  // Write additional test cases for other methods in AuthController
});
