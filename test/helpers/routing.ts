const globalPrefix = '';
const blogController = `${globalPrefix}/blogs`;
const bloggerController = `${globalPrefix}/blogger/blogs`;
const postController = `${globalPrefix}/posts`;
const commentController = `${globalPrefix}/comments`;
const authController = `${globalPrefix}/auth`;
const saController = `${globalPrefix}/sa/users`;
const securityController = `${globalPrefix}/security/devices`;
const testingController = `${globalPrefix}/testing`;

export const endpoints = {
  authController: {
    registration: `${authController}/registration`,
    registrationEmailResending: `${authController}/registration-email-resending`,
    registrationConfirmation: `${authController}/registration-confirmation`,
    login: `${authController}/login`,
    refreshToken: `${authController}/refresh-token`,
  },
  blogController,
  bloggerController,
  postController,
  commentController,
  saController,
  securityController,
  testingController: {
    allData: `${testingController}/all-data`,
  },
  swaggerEndpoint: `/swagger`,
};

export const methods = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE',
};
