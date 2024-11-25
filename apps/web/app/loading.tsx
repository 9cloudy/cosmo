import Loader from "@repo/ui/components/loader";

export default function Loading() {
  return (
    <div className="w-full h-[90vh] flex justify-center items-center">
      <Loader />
    </div>
  );
}
