const Formats = () => {
  return (
    <div className="max-w-3xl mx-auto pt-28 px-6 text-sm">
      <h1 className="text-2xl font-semibold mb-4">
        Supported Formats
      </h1>

      <ul className="list-disc pl-5 space-y-2">
        <li>360p (SD) - Fast download, smaller size</li>
        <li>720p (HD) - Balanced quality</li>
        <li>1080p (Full HD) - Best quality (if available)</li>
      </ul>
    </div>
  );
};

export default Formats;
