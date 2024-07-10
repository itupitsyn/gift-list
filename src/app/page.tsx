import { Button } from 'flowbite-react';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 px-2 py-24">
      <div className="whitespace-nowrap text-4xl font-bold">Приветики =)</div>
      <Button gradientDuoTone="tealToLime" outline href="/event">
        Создать событие
      </Button>
    </main>
  );
}
