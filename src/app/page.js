'use client'
import GameMenu from '@/components/GameMenu'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-cyan-200">
      <main className="relative z-10">
        <GameMenu />
      </main>
    </div>
  );
}