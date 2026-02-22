export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">UrbanEstate</h3>
            <p className="mt-2">Premium real estate services</p>
          </div>
          <div>
            <p>
              &copy; {new Date().getFullYear()} UrbanEstate. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
