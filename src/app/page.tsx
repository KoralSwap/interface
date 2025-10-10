"use client";

import { Button } from "@/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Droplets,
  BarChart3,
  Coins,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import reactor from "@/assets/reactor.svg";

export default function Page() {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <ConnectedHome />;
  }

  return <LandingPage />;
}

function LandingPage() {
  const { openConnectModal } = useConnectModal();
  const router = useRouter();

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 lg:px-8 pt-20 pb-32">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/30 px-4 py-2 backdrop-blur-sm">
            <Sparkles size={16} className="text-blue-400" />
            <span className="text-sm font-medium text-blue-300">
              Next-Gen AMM on Konet Chain
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight lg:text-7xl">
            Trade, Earn & Govern with{" "}
            <span className="text-gradient">KoralSwap</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-10 max-w-2xl text-lg text-neutral-300 lg:text-xl">
            Experience lightning-fast swaps, deep liquidity, and sustainable
            yields on Konet Chain&apos;s premier decentralized exchange.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => openConnectModal?.()}
              className="group relative overflow-hidden bg-gradient-primary px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
              <div className="absolute inset-0 bg-gradient-primary-hover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/swap")}
              className="border-2 border-neutral-800 bg-neutral-1000/50 px-8 py-6 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-neutral-950"
            >
              Explore Features
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-8 lg:grid-cols-4">
            <StatCard label="Total Value Locked" value="$125M+" />
            <StatCard label="24h Volume" value="$42M+" />
            <StatCard label="Active Users" value="50K+" />
            <StatCard label="Total Pools" value="200+" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 lg:px-8 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
            Why Choose <span className="text-gradient">KoralSwap</span>?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-400">
            Built for traders and liquidity providers
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Zap className="text-cyan-400" size={32} />}
            title="Lightning Fast"
            description="Execute trades in milliseconds with our optimized V2 smart contracts on Konet Chain."
          />
          <FeatureCard
            icon={<Shield className="text-blue-400" size={32} />}
            title="Secure & Audited"
            description="Battle-tested contracts audited by leading security firms to protect your assets."
          />
          <FeatureCard
            icon={<TrendingUp className="text-primary-400" size={32} />}
            title="Best Prices"
            description="Smart routing algorithms ensure you always get the best rates for your swaps."
          />
          <FeatureCard
            icon={<Droplets className="text-cyan-400" size={32} />}
            title="Deep Liquidity"
            description="Provide liquidity to earn trading fees and grow your portfolio."
          />
          <FeatureCard
            icon={<BarChart3 className="text-blue-400" size={32} />}
            title="Track Performance"
            description="Monitor your portfolio and liquidity positions with our comprehensive dashboard."
          />
          <FeatureCard
            icon={<Coins className="text-primary-400" size={32} />}
            title="Low Fees"
            description="Trade with minimal fees while earning rewards as a liquidity provider."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 lg:px-8 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
            Get Started in <span className="text-gradient">3 Steps</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <StepCard
            number="01"
            icon={<Coins size={40} />}
            title="Connect Wallet"
            description="Connect your Web3 wallet to start trading on KoralSwap instantly."
          />
          <StepCard
            number="02"
            icon={<BarChart3 size={40} />}
            title="Choose Action"
            description="Swap tokens, provide liquidity, or participate in governance."
          />
          <StepCard
            number="03"
            icon={<TrendingUp size={40} />}
            title="Start Earning"
            description="Earn fees, rewards, and governance tokens for your participation."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-mesh p-12 lg:p-20">
          <div className="relative z-10 text-center">
            <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
              Ready to Start Trading?
            </h2>
            <p className="mb-10 text-lg text-neutral-300">
              Join thousands of traders on Konet Chain&apos;s premier DEX
            </p>
            <Button
              size="lg"
              onClick={() => openConnectModal?.()}
              className="bg-gradient-primary px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40"
            >
              Connect Wallet Now
            </Button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-primary-500/10 to-cyan-400/10" />
        </div>
      </section>
    </div>
  );
}

function ConnectedHome() {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-mesh opacity-10" />
      </div>

      <section className="container mx-auto px-4 lg:px-8 py-20">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <Image
              src={reactor}
              alt="KoralSwap"
              width={80}
              height={80}
              className="animate-pulse-glow"
            />
          </div>
          <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-tight lg:text-6xl">
            Welcome to <span className="text-gradient">KoralSwap</span>
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-neutral-300">
            Your gateway to DeFi on Konet Chain
          </p>

          {/* Quick Actions */}
          <div className="grid w-full max-w-3xl gap-4 md:grid-cols-3">
            <QuickActionCard
              icon={<BarChart3 size={32} />}
              title="Swap Tokens"
              description="Trade any token instantly"
              onClick={() => router.push("/swap")}
            />
            <QuickActionCard
              icon={<Droplets size={32} />}
              title="Add Liquidity"
              description="Earn fees as an LP"
              onClick={() =>
                router.push(
                  "/liquidity/add-liquidity?token0=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&token1=0x34D9a3E8B5Df4DEdB388EB14b7416f76BFFf4E6f&version=volatile"
                )
              }
            />
            <QuickActionCard
              icon={<TrendingUp size={32} />}
              title="Dashboard"
              description="Track your portfolio"
              onClick={() => router.push("/dashboard")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-900 bg-neutral-1000/50 p-6 backdrop-blur-sm">
      <div className="text-3xl font-bold text-gradient">{value}</div>
      <div className="mt-2 text-sm text-neutral-400">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-neutral-900 bg-neutral-1000/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-neutral-950">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-950 transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-neutral-400">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border border-neutral-900 bg-neutral-1000/50 p-8 backdrop-blur-sm">
      <div className="absolute -top-4 left-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-xl font-bold text-white">
        {number}
      </div>
      <div className="mb-4 mt-4 text-blue-400">{icon}</div>
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-neutral-400">{description}</p>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-neutral-900 bg-neutral-1000/50 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-neutral-950 hover:scale-105"
    >
      <div className="mb-4 text-blue-400 transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mb-1 text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-neutral-400">{description}</p>
    </button>
  );
}
