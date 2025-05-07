export function TestComponent() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-blue-500 text-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold">React is working!</h1>
      <p className="text-xl text-blue-100">Tailwind CSS is working too!</p>
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100 transition-colors">
          Test Button
        </button>
        <span className="text-blue-200">Test text</span>
      </div>
    </div>
  );
}
