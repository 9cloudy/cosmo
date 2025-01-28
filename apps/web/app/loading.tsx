import Loader from "@repo/ui/components/loader";

export default function Loading({text}:{text?:string}) {
  return (
    <div className="w-full h-[90vh] flex justify-center flex-col gap-5 items-center">
      <Loader />
      {text?text:""}
    </div>
  );
}
