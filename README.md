# Clarivue

See clearly into PDFs by extracting meaning from text.

Clarivue is a web application that allows you to chat with your PDF documents. Upload a PDF, and our AI-powered chat interface will help you extract information, answer questions, and understand the content of your documents.

## Features

*   **PDF Upload:** Upload your PDF documents to the application.
*   **AI-Powered Chat:** Chat with your PDFs using a simple and intuitive interface.
*   **Authentication:** Secure user authentication using Clerk.
*   **Document Management:** View and manage your uploaded documents.
*   **Responsive Design:** The application is designed to work on all devices.

## Technologies Used

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) - React framework for building user interfaces.
    *   [React](https://reactjs.org/) - JavaScript library for building user interfaces.
    *   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
    *   [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS.
    *   [Lucide React](https://lucide.dev/) - A simply beautiful open-source icon set.
*   **Backend:**
    *   [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - For creating API endpoints.
    *   [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript.
    *   [PostgreSQL](https://www.postgresql.org/) - A powerful, open source object-relational database system.
*   **AI & Machine Learning:**
    *   [LangChain](https://js.langchain.com/) - A framework for developing applications powered by language models.
    *   [Pinecone](https://www.pinecone.io/) - A vector database for similarity search.
    *   [Hugging Face](https://huggingface.co/) - A platform for building, training, and deploying state-of-the-art ML models.
*   **Authentication:**
    *   [Clerk](https://clerk.com/) - User management and authentication platform.
*   **File Storage:**
    *   [Cloudinary](https://cloudinary.com/) - Cloud-based image and video management service.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v20 or later)
*   [npm](https://www.npmjs.com/)
*   [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/clarivue.git
    cd clarivue
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the following environment variables:

    ```bash
    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=

    # Database
    DATABASE_URL=

    # Pinecone
    PINECONE_API_KEY=
    PINECONE_ENVIRONMENT=
    PINECONE_INDEX_NAME=

    # Cloudinary
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=

    # Hugging Face
    HUGGINGFACE_API_KEY=
    ```

4.  **Run the database migrations:**

    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
.
├── prisma/                # Prisma schema and client
├── public/                # Static assets
├── src/
│   ├── actions/           # Server-side actions
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── hooks/             # React hooks
│   └── lib/               # Utility functions
├── .env.example           # Example environment variables
├── next.config.ts         # Next.js configuration
├── package.json
└── tsconfig.json
```

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.