import React from "react";
import { Link } from "react-router-dom";

const Unauthorized: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <h1 className="text-4xl font-bold text-red-600">403 - Unauthorized</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
        You do not have permission to access this page.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
