const globalPrefix = '';
const blogController = `${globalPrefix}/blogs`;
const bloggerController = `${globalPrefix}/blogger/blogs`;
const postController = `${globalPrefix}/posts`;
const commentController = `${globalPrefix}/comments`;
const authController = `${globalPrefix}/auth`;
const saController = `${globalPrefix}/sa`;
const quizController = `${globalPrefix}/pair-game-quiz/pairs`;
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
  saController: {
    users: `${saController}/users`,
    blogs: `${saController}/blogs`,
    quiz: `${saController}/quiz/questions`,
  },
  quizController: {
    id: `${quizController}`,
    connection: `${quizController}/connection`,
    answer: `${quizController}/my-current/answers`,
    my_current: `${quizController}/my-current`,
  },
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
