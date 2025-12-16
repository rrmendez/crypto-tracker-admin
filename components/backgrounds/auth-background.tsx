type Props = {
  children: React.ReactNode;
};

export function AuthBackground({ children }: Props) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden flex h-full min-h-dvh w-full flex-col items-center justify-center gap-4 px-4">
      {/* Large subtle radial gradients / blobs */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] rounded-full filter blur-3xl opacity-60 animate-blob"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, var(--primary-400), transparent 30%), radial-gradient(circle at 70% 70%, var(--primary-600), transparent 35%)",
        }}
      />

      <div
        className="absolute right-1/4 top-1/4 w-[700px] h-[700px] rounded-full filter blur-2xl opacity-50 animate-blob animation-delay-2000"
        style={{
          background:
            "radial-gradient(circle at 40% 30%, var(--primary-300), transparent 30%), radial-gradient(circle at 60% 70%, var(--primary-800), transparent 40%)",
        }}
      />

      <div
        className="absolute -left-40 bottom-10 w-[520px] h-[520px] rounded-full filter blur-2xl opacity-40 animate-blob animation-delay-4000"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, var(--primary-100), transparent 35%), radial-gradient(circle at 70% 70%, var(--primary-700), transparent 40%)",
        }}
      />

      {/* subtle grain overlay to add texture */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-5 bg-[url('/_static/noise.png')]" />

      {/* Fallback subtle linear background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[color:var(--primary-50)] to-[color:var(--primary-950)]" />

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate3d(0px, 0px, 0px) scale(1);
          }
          33% {
            transform: translate3d(30px, -20px, 0) scale(1.05);
          }
          66% {
            transform: translate3d(-20px, 30px, 0) scale(0.95);
          }
          100% {
            transform: translate3d(0px, 0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 14s infinite ease-in-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-blob {
            animation: none;
          }
        }
      `}</style>

      {children}
    </div>
  );
}
