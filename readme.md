# Dev Academy Spring 2025 Exercise Backend

This project is a Node.js application that uses Express, Prisma, and PostgreSQL to manage and query electricity data. The application is containerized using Docker and is deployed to AWS EC2.

For the sake of simplicity for the testers, `.env` files are included in repository and the Database is included in same container.

## Online Preview

> [!WARNING]
> Note: The application currently runs over HTTP, and HTTPS is not supported. Some browsers may automatically redirect to HTTPS, so ensure you manually change it back to HTTP if necessary.

Full Website: http://d3ahpr97y5mrhf.cloudfront.net/ (AWS S3 & CloudFront)

API endpoint for daily statistics.

```bash
curl http://ec2-16-170-242-224.eu-north-1.compute.amazonaws.com:3000/api/statistics/daily
```

Expected to return JSON response with 10 pages of data without any query params.

## Prerequisites

- Docker
- node.js \*
- npm \*

\* Not required, but needed to run lint.

## Getting Started

### Local Development With Docker

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Apluri/dev-academy-spring-2025-exercise-backend.git
   cd dev-academy-spring-2025-exercise-backend
   ```

2. **Run the application**:

   ```bash
   docker-compose up --build
   ```

   This command will build and start the backend, database, Adminer and migration services. The application will be available at http://localhost:3000.

3. **Verify the Application (Optional) After running docker-compose up --build, check if the API is working**:

   ```bash
   http://localhost:3000/api/statistics/daily
   ```

   If successful, this should return 10 pages of electricity statistics.

4. **Optional: Run the frontend application for easier API interaction: See the
   [Frontend repository](https://github.com/Apluri/dev-academy-spring-2025-exercise-frontend)**

5. **Access Adminer** (for database management):

   Adminer will be available at http://localhost:8088.

   - System: PostgreSQL
   - Server: db
   - Username: academy
   - Password: academy
   - Database: electricity

### Running ESLint

To check your code with ESLint, run:

```bash
npm run lint
```

## Project Structure

- **src/**: Contains the source code for the application.
  - **controllers/**: Contains the controller logic for handling requests.
  - **routes/**: Contains the route definitions.
  - **services/**: Contains the service logic for interacting with the database.
  - **types/**: Contains TypeScript type definitions.
  - **utils/**: Contains utility functions and extensions.
- **prisma/**: Contains the Prisma schema and migration files.
- **Dockerfile**: Dockerfile for building the backend service.
- **Dockerfile.db**: Dockerfile for building the PostgreSQL database with initial data.
- **docker-compose.yml**: Docker Compose file for local development.
- **tsconfig.json**: TypeScript configuration file.
- **.eslintrc.json**: ESLint configuration file.
- **.env**: Environment variables file.

## Endpoints

- api/statistics/daily
  - Calculate daily electricity statistics from the electricitydata table
  - Handle pagination, sorting and filtering.

## Host info

The container runs in AWS EC2 instance.

## Tech / Frameworks used

- Node.js + TypeScript
- Express.js
- Prisma (ORM)
- Docker
