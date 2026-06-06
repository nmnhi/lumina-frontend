import background from "@/assets/images/background.png";
import { registerApi } from "@/features/auth/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Derive a username from the email (part before @) */
  const deriveUsername = (email: string) => email.split("@")[0].toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      setIsSubmitting(true);

      const username = deriveUsername(email);

      await registerApi({
        email,
        password,
        username,
        displayName: fullName,
      });

      // Register thành công → tự động đăng nhập
      toast.success("Đăng ký tài khoản thành công!");

      // Chuyển hướng sang trang login để user đăng nhập
      navigate("/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
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
                Join the future <br /> of social.
              </h1>
              <p className="text-base text-zinc-400 leading-relaxed font-medium">
                Experience a digital sanctuary designed for deep connections,
                vibrant communities, and seamless interactions.
              </p>
            </div>
          </div>

          <div className="relative z-10 text-sm text-zinc-500 font-medium tracking-wide">
            Join 2.5k+ members lighting up the world today.
          </div>
        </div>

        {/* 📝 CỘT PHẢI: ĐÃ ĐƯỢC LÀM TRONG SUỐT ĐỂ LỘ KÍNH MỜ GỐC */}
        <div className="flex flex-1 flex-col justify-between p-8 sm:p-14 md:p-16 lg:p-20 bg-transparent pt-20 md:pt-24">
          <div />

          {/* FORM BOX TRUNG TÂM */}
          <div className="mx-auto w-full max-w-[420px] space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Create your account
              </h2>
              <p className="text-base text-zinc-400">
                Start your journey into the vibrant minimalism.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* FULL NAME */}
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-zinc-300">
                  Full Name
                </label>
                <Input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-auto rounded-xl bg-white/3 border-white/10 py-3.5 px-4 text-base text-zinc-100 placeholder-zinc-600 transition focus:border-white/20 focus:bg-white/6 dark:bg-transparent dark:disabled:bg-transparent"
                />
              </div>

              {/* EMAIL ADDRESS */}
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-zinc-300">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-auto rounded-xl bg-white/3 border-white/10 py-3.5 px-4 text-base text-zinc-100 placeholder-zinc-600 transition focus:border-white/20 focus:bg-white/6 dark:bg-transparent dark:disabled:bg-transparent"
                />
              </div>

              {/* PASSWORD CHIA ĐÔI */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wide text-zinc-300">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-auto rounded-xl bg-white/3 border-white/10 py-3.5 pl-4 pr-10 text-base text-zinc-100 placeholder-zinc-600 transition focus:border-white/20 focus:bg-white/6 dark:bg-transparent dark:disabled:bg-transparent"
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

                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wide text-zinc-300">
                    Confirm Password
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-auto rounded-xl bg-white/3 border-white/10 py-3.5 px-4 text-base text-zinc-100 placeholder-zinc-600 transition focus:border-white/20 focus:bg-white/6 dark:bg-transparent dark:disabled:bg-transparent"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-lumina w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple py-4 text-base font-bold text-white shadow-lg disabled:opacity-50 mt-4 h-auto cursor-pointer hover:opacity-90"
              >
                <span>{isSubmitting ? "Creating..." : "Create Account"}</span>
                {!isSubmitting && <ArrowRight className="h-5 w-5" />}
              </Button>
            </form>

            {/* DIVIDER */}
            <div className="space-y-4 pt-2">
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-white/10"></div>
                <span className="absolute bg-[#09090b] px-3 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                  Or Continue With
                </span>
              </div>

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
                <span>Google</span>
              </Button>
            </div>

            {/* FOOTER SWITCH */}
            <p className="text-center text-sm text-zinc-400 pt-1">
              Already have an account?{" "}
              <Button
                variant="link"
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-zinc-100 hover:text-electric-blue transition cursor-pointer underline underline-offset-4 h-auto p-0"
              >
                Sign In
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
