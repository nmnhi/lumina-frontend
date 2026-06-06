import background from "@/assets/images/background.png";
import { useAuth } from "@/features/auth/useAuth";
import { loginApi } from "@/features/auth/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsSubmitting(true);
      const res = await loginApi(email, password);
      // Backend returns { status, message, data: { user, accessToken } }
      const { user, accessToken } = res.data;
      login(accessToken, user);
      toast.success("Đăng nhập thành công!");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#070708] p-6 sm:p-10 md:p-16 font-sans select-none">
      {/* 🔮 TẤM CARD NGUYÊN KHỐI GLASSMORPHISM SIÊU THỰC */}
      <div className="glass-mac relative flex h-full max-h-[880px] w-full max-w-[1220px] overflow-hidden rounded-[28px]">
        {/* 🌌 CỘT TRÁI: BRANDING NỀN TRONG SUỐT TRÊN THẠCH ANH */}
        <div className="relative hidden w-[46%] flex-col justify-between p-12 lg:flex border-r border-white/10 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
            style={{ backgroundImage: `url(${background})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

          <div className="relative z-10 space-y-12">
            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/6 border border-white/15 shadow-inner">
                <div className="h-2.5 w-2.5 rounded-full bg-electric-blue animate-pulse" />
              </div>
              <span className="text-lg font-bold tracking-wide text-zinc-100">
                Lumina Social
              </span>
            </div>

            {/* TIÊU ĐỀ LỚN */}
            <div className="max-w-sm space-y-5">
              <h1 className="text-5xl font-black tracking-tight text-white leading-[1.15]">
                Lumina Social
              </h1>
              <p className="text-base text-zinc-400 leading-relaxed font-medium">
                Redesigning the digital horizon. Experience the next generation
                of social luxury.
              </p>
            </div>
          </div>

          <div className="relative z-10 text-sm text-zinc-500 font-medium tracking-wide">
            © 2026 Lumina Inc.
          </div>
        </div>

        {/* 📝 CỘT PHẢI: ĐÃ ĐƯỢC LÀM TRONG SUỐT ĐỂ LỘ KÍNH MỜ GỐC */}
        <div className="flex flex-1 flex-col justify-between p-8 sm:p-14 md:p-16 lg:p-20 bg-transparent pt-20 md:pt-24">
          <div />

          {/* FORM BOX TRUNG TÂM */}
          <div className="mx-auto w-full max-w-[420px] space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Welcome to Lumina
              </h2>
              <p className="text-base text-zinc-400">
                Experience the next generation of social luxury
              </p>
            </div>

            {/* SOCIAL LOGINS */}
            <div className="space-y-3">
              <Button
                variant="outline"
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border-white/10 bg-white/2 py-3.5 text-base font-medium text-white hover:bg-white/[0.07] h-auto cursor-pointer"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </Button>

              <Button
                variant="outline"
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border-white/10 bg-white/2 py-3.5 text-base font-medium text-white hover:bg-white/[0.07] h-auto cursor-pointer"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.52-.64.74-1.2 1.88-1.05 3 .11 0 2.34-.65 3-1.46z" />
                </svg>
                <span>Continue with Apple</span>
              </Button>
            </div>

            {/* DIVIDER */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-white/10"></div>
              <span className="absolute bg-[#09090b] px-3 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Or Email
              </span>
            </div>

            {/* INPUT FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-zinc-300">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-auto rounded-xl bg-white/3 border-white/10 py-3.5 px-4 text-base text-zinc-100 placeholder-zinc-600 transition focus:border-white/20 focus:bg-white/6 dark:bg-transparent dark:disabled:bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold tracking-wide text-zinc-300">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-cyber-purple hover:text-[#b366ff] font-medium transition"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-auto rounded-xl bg-white/3 border-white/10 py-3.5 pl-4 pr-11 text-base text-zinc-100 placeholder-zinc-600 transition focus:border-white/20 focus:bg-white/6 dark:bg-transparent dark:disabled:bg-transparent"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 size-auto p-2 text-zinc-500 hover:text-zinc-300 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-lumina w-full rounded-xl bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple py-4 text-base font-bold text-white shadow-lg disabled:opacity-50 mt-4 h-auto cursor-pointer hover:opacity-90"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* FOOTER SWITCH */}
            <p className="text-center text-sm text-zinc-400 pt-1">
              Don't have an account?{" "}
              <Button
                variant="link"
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-zinc-100 hover:text-electric-blue transition underline underline-offset-4 h-auto p-0 cursor-pointer"
              >
                Sign Up
              </Button>
            </p>
          </div>

          <footer className="flex items-center justify-between text-xs text-zinc-600 font-medium pt-4">
            <div className="flex gap-4">
              <a href="#" className="hover:text-zinc-400 transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-zinc-400 transition">
                Terms of Service
              </a>
            </div>
            <span>© 2026 Lumina Social.</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
