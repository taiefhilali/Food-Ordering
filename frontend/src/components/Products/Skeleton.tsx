
const SkeletonProduct = () => {
  return (
    <div className="animate-pulse bg-white border border-gray-100 transition transform duration-700 hover:shadow-xl hover:scale-105 p-4 rounded-lg relative">
      <div className="w-64 h-48 bg-gray-200 mx-auto transform transition duration-300 hover:scale-105"> </div>
      <div className="flex flex-col items-center my-3 space-y-2">
        <div className="w-36 bg-gray-300 py-3"></div>
        <p className="w-72 bg-gray-200 py-1"></p>
        <div className="w-24 bg-gray-200 py-2"></div>
      </div>
    </div>
  );
}

export default SkeletonProduct;
