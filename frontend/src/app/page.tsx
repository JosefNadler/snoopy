import Header from "@/components/Header";
import Board from "@/components/Board";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Board />
    </div>
  );
}
