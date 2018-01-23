'use strict';

import Vue from 'vue';
import users from '@/api/users';
import testData from '../../test-data';

describe('users', () => {
  beforeEach(() => {
    testData.initialize();
  });

  afterEach(() => {
    testData.restore();
  });

  it('exists', () => {
    expect(users).to.exist;
  });

  describe('current', () => {
    const currentUser = {
      id: 1138,
      firstName: 'Jackson',
      lastName: 'Josephini',
      email: 'jj@test.org',
      roles: ['admin', 'user']
    };

    beforeEach(() => {
      testData.setResponse('/api/users/current', {
        status: 200,
        body: currentUser
      });
    });

    it('gets the current user', async () => {
      await users.current();
      expect(Vue.http.get.calledOnce).to.be.true;
      expect(Vue.http.get.calledWith('/api/users/current')).to.be.true;
    });

    it('unpacks the body of the response', async () => {
      const res = await users.current();
      expect(res).to.deep.equal(currentUser);
    });
  });

  describe('change password', () => {
    it('posts to the change password', async () => {
      testData.setPostResponse('/api/users/42/password', {
        status: 200,
        body: { status: 200 }
      });
      await users.changePassword(42, 'myOldPassword', 'myShinyNewPassword');
      expect(Vue.http.post.calledOnce).to.be.true;
      expect(
        Vue.http.post.calledWith('/api/users/42/password', {
          currentPassword: 'myOldPassword',
          password: 'myShinyNewPassword'
        })
      ).to.be.true;
    });
  });

  describe('save', () => {
    it('posts new users', async () => {
      testData.setPostResponse('/api/users', {
        status: 200,
        body: {
          id: 73,
          firstName: 'Sheldon',
          lastName: 'Copper',
          email: 'smelly.pooper@caltech.edu'
        }
      });
      await users.save({
        firstName: 'Sheldon',
        lastName: 'Copper',
        email: 'smelly.pooper@caltech.edu'
      });
      expect(
        Vue.http.post.calledWith('/api/users', {
          firstName: 'Sheldon',
          lastName: 'Copper',
          email: 'smelly.pooper@caltech.edu'
        })
      ).to.be.true;
    });

    it('posts changes to existing users', async () => {
      testData.setPostResponse('/api/users/73', {
        status: 200,
        body: {
          id: 73,
          firstName: 'Shelly',
          lastName: 'Smith',
          email: 'shells@test.org'
        }
      });
      await users.save({
        id: 73,
        firstName: 'Sheldon',
        lastName: 'Copper',
        email: 'smelly.pooper@caltech.edu'
      });
      expect(
        Vue.http.post.calledWith('/api/users/73', {
          id: 73,
          firstName: 'Sheldon',
          lastName: 'Copper',
          email: 'smelly.pooper@caltech.edu'
        })
      ).to.be.true;
    });
  });
});
