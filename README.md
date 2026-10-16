# Expense Tracker API

A REST API for personal expense tracking, built with Node.js, Express 5, and PostgreSQL. Supports user authentication with JWT, expense recording, category spending limits, and report generation.

## Features

- User registration and login with bcrypt password hashing and JWT authentication
- Add and list expense transactions
- Set per-category spending limits
- Generate spending reports
- Request validation with express-validator on every write endpoint

## Tech Stack

- **Runtime:** Node.js with Express 5
- **Database:** PostgreSQL (`pg`)
- **Auth:** JSON Web Tokens, bcrypt
- **Validation:** express-validator

## API Endpoints

### Auth (`/api/v1/auth`)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/signUp` | Register a new user |
| POST | `/login` | Log in and receive a JWT |

### Transactions (`/api/v1/transactions`) — requires `Authorization` header

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/add` | Add an expense |
| GET | `/transaction-list` | List transactions |
| POST | `/category-limits` | Set category spending limits |
| GET | `/report` | Get a spending report |

## Getting Started

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/Dasprakash-Sekar/expense-tracker.git
   cd expense-tracker
   npm install
   ```

2. Create a PostgreSQL database, then copy the environment template and fill in your values:

   ```bash
   cp .env.example .env
   ```

3. Start the server:

   ```bash
   npm run dev   # development (nodemon)
   npm start     # production
   ```

The API will be available at `http://localhost:<PORT>`.

## Project Structure

```
config/         Database connection
controllers/    Auth and transaction handlers
middleware/     JWT verification
routes/         Route definitions
schema/         express-validator schemas
utils/          Password hashing helpers
server.js       App entry point
```

## Related

A full-stack expense tracker built on this concept is live at [novatrax.novacodex.in](https://novatrax.novacodex.in).

## Author

**Dasprakash Sekar** — [dasprakashsekar.site](https://dasprakashsekar.site) · [LinkedIn](https://www.linkedin.com/in/dasprakashsekar) · [GitHub](https://github.com/Dasprakash-Sekar)

---

### ⭐ Support & Community
If you found this project helpful, please consider giving it a **Star** and **[following me on GitHub](https://github.com/Dasprakash-Sekar)** for more full-stack web applications and production-ready APIs!
