# Soft Skills School API

A comprehensive REST API built with NestJS for managing a soft skills training platform. This API provides endpoints for user authentication, quiz management, feedback systems, notifications, and more.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: User profiles with Belbin roles and characteristics
- **Quiz System**: Create and manage soft skills assessment quizzes
- **Feedback System**: Collect and manage user feedback
- **Notification System**: Send notifications to users
- **File Upload**: Handle file uploads (likely for user avatars or quiz materials)
- **IP Tracking**: Track user IP addresses for security/audit purposes
- **Swagger Documentation**: Auto-generated API documentation

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Class-validator and class-transformer
- **Logging**: Winston logger
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose
- **Cloud Services**: AWS SDK integration

## Project Structure

```
src/
├── common/                 # Shared utilities, guards, decorators, pipes
│   ├── decorators/         # Custom decorators (roles, user)
│   ├── dto/                # Common DTOs (CRUD operations)
│   ├── enums/              # Enums (Belbin roles, question types, user roles)
│   ├── guards/             # Authentication and authorization guards
│   ├── helpers/            # Winston logger configuration
│   └── pipes/              # Custom pipes
├── config/                 # Configuration files
├── database/
│   └── models/             # Mongoose schemas
├── modules/                # Feature modules
│   ├── auth/               # Authentication module
│   ├── characteristic/     # User characteristics module
│   ├── feedback/           # Feedback collection module
│   ├── ip/                 # IP tracking module
│   ├── notification/       # Notification system
│   ├── question/           # Quiz questions module
│   ├── quiz/               # Quiz/test management
│   ├── soft-skill/         # Soft skills module
│   ├── upload/             # File upload module
│   └── user/               # User management
└── types/                  # TypeScript type definitions
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Yarn package manager
- Docker & Docker Compose (for containerized deployment)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd soft-skills-school-api
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Server Configuration
   PORT=3000

   # Database Configuration
   MONGO_URL=mongodb://localhost:27017/soft-skills-school

   # Authentication
   JWT_SECRET=your-jwt-secret-key

   # AWS Configuration (for file uploads)
   AWS_ACCESS_KEY=your-aws-access-key
   AWS_SECRET_KEY=your-aws-secret-key

   # Docker Hub (for deployment)
   DOCKERHUB_TOKEN=your-dockerhub-token
   ```

   **Environment Variables Description:**

   - `PORT`: The port number on which the application will run (default: 3000)
   - `MONGO_URL`: MongoDB connection string (local or cloud)
   - `JWT_SECRET`: Secret key for JWT token signing and verification
   - `AWS_ACCESS_KEY`: AWS access key for S3 file upload functionality
   - `AWS_SECRET_KEY`: AWS secret key for S3 file upload functionality
   - `DOCKERHUB_TOKEN`: Docker Hub token for automated deployments

## Running the Application

### Development

```bash
# Start in development mode with hot reload
yarn start:dev

# Start with debug mode
yarn start:debug
```

### Production

```bash
# Build the application
yarn build

# Start the production server
yarn start:prod
```

### Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d
```

## Testing

```bash
# Run unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:cov

# Run end-to-end tests
yarn test:e2e
```

## API Documentation

Once the application is running, visit `http://localhost:3000/api-docs` to access the Swagger UI documentation.

## Available Scripts

- `yarn build` - Build the application
- `yarn format` - Format code with Prettier
- `yarn start` - Start the application
- `yarn start:dev` - Start in development mode
- `yarn start:debug` - Start in debug mode
- `yarn start:prod` - Start production server
- `yarn lint` - Run ESLint
- `yarn test` - Run tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:cov` - Run tests with coverage
- `yarn test:e2e` - Run end-to-end tests

## Database Models

- **User**: User accounts with authentication and profile information
- **Question**: Quiz questions with different types
- **Test/Quiz**: Assessment tests composed of questions
- **SoftSkill**: Soft skills categories and definitions
- **Characteristic**: User personality characteristics (Belbin roles)
- **Feedback**: User feedback and ratings
- **Notification**: System notifications
- **IP**: IP address tracking for security

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED license.
