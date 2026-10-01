import { createFileRoute } from "@tanstack/react-router";
import { NumberLab } from "@/components/number-lab";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <NumberLab />;
}
