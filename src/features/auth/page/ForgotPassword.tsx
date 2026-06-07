import background from "@/assets/images/background.png";
import { forgotPasswordApi } from "@/features/auth/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Send } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      await forgotPasswordApi(email);
      setSent(true);
      toast.success("Email khôi phục đã được gửi! Vui lòng kiểm tra hộp thư.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#070708] p-6 sm:p-10 md:p-16 font-sans select-none">
      <div className="glass-mac relative flex h-full max-h-[880px] w-full max-w-[1220px] overflow-hidden rounded-[28px]">
        {/* LEFT COLUMN */}
        <div className="relative hidden w-[46%] flex-col justify-between p-12 lg:flex border-r border-white/10 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
            style={{ backgroundImage: `url(${background})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

          <div className="relative z-10 space-y-12">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/6 border border-white/15 shadow-inner">
                <div className="h-2.5 w-2.5 rounded-full bg-electric-blue animate-pulse" />
              </div>
              <span className="text-lg font-bold tracking-wide text-zinc-100">
                Lumina Social
              </span>
            </div>

            <div className="max-w-sm space-y-5">
              <h1 className="text-5xl font-black tracking-tight text-white leading-[1.15]">
                Forgot Password
              </h1>
              <p className="text-base text-zinc-400 leading-relaxed font-medium">
                We'll send you a recovery link to reset your password.
              </p>
            </div>
          </div>

          <div className="relative z-10 text-sm text-zinc-500 font-medium tracking-wide">
            © 2026 Lumina Inc.
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-1 flex-col justify-between p-8 sm:p-14 md:p-16 lg:p-20 bg-transparent pt-20 md:pt-24">
          <div />

          <div className="mx-auto w-full max-w-[420px] space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Reset your password
              </h2>
              <p className="text-base text-zinc-400">
                Enter the email address linked to your account and we'll send you a recovery link.
              </p>
            </div>

            {sent ? (
              <div className="space-y-6">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                      <Send className="h-6 w-6 text-emerald-400" />
                    </div>
                  </div>
                  <p className="text-base font-semibold text-zinc-100">Check your inbox</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    We've sent a password recovery link to{" "}
                    <span className="font-medium text-zinc-200">{email}</span>.
                    The link expires in 15 minutes.
                  </p>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate("/login")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-white/10 bg-white/2 py-3.5 text-base font-medium text-zinc-200 hover:bg-white/[0.07] h-auto cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Button>
              </div>
            ) : (
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

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-lumina w-full rounded-xl bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple py-4 text-base font-bold text-white shadow-lg disabled:opacity-50 mt-4 h-auto cursor-pointer hover:opacity-90"
                >
                  {isSubmitting ? "Sending..." : "Send Recovery Link"}
                </Button>
              </form>
            )}

            <p className="text-center text-sm text-zinc-400 pt-1">
              Remember your password?{" "}
              <Button
                variant="link"
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-zinc-100 hover:text-electric-blue transition underline underline-offset-4 h-auto p-0 cursor-pointer"
              >
                Sign In
              </Button>
            </p>
          </div>

          <footer className="flex items-center justify-between text-xs text-zinc-600 font-medium pt-4">
            <div className="flex gap-4">
              <a href="#" className="hover:text-zinc-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-400 transition">Terms of Service</a>
            </div>
            <span>© 2026 Lumina Social.</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
