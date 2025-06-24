'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Deployment Test</h1>
        <p className="text-xl">Version: 1.0.2</p>
        <p className="text-lg mt-4">Timestamp: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
