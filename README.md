# CulinaFlow: The Professional Chef's Digital Sous-Chef

[cloudflarebutton]

CulinaFlow is a comprehensive, cloud-native application designed to be the central command center for professional kitchens, especially in high-pressure hotel and catering environments. It digitizes and streamlines every aspect of kitchen management, from creative recipe development to rigorous HACCP compliance. The application is built on a modular architecture, allowing chefs and managers to seamlessly navigate between recipe creation, menu planning, buffet organization, production scheduling, inventory management, and hygiene logging.

The backend leverages Cloudflare's serverless platform for real-time data synchronization, robust user authentication, and scalable multi-tenant support. CulinaFlow aims to eliminate paperwork, reduce errors, and free up chefs to focus on what they do best: creating exceptional culinary experiences.

## Key Features

-   **Recipe Management:** Create, store, and categorize recipes with ingredients, nutritional analysis, allergens, and cost-per-serving.
-   **Menu Planner:** A drag-and-drop calendar interface for planning daily or weekly menus.
-   **Buffet Designer:** Specialized tool for planning buffet layouts, calculating quantities, and generating printable food labels.
-   **Production Schedule:** A Kanban-style board to assign and track prep tasks across different kitchen stations.
-   **HACCP Compliance:** Digital forms for daily hygiene checks, temperature logs, and other compliance tasks.
-   **Cloud-Native Backend:** Built on Cloudflare Workers and Durable Objects for a scalable, reliable, and fast backend.
-   **Modern UI/UX:** A clean, responsive, and intuitive interface inspired by tools like Notion and Asana, with light and dark modes.

## Technology Stack

-   **Frontend:** React, Vite, React Router, TypeScript
-   **UI:** Tailwind CSS, shadcn/ui, Framer Motion, Lucide Icons
-   **State Management:** Zustand
-   **Forms:** React Hook Form with Zod for validation
-   **Backend:** Cloudflare Workers, Hono
-   **Database:** Cloudflare Durable Objects
-   **Package Manager:** Bun

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/)
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) logged into your Cloudflare account.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/culina_flow.git
    cd culina_flow
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Run the development server:**
    The development server uses `wrangler` to run the backend worker and `vite` for the frontend, both managed concurrently.
    ```bash
    bun run dev
    ```

The application will be available at `http://localhost:3000`.

## Project Structure

-   `src/`: Contains the frontend React application code.
    -   `pages/`: Top-level page components for each route.
    -   `components/`: Reusable UI components, including shadcn/ui components.
    -   `lib/`: Utility functions and API client.
    -   `hooks/`: Custom React hooks.
-   `worker/`: Contains the Cloudflare Worker backend code.
    -   `index.ts`: The worker entry point.
    -   `user-routes.ts`: API route definitions.
    -   `entities.ts`: Durable Object entity definitions.
-   `shared/`: Contains TypeScript types and mock data shared between the frontend and backend.

## Development

During development, `bun run dev` starts a local server that proxies requests to the Vite dev server for the frontend and the Wrangler dev server for the backend API. This provides a seamless experience with hot-reloading for the frontend.

-   **Adding API Routes:** New backend endpoints should be added in `worker/user-routes.ts`.
-   **Defining Data Structures:** Shared types between the frontend and backend must be defined in `shared/types.ts`.
-   **Creating UI Components:** Leverage the pre-installed `shadcn/ui` components from `src/components/ui` whenever possible to maintain UI consistency.

## Available Scripts

-   `bun run dev`: Starts the local development server.
-   `bun run build`: Builds the frontend application for production.
-   `bun run deploy`: Deploys the application to Cloudflare Workers.
-   `bun run lint`: Lints the codebase.

## Deployment

This project is designed for easy deployment to the Cloudflare network.

1.  **Build the application:**
    ```bash
    bun run build
    ```

2.  **Deploy the worker:**
    Make sure you have authenticated with Wrangler CLI (`wrangler login`).
    ```bash
    bun run deploy
    ```

This command will build the frontend, bundle the worker, and deploy both to your Cloudflare account.

[cloudflarebutton]

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.