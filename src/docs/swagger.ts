import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "Dokumentasi API Tixly",
    description: "Dokumentasi API Tixly",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: "https://tixly-backend.vercel.app/api",
      description: "Deploy Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "123",
        password: "123456",
      },
      RegisterRequest: {
        fullName: "herous herous",
        username: "herous2024",
        email: "herous21@yopmail.com",
        password: "1234512345",
        confirmPassword: "1234512345",
      },
      ActivationRequest: {
        code: "abcedf",
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
