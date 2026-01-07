import Spinner from "./basic/spinner";

const LoadingScreen = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-blue-100">
      <Spinner size={120} />
      <p className="font-semibold text-2xl">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
