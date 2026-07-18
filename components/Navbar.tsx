import Link from "next/link";
import { auth } from "@/auth";
import { AdoraLogo } from "./AdoraLogo";
import { SignOutButton } from "./SignOutButton";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 border-b border-[#334049] bg-[#41525f]/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <AdoraLogo className="text-[22px]" tone="light" />
        </Link>

        <nav className="flex items-center gap-4 text-sm text-[#e7ecef]">
          <Link href="/clube" className="hover:text-[#f5f0af]">
            Clube do livro
          </Link>
          {session?.user ? (
            <>
              <Link
                href={`/perfil/${session.user.username}`}
                className="hidden hover:text-[#f5f0af] sm:inline"
              >
                @{session.user.username}
              </Link>
              <SignOutButton className="rounded-full border border-[#f5f0af]/50 px-3 py-1 text-[#f5f0af] transition hover:bg-[#f5f0af]/10" />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-[#f5f0af]/50 px-3 py-1 transition hover:bg-[#f5f0af]/10"
              >
                Entrar
              </Link>
              <Link
                href="/registrar"
                className="rounded-full bg-[#f5f0af] px-3 py-1 font-medium text-[#41525f] transition hover:opacity-90"
              >
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
