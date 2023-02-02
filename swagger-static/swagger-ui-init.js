
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_recovery",
          "summary": "Password recovery via Email confirmation. Email should be sent with RecoveryCode inside",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailRecoveryDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "Incorrect input data by field"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/new-password": {
        "post": {
          "operationId": "AuthController_newPassword",
          "summary": "Confirm Password recovery",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewPasswordDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "success"
            },
            "400": {
              "description": "Incorrect input data by field"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "summary": "Try login user to the system",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TokenTypeSwaggerDto"
                  }
                }
              }
            },
            "400": {
              "description": "Incorrect input data",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_refresh",
          "summary": "Generate new pair of access and refresh tokens (in cookie client must send correct refresh Token that will be revoked after refreshing) Device LastActiveDate should\nbe overrode by issued Date of new refresh token",
          "description": "",
          "parameters": [],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TokenTypeSwaggerDto"
                  }
                }
              }
            },
            "401": {
              "description": "JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-confirmation": {
        "post": {
          "operationId": "AuthController_confirmByCode",
          "summary": "Confirm registration",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConfirmationCodeDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Email was verified. Account was activated"
            },
            "400": {
              "description": "Incorrect input data",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration": {
        "post": {
          "operationId": "AuthController_registration",
          "summary": "Registration in the system. Email with confirmation code will be send to passed email address",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "An email with a verification code has been sent to the specified email address"
            },
            "400": {
              "description": "Incorrect input data",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-email-resending": {
        "post": {
          "operationId": "AuthController_resending",
          "summary": "Resend confirmation registration Email if user exists",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailRecoveryDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "An email with a verification code has been sent to the specified email address"
            },
            "400": {
              "description": "Incorrect input data",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "summary": "In cookie client must send correct refresh Token that will be revoked",
          "description": "",
          "parameters": [],
          "responses": {
            "204": {
              "description": "success"
            },
            "401": {
              "description": "JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_getProfile",
          "summary": "Get information about current user",
          "description": "",
          "parameters": [],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MeViewDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/sa/users/{userId}/ban": {
        "put": {
          "operationId": "UsersController_updateBanInfo",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateBanInfoDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "Sa-Users"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/users": {
        "post": {
          "operationId": "UsersController_createUser",
          "summary": "",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "create new user",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Sa-Users"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        },
        "get": {
          "operationId": "UsersController_findUsers",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "banStatus",
              "required": true,
              "in": "query",
              "description": "banStatus by parameters",
              "schema": {
                "default": "all",
                "enum": [
                  "all",
                  "banned",
                  "notBanned"
                ],
                "type": "string"
              }
            },
            {
              "name": "searchLoginTerm",
              "required": true,
              "in": "query",
              "description": "Search term for user Login: Login should contain this term in any position",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "searchEmailTerm",
              "required": true,
              "in": "query",
              "description": "Search term for user Email: Email should contain this term in any position",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The found record",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserViewModel"
                  }
                }
              }
            }
          },
          "tags": [
            "Sa-Users"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/users/{userId}": {
        "delete": {
          "operationId": "UsersController_deleteUser",
          "summary": "Delete user specified by id",
          "description": "",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not found the user by id"
            }
          },
          "tags": [
            "Sa-Users"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/sa/blogs/{blogId}/ban": {
        "put": {
          "operationId": "SaController_updateBanInfoForBlog",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateBanInfoForBlogDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "QuizQuestions & Blogs"
          ]
        }
      },
      "/sa/blogs/{blogId}/bind-with-user/{userId}": {
        "put": {
          "operationId": "SaController_bindBlog",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "QuizQuestions & Blogs"
          ]
        }
      },
      "/sa/blogs": {
        "get": {
          "operationId": "SaController_findAll",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "searchNameTerm",
              "required": true,
              "in": "query",
              "description": "Search term for blog Name: Name should contain this term in any position",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "QuizQuestions & Blogs"
          ]
        }
      },
      "/sa/quiz/questions": {
        "get": {
          "operationId": "SaController_getQuestions",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "publishedStatus",
              "required": true,
              "in": "query",
              "description": "banStatus by parameters",
              "schema": {
                "default": "all",
                "enum": [
                  "all",
                  "published",
                  "notPublished"
                ],
                "type": "string"
              }
            },
            {
              "name": "bodySearchTerm",
              "required": true,
              "in": "query",
              "description": "Search term for body",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "QuizQuestions & Blogs"
          ]
        },
        "post": {
          "operationId": "SaController_createQuestion",
          "summary": "",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateQuestionDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/QuestionForSaViewModel"
                  }
                }
              }
            }
          },
          "tags": [
            "QuizQuestions & Blogs"
          ]
        }
      },
      "/sa/quiz/questions/{id}": {
        "delete": {
          "operationId": "SaController_deleteQuestion",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "QuizQuestions & Blogs"
          ]
        },
        "put": {
          "operationId": "SaController_updateQuestion",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateQuestionDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "QuizQuestions & Blogs"
          ]
        }
      },
      "/sa/quiz/questions/{id}/publish": {
        "put": {
          "operationId": "SaController_publishQuestion",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PublisherQuestionDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "QuizQuestions & Blogs"
          ]
        }
      },
      "/security/devices": {
        "get": {
          "operationId": "DevicesController_findDevices",
          "summary": "",
          "description": "",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/DeviceViewModel"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "SecurityDevices"
          ]
        },
        "delete": {
          "operationId": "DevicesController_deleteDevices",
          "summary": "",
          "description": "",
          "parameters": [],
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "SecurityDevices"
          ]
        }
      },
      "/security/devices/{deviceId}": {
        "delete": {
          "operationId": "DevicesController_deleteByDeviceId",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "deviceId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "SecurityDevices"
          ]
        }
      },
      "/blogs": {
        "get": {
          "operationId": "BlogsController_findAll",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "searchNameTerm",
              "required": true,
              "in": "query",
              "description": "Search term for blog Name: Name should contain this term in any position",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogs/{blogId}/posts": {
        "get": {
          "operationId": "BlogsController_findPosts",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "searchNameTerm",
              "required": true,
              "in": "query",
              "description": "Search term for blog Name: Name should contain this term in any position",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogs/{id}": {
        "get": {
          "operationId": "BlogsController_findOne",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogViewModel"
                  }
                }
              }
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogger/blogs/comments": {
        "get": {
          "operationId": "BloggersController_getComments",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs/{blogId}": {
        "delete": {
          "operationId": "BloggersController_deleteBlog",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "put": {
          "operationId": "BloggersController_updateBlog",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateBlogDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs/{blogId}/posts": {
        "post": {
          "operationId": "BloggersController_createPost",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePostDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewDto"
                  }
                }
              }
            },
            "400": {
              "description": "Incorrect input data for create post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "User not Unauthorized"
            },
            "403": {
              "description": "You are not the owner of the blog"
            },
            "404": {
              "description": "Not found blog"
            }
          },
          "tags": [
            "Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs/{blogId}/posts/{postId}": {
        "put": {
          "operationId": "BloggersController_updatePost",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePostDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "BloggersController_deletePost",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs": {
        "post": {
          "operationId": "BloggersController_createBlog",
          "summary": "",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateBlogDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created blog",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "Incorrect input data for create blog",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiErrorResultDto"
                  }
                }
              }
            },
            "401": {
              "description": "User not Unauthorized"
            }
          },
          "tags": [
            "Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "BloggersController_findAll",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "searchNameTerm",
              "required": true,
              "in": "query",
              "description": "Search term for blog Name: Name should contain this term in any position",
              "schema": {
                "default": "",
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/users/{id}/ban": {
        "put": {
          "operationId": "BloggersController_banUserForCurrentBlog",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateBanInfoForUserDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/users/blog/{id}": {
        "get": {
          "operationId": "BloggersController_getBanedUser",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "searchLoginTerm",
              "required": true,
              "in": "query",
              "description": "Search term for user Login: Login should contain this term in any position",
              "schema": {
                "default": "",
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Blogger"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/posts/{postId}/like-status": {
        "put": {
          "operationId": "PostsController_updateLikeStatus",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateLikeStatusDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts/{postId}/comments": {
        "get": {
          "operationId": "PostsController_findComments",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Posts"
          ]
        },
        "post": {
          "operationId": "PostsController_createComment",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateCommentDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts": {
        "get": {
          "operationId": "PostsController_findAll",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts/{id}": {
        "get": {
          "operationId": "PostsController_findOne",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewDto"
                  }
                }
              }
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/comments/{id}/like-status": {
        "put": {
          "operationId": "CommentsController_updateLikeStatus",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateLikeStatusDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "Comments"
          ]
        }
      },
      "/comments/{id}": {
        "put": {
          "operationId": "CommentsController_updateCommentsById",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateCommentDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "Comments"
          ]
        },
        "delete": {
          "operationId": "CommentsController_deleteCommentById",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "boolean"
                  }
                }
              }
            }
          },
          "tags": [
            "Comments"
          ]
        },
        "get": {
          "operationId": "CommentsController_findOne",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CommentsViewType"
                  }
                }
              }
            }
          },
          "tags": [
            "Comments"
          ]
        }
      },
      "/pair-game-quiz/pairs/connection": {
        "post": {
          "operationId": "QuizController_connectionQuiz",
          "summary": "",
          "description": "",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GameViewModel"
                  }
                }
              }
            }
          },
          "tags": [
            "PairQuizGame"
          ]
        }
      },
      "/pair-game-quiz/pairs/my-current/answers": {
        "post": {
          "operationId": "QuizController_answer",
          "summary": "",
          "description": "",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AnswerDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AnswerViewModel"
                  }
                }
              }
            }
          },
          "tags": [
            "PairQuizGame"
          ]
        }
      },
      "/pair-game-quiz/pairs/my-current": {
        "get": {
          "operationId": "QuizController_getCurrentGame",
          "summary": "",
          "description": "",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GameViewModel"
                  }
                }
              }
            }
          },
          "tags": [
            "PairQuizGame"
          ]
        }
      },
      "/pair-game-quiz/pairs/my": {
        "get": {
          "operationId": "QuizController_myGames",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "description": "pageSize is portions size that should be returned",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "description": "pageNumber is number of portions that should be returned",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "description": "Sort by desc or asc",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "PairQuizGame"
          ]
        }
      },
      "/pair-game-quiz/pairs/{id}": {
        "get": {
          "operationId": "QuizController_getPairGame",
          "summary": "",
          "description": "",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GameViewModel"
                  }
                }
              }
            }
          },
          "tags": [
            "PairQuizGame"
          ]
        }
      },
      "/testing/all-data": {
        "delete": {
          "operationId": "TestingController_deleteDB",
          "summary": "",
          "description": "",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "Testing"
          ]
        }
      }
    },
    "info": {
      "title": "Blogger with quiz game",
      "description": "The blogger API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [
      {
        "name": "bloggers",
        "description": ""
      }
    ],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        },
        "basic": {
          "type": "http",
          "scheme": "basic"
        }
      },
      "schemas": {
        "EmailRecoveryDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "Email User for recovery",
              "pattern": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
              "example": "string"
            }
          },
          "required": [
            "email"
          ]
        },
        "NewPasswordDto": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string",
              "description": "New account recovery password.",
              "minLength": 6,
              "maxLength": 20
            },
            "recoveryCode": {
              "type": "string",
              "description": "Code that be sent via Email inside link"
            }
          },
          "required": [
            "newPassword",
            "recoveryCode"
          ]
        },
        "LoginDto": {
          "type": "object",
          "properties": {
            "loginOrEmail": {
              "type": "string",
              "description": "Login or Email  -  User"
            },
            "password": {
              "type": "string",
              "description": "Password User"
            }
          },
          "required": [
            "loginOrEmail",
            "password"
          ]
        },
        "TokenTypeSwaggerDto": {
          "type": "object",
          "properties": {
            "accessToken": {
              "type": "string"
            }
          },
          "required": [
            "accessToken"
          ]
        },
        "FieldError": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string"
            },
            "field": {
              "type": "string"
            }
          },
          "required": [
            "message",
            "field"
          ]
        },
        "ApiErrorResultDto": {
          "type": "object",
          "properties": {
            "errorsMessages": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/FieldError"
              }
            }
          },
          "required": [
            "errorsMessages"
          ]
        },
        "ConfirmationCodeDto": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "description": "Code that be sent via Email inside link",
              "minLength": 1,
              "maxLength": 100
            }
          },
          "required": [
            "code"
          ]
        },
        "CreateUserDto": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string",
              "description": "login: Login for create/registration User",
              "minLength": 3,
              "maxLength": 10,
              "pattern": "^[a-zA-Z0-9_-]*$",
              "example": "string"
            },
            "email": {
              "type": "string",
              "description": "email: email for create/registration User",
              "pattern": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
              "example": "string"
            },
            "password": {
              "type": "string",
              "description": "password: password for create/registration User",
              "minLength": 6,
              "maxLength": 20
            }
          },
          "required": [
            "login",
            "email",
            "password"
          ]
        },
        "MeViewDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "login": {
              "type": "string"
            },
            "userId": {
              "type": "string"
            }
          },
          "required": [
            "email",
            "login",
            "userId"
          ]
        },
        "UpdateBanInfoDto": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "object",
              "description": "isBanned: User",
              "default": true
            },
            "banReason": {
              "type": "string",
              "description": "password: password User"
            }
          },
          "required": [
            "isBanned",
            "banReason"
          ]
        },
        "BanInfoType": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean"
            },
            "banDate": {
              "type": "string"
            },
            "banReason": {
              "type": "string"
            }
          },
          "required": [
            "isBanned",
            "banDate",
            "banReason"
          ]
        },
        "UserViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "login": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            },
            "banInfo": {
              "$ref": "#/components/schemas/BanInfoType"
            }
          },
          "required": [
            "id",
            "login",
            "email",
            "createdAt",
            "banInfo"
          ]
        },
        "UpdateBanInfoForBlogDto": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean",
              "description": "isBanned: \"boolean\" for update status ban or unban User"
            }
          },
          "required": [
            "isBanned"
          ]
        },
        "CreateQuestionDto": {
          "type": "object",
          "properties": {
            "body": {
              "type": "string",
              "description": "body: Text of question, for example: How many continents are there"
            },
            "correctAnswers": {
              "description": "correctAnswers: All variants of possible correct answers for current questions Examples: [6, 'six', 'шесть', 'дофига'] In Postgres save this data in JSON column",
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "body",
            "correctAnswers"
          ]
        },
        "QuestionForSaViewModel": {
          "type": "object",
          "properties": {}
        },
        "PublisherQuestionDto": {
          "type": "object",
          "properties": {
            "published": {
              "type": "object",
              "description": "published: True if question is completed and can be used in the Quiz game",
              "default": true
            }
          },
          "required": [
            "published"
          ]
        },
        "DeviceViewModel": {
          "type": "object",
          "properties": {}
        },
        "BlogViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name",
            "description",
            "websiteUrl",
            "createdAt"
          ]
        },
        "UpdateBlogDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "name: Blog name for update"
            },
            "description": {
              "type": "string",
              "description": "description"
            },
            "websiteUrl": {
              "type": "string",
              "description": "websiteUrl: Blog website Url"
            }
          },
          "required": [
            "name",
            "description",
            "websiteUrl"
          ]
        },
        "CreatePostDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Title for create Post"
            },
            "shortDescription": {
              "type": "string",
              "description": "Short description for create Post"
            },
            "content": {
              "type": "string",
              "description": "content for create Post"
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content"
          ]
        },
        "LikeDetailsViewModel": {
          "type": "object",
          "properties": {
            "addedAt": {
              "type": "string"
            },
            "userId": {
              "type": "string"
            },
            "login": {
              "type": "string"
            }
          },
          "required": [
            "addedAt",
            "userId",
            "login"
          ]
        },
        "ExtendedLikesInfoViewModel": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "number"
            },
            "dislikesCount": {
              "type": "number"
            },
            "myStatus": {
              "type": "string"
            },
            "newestLikes": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/LikeDetailsViewModel"
              }
            }
          },
          "required": [
            "likesCount",
            "dislikesCount",
            "myStatus",
            "newestLikes"
          ]
        },
        "PostViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "shortDescription": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "blogId": {
              "type": "string"
            },
            "blogName": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            },
            "extendedLikesInfo": {
              "$ref": "#/components/schemas/ExtendedLikesInfoViewModel"
            }
          },
          "required": [
            "id",
            "title",
            "shortDescription",
            "content",
            "blogId",
            "blogName",
            "createdAt",
            "extendedLikesInfo"
          ]
        },
        "CreateBlogDto": {
          "type": "object",
          "properties": {
            "websiteUrl": {
              "type": "string",
              "description": "websiteUrl: Blog website Url",
              "minLength": 1,
              "maxLength": 100,
              "pattern": "^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n",
              "example": "string"
            },
            "name": {
              "type": "string",
              "description": "name: Blog name",
              "minLength": 1,
              "maxLength": 15
            },
            "description": {
              "type": "string",
              "description": "description",
              "minLength": 1,
              "maxLength": 500
            }
          },
          "required": [
            "websiteUrl",
            "name",
            "description"
          ]
        },
        "UpdateBanInfoForUserDto": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "object",
              "description": "isBanned: User",
              "default": true
            },
            "banReason": {
              "type": "string",
              "description": "password: password User",
              "minLength": 20
            },
            "blogId": {
              "type": "string",
              "description": "id for Blog"
            }
          },
          "required": [
            "isBanned",
            "banReason",
            "blogId"
          ]
        },
        "UpdateLikeStatusDto": {
          "type": "object",
          "properties": {
            "likeStatus": {
              "description": "Send \"None\" if you want to un \"like\" or \"undislike\"",
              "default": "None",
              "enum": [
                "None",
                "Like",
                "Dislike"
              ],
              "type": "string"
            }
          },
          "required": [
            "likeStatus"
          ]
        },
        "CreateCommentDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "description": "content for create Comment"
            }
          },
          "required": [
            "content"
          ]
        },
        "UpdateCommentDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "description": "description for update comment"
            }
          },
          "required": [
            "content"
          ]
        },
        "CommentsViewType": {
          "type": "object",
          "properties": {}
        },
        "GameViewModel": {
          "type": "object",
          "properties": {}
        },
        "AnswerDto": {
          "type": "object",
          "properties": {
            "answer": {
              "type": "string",
              "description": "answer: Text of answer, for example: 'free'"
            }
          },
          "required": [
            "answer"
          ]
        },
        "AnswerViewModel": {
          "type": "object",
          "properties": {}
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
