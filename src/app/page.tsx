import { CreateEventButton } from '@/components/CreateEventButton';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 px-2 pb-24 pt-4">
      <div className="whitespace-nowrap pt-6 text-4xl font-bold">Приветики =)</div>
      <CreateEventButton />
    </main>
  );
}
