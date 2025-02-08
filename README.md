# Cosmo

Cosmo is a real-time chat application built with Next.js, Node.js, PostgreSQL and next-auth. implements one on one messaging with the help ws JavaScript library. ✨

## Features

- **Authentication**: user can sign up with credential, google or github.
- **User search**:  each user can search for other authorized users on the platform.
- **Requests**:  users can initiate and respond to request for adding them as friend.
- **Inbox**: texts automatically loaded after request is accepted.
- **Account dashboard**: a custom dashboard to manage friendships & change details.


## Getting Started

### Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/9cloudy/cosmo.git
cd cosmo
npm install
# with bun
bun install
```

### Running the Application

#### Start the WebSocket Server

```sh
cd apps/ws-api
# for node , tsc (typescript compiler is required)
tsc
node dist/index.js
# with bun
bun src/index.ts
```

#### Start the Frontend

```sh
cd apps/web
npm run dev
# with bun
bun run dev
```

## Project Structure

```
cosmo/
│── ws-api/            # WebSocket server (Node.js)
│── web/            # Next.js frontend and backend
│── packages/
│   ├── ui/            # Shared UI components
│   ├── eslint-config/ # Shared ESLint rules
│   ├── tsconfig/      # Shared TypeScript config
```

## Note
Backend will listen on port 8080 by default. 
- to make any change, move to corresponding folder.
```sh
cd apps/ws-api/src
```
- now change index.ts

---

[[Live link](https://cosmo-dun.vercel.app/)](https://cosmo-dun.vercel.app/)