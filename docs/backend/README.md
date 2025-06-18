# Backend Documentation

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- Oracle Database
- TypeScript
- tsyringe (for dependency injection)

### Installation
```bash
cd backend
npm install
```

### Environment Variables
Create a `.env` file in the backend directory with the following variables:
```env
PORT=4000
NODE_ENV=development
ORACLE_USER=your_username
ORACLE_PASSWORD=your_password
ORACLE_CONNECT_STRING=your_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the Application
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Project Structure
```
backend/src/
├── application/          # Application layer
│   ├── dto/             # Data Transfer Objects
│   └── use-cases/       # Use cases
├── domain/              # Domain layer
│   ├── entities/        # Domain entities
│   └── repositories/    # Repository interfaces
├── infrastructure/      # Infrastructure layer
│   └── repositories/    # Repository implementations
├── interfaces/          # Interface layer
│   └── rest-api/        # REST API controllers
└── routes/              # Route definitions
```

## Important Notes

### PowerShell Issues
When working with PowerShell on Windows, you may encounter issues with long commands or special characters. Here are some solutions:

1. **Use shorter commands**: Break long commands into multiple lines
2. **Use forward slashes**: Instead of backslashes in paths
3. **Use quotes**: Wrap paths with spaces in quotes
4. **Use xcopy instead of cp**: For file operations
5. **Use robocopy**: For more complex file operations

Example of safe commands:
```powershell
# Instead of
cp -r backend/src/application/dto/van-chuyen backend/src/backup/van-chuyen/current/

# Use
xcopy /E /I "backend\src\application\dto\van-chuyen" "backend\src\backup\van-chuyen\current\application\dto\van-chuyen"

# Or use robocopy for more complex operations
robocopy "backend\src\application\dto\van-chuyen" "backend\src\backup\van-chuyen\current\application\dto\van-chuyen" /E
```

### Backup and Restore
When backing up or restoring files:
1. Create backup directories first
2. Use xcopy or robocopy instead of cp
3. Use quotes around paths
4. Break long commands into multiple lines

Example:
```powershell
# Create backup directory
mkdir "backend\src\backup\van-chuyen\current"

# Copy files
xcopy /E /I "backend\src\application\dto\van-chuyen" "backend\src\backup\van-chuyen\current\application\dto\van-chuyen"
xcopy /E /I "backend\src\application\services\van-chuyen" "backend\src\backup\van-chuyen\current\application\services\van-chuyen"
```

## API Documentation
API documentation is available at `/api-docs` when running the application.

## Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment
1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Troubleshooting

### Common Issues
1. **PowerShell Command Issues**
   - Use xcopy instead of cp
   - Use quotes around paths
   - Break long commands into multiple lines
   - Use forward slashes in paths

2. **Database Connection Issues**
   - Check Oracle connection string
   - Verify credentials
   - Check network connectivity

3. **TypeScript Compilation Issues**
   - Run `npm run build` to see detailed errors
   - Check tsconfig.json settings
   - Verify all dependencies are installed

### Getting Help
If you encounter any issues:
1. Check the error message
2. Look for similar issues in the documentation
3. Check the console output
4. Contact the development team 