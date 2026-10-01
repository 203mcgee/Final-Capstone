import React from "react";

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12  min-h-screen">
      {/* 
        Responsive Grid: 
        - 1 column on mobile (grid-cols-1)
        - 3 columns on desktop (lg:grid-cols-3)
      */}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

        {/* Card 1: Core Stack */}
        <section className="core-section border-2 border-gray-200 rounded-2xl p-8 bg-white text-black shadow-md flex flex-col justify-between min-h-[380px]">
          <div>
            <h2 className="text-2xl font-bold text-center text-black mb-6 pb-3 border-b border-gray-200">
              My Core Stack
            </h2>
            <ul className="space-y-4 text-base md:text-lg leading-relaxed text-black">
              <li>
                <strong className="text-blue-600">OS:</strong> Windows
              </li>
              <li>
                <strong className="text-blue-600">Database:</strong> MySQL
              </li>
              <li>
                <strong className="text-blue-600">Languages:</strong> C++, C, Python, JavaScript
              </li>
              <li>
                <strong className="text-blue-600">Frameworks:</strong> React.js, Node.js, Tailwind CSS
              </li>
            </ul>
          </div>
        </section>

        {/* Card 2: Developer Identity */}
        <section className="developer-identity-section border-2 border-gray-200 rounded-2xl p-8 bg-white text-black shadow-md flex flex-col min-h-[380px]">
          <h2 className="text-2xl font-bold text-center text-black mb-6 pb-3 border-b border-gray-200">
            Developer Identity
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-gray-800">
            A motivated <span className="span-change font-semibold text-black">Junior Web & Software Developer</span> focused on building responsive user interfaces, writing clean frontend logic, and working with modern full-stack web technologies.
          </p>
        </section>

        {/* Card 3: Metrics */}
        <section className="metrics-section border-2 border-gray-200 rounded-2xl p-8 bg-white text-black shadow-md flex flex-col min-h-[380px]">
          <h2 className="text-2xl font-bold text-center text-black mb-6 pb-3 border-b border-gray-200">
            Key Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4 text-center my-auto">
            <div className="p-5 bg-gray-100 rounded-xl">
              <span className="metric-change block text-3xl font-extrabold text-blue-600">10+</span>
              <span className="metric-change text-sm text-gray-700 font-medium">Projects Built</span>
            </div>
            <div className="p-5 bg-gray-100 rounded-xl">
              <span className="metric-change block text-3xl font-extrabold text-blue-600">4+</span>
              <span className="metric-change text-sm text-gray-700 font-medium">Languages</span>
            </div>
            <div className="p-5 bg-gray-100 rounded-xl">
              <span className="metric-change block text-3xl font-extrabold text-blue-600">100%</span>
              <span className="metric-change text-sm text-gray-700 font-medium">Responsive UI</span>
            </div>
            <div className="p-5 bg-gray-100 rounded-xl">
              <span className="metric-change block text-3xl font-extrabold text-blue-600">2026</span>
              <span className="metric-change text-sm text-gray-700 font-medium">Capstone Year</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}