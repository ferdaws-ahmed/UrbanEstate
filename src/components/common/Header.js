import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          UrbanEstate
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/properties"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                Properties
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
