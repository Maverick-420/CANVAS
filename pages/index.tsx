import dynamic from "next/dynamic";

const DrawingApp = dynamic(() => import("../components/DrawingApp"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <DrawingApp />
    </div>
  );
}



