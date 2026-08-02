import PageTurnSandbox from '@/components/test/PageTurnSandbox';

export const metadata = {
  title: 'PageTurn Sandbox | Ayush Tiwari',
  description: 'Isolated test sandbox for react-pageflip native paper bending engine',
};

export default function TestPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <PageTurnSandbox />
      </div>
    </main>
  );
}
