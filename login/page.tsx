"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdoraLogo } from "@/components/AdoraLogo";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      login,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Usuário/e-mail ou senha incorretos.");
      return;
    }

    router.push("/clube");
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#eef2f4] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <AdoraLogo className="text-[38px]" tone="dark" />
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-[#d8e0e4] bg-white p-6 shadow-sm"
        >
          <h1 className="text-center text-lg font-semibold text-[#2c3640]">
            Entrar no clube
          </h1>

          <div>
            <label htmlFor="login" className="mb-1 block text-sm text-[#5c6a73]">
              Usuário ou e-mail
            </label>
            <input
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="w-full rounded-lg border border-[#d8e0e4] px-3 py-2 outline-none focus:border-[#41525f]"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-[#5c6a73]">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-[#d8e0e4] px-3 py-2 outline-none focus:border-[#41525f]"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#41525f] px-4 py-2.5 font-medium text-[#f5f0af] transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center text-sm text-[#5c6a73]">
            Ainda não tem conta?{" "}
            <Link href="/registrar" className="font-medium text-[#41525f] underline">
              Criar conta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
