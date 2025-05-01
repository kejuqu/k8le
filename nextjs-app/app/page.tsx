import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const modules = [
    {
      name: "Manage Products",
      href: "/products",
      description: "Click to manage products page",
    },
    {
      name: "Manage Shops",
      href: "/shops",
      description: "Click to manage shops page",
    },
  ];

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-purple-500">Hello World2</h1>

      <section className="flex gap-4 w-full justify-center">
        {modules.map((module) => (
          <Link key={module.name} href={module.href}>
            <Card className=" min-w-3xs">
              <CardHeader>
                <CardTitle>{module.name}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
