"use client";

import React, { useState } from "react";
import PageMarginContainer from "@/components/ui/pageMarginContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Book,
  Code,
  FileCode,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Shield,
  Droplets,
  TrendingUp,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { ChainId, EXPLORERS } from "@/data/constants";

export default function DocsPage() {
  return (
    <PageMarginContainer>
      <div className="py-8 md:py-12">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-lg shadow-blue-500/30">
              <Book size={24} />
            </div>
            <h1 className="text-4xl font-bold text-gradient">Documentation</h1>
          </div>
          <p className="text-neutral-400 text-lg">
            Learn how to use KoralSwap and integrate with our smart contracts
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-3 mb-16 md:mb-20">
          <QuickLinkCard
            href="#overview"
            icon={<Book size={20} />}
            title="Overview"
            description="Learn about KoralSwap"
          />
          <QuickLinkCard
            href="#contracts"
            icon={<Code size={20} />}
            title="Smart Contracts"
            description="Contract addresses & ABIs"
          />
          <QuickLinkCard
            href="#guides"
            icon={<FileCode size={20} />}
            title="User Guides"
            description="How to use the platform"
          />
        </div>

        {/* Overview Section */}
        <section id="overview" className="mb-16 md:mb-20 scroll-mt-8">
          <Card variant="elevated" hover="glow">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Book className="text-blue-400" size={24} />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-neutral-300 mb-6 text-base leading-relaxed">
                KoralSwap is a next-generation decentralized exchange (DEX)
                built on Konet Chain, offering lightning-fast token swaps, deep
                liquidity provision, and sustainable yield opportunities.
              </p>

              <h3 className="text-xl font-bold text-white mt-8 mb-5">
                Key Features
              </h3>
              <div className="grid gap-4 md:gap-6 md:grid-cols-2 not-prose">
                <FeatureItem
                  icon={<Zap className="text-cyan-400" size={20} />}
                  title="V2 AMM Protocol"
                  description="Optimized constant product market maker for stable and volatile pairs"
                />
                <FeatureItem
                  icon={<Shield className="text-blue-400" size={20} />}
                  title="Secure & Audited"
                  description="Battle-tested smart contracts with comprehensive security audits"
                />
                <FeatureItem
                  icon={<Droplets className="text-cyan-400" size={20} />}
                  title="Liquidity Mining"
                  description="Earn trading fees and governance tokens as a liquidity provider"
                />
                <FeatureItem
                  icon={<TrendingUp className="text-primary-400" size={20} />}
                  title="Vote-Escrowed Governance"
                  description="Lock KORAL tokens to earn veKORAL and participate in protocol governance"
                />
              </div>

              <h3 className="text-xl font-bold text-white mt-10 mb-5">
                Protocol Architecture
              </h3>
              <p className="text-neutral-300 mb-6 text-base leading-relaxed">
                KoralSwap is built on a proven AMM design with the following
                core components:
              </p>
              <ul className="list-disc list-inside space-y-3 text-neutral-300">
                <li>
                  <strong className="text-white">V2 Factory:</strong> Creates
                  and manages liquidity pool pairs
                </li>
                <li>
                  <strong className="text-white">V2 Router:</strong> Handles
                  swap execution and liquidity operations
                </li>
                <li>
                  <strong className="text-white">Voter Contract:</strong>{" "}
                  Manages gauge voting and emissions distribution
                </li>
                <li>
                  <strong className="text-white">
                    veKORAL (Vote-Escrowed):
                  </strong>{" "}
                  Governance and fee-sharing mechanism
                </li>
                <li>
                  <strong className="text-white">Gauges:</strong> Distribute
                  rewards to liquidity providers
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Smart Contracts Section */}
        <section id="contracts" className="mb-16 md:mb-20 scroll-mt-8">
          <Card variant="elevated" hover="glow">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Code className="text-blue-400" size={24} />
                Smart Contracts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400 mb-8 text-base">
                Core smart contract addresses on Konet Mainnet (Chain ID: 17217)
              </p>

              <div className="space-y-4 md:space-y-5">
                <ContractAddress
                  name="V2 Factory"
                  address="0x025D63C45Baa11cFC1174a80139b29B891d693dC"
                  description="Creates and manages liquidity pool pairs"
                />
                <ContractAddress
                  name="V2 Router"
                  address="0x9CdC35e63C79c0e83f656929aD52CC9fc02EA3B4"
                  description="Handles token swaps and liquidity operations"
                />
                <ContractAddress
                  name="Voter"
                  address="0xAE5fEBDDCddE9bA917a163A7976B58B7edE07E53"
                  description="Manages gauge voting and emissions"
                />
                <ContractAddress
                  name="veKORAL (Vote-Escrowed)"
                  address="0xFF27C17C0A69B59251577799f0cefCEB97Eef83f"
                  description="Governance token for voting and fee sharing"
                />
                <ContractAddress
                  name="KORAL Token"
                  address="0x34D9a3E8B5Df4DEdB388EB14b7416f76BFFf4E6f"
                  description="Native protocol token"
                />
                <ContractAddress
                  name="Minter"
                  address="0x37DFf145c269cDC873faf9f4cc07ec1EF76F6eAc"
                  description="Controls token emissions"
                />
                <ContractAddress
                  name="Rewards Distributor"
                  address="0x2029D75a293D87011F79265c6cbFaFFA47A9406C"
                  description="Distributes trading fees to veKORAL holders"
                />
                <ContractAddress
                  name="KoralSwap API"
                  address="0xccb858BA90e6d4EFC41cB91d71f8E4f38C4aB8A8"
                  description="Helper contract for batch data queries"
                />
                <ContractAddress
                  name="WKON (Wrapped KON)"
                  address="0x3325Ca3cE314bcf8bA9242BDE800B3FAdb2C7045"
                  description="Wrapped native token"
                />
                <ContractAddress
                  name="Oracle"
                  address="0x5caa9d7fac6ef9ff9f50b95008ffb9f6299e8bcd"
                  description="Price feed oracle"
                />
              </div>

              <div className="mt-8 p-5 rounded-lg bg-blue-950/30 border border-blue-500/30">
                <p className="text-sm text-blue-300 leading-relaxed">
                  <strong>Developer Resources:</strong> View the full contract
                  source code and ABIs on{" "}
                  <a
                    href="https://github.com/KoralSwap/contracts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-200 inline-flex items-center gap-1"
                  >
                    GitHub
                    <ExternalLink size={14} />
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* User Guides Section */}
        <section id="guides" className="mb-16 md:mb-20 scroll-mt-8">
          <Card variant="elevated" hover="glow">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <FileCode className="text-blue-400" size={24} />
                User Guides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 md:space-y-8">
                <GuideSection
                  title="How to Swap Tokens"
                  steps={[
                    "Connect your Web3 wallet (e.g., MetaMask) to Konet Chain",
                    "Navigate to the Swap page",
                    "Select the tokens you want to swap",
                    "Enter the amount you want to trade",
                    "Review the exchange rate and slippage tolerance",
                    "Confirm the transaction in your wallet",
                  ]}
                  cta={{ text: "Go to Swap", href: "/swap" }}
                />

                <GuideSection
                  title="How to Provide Liquidity"
                  steps={[
                    "Navigate to the Liquidity page",
                    "Click 'Add Liquidity' and select your token pair",
                    "Choose between Stable or Volatile pool type",
                    "Enter the amounts for both tokens",
                    "Approve token spending if required",
                    "Confirm the liquidity deposit transaction",
                    "Optionally stake your LP tokens in a gauge to earn rewards",
                  ]}
                  cta={{
                    text: "Add Liquidity",
                    href: "/liquidity/add-liquidity?token0=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&token1=0x34D9a3E8B5Df4DEdB388EB14b7416f76BFFf4E6f&version=volatile",
                  }}
                />

                <GuideSection
                  title="Understanding Pool Types"
                  steps={[
                    "Stable Pools: Optimized for assets with similar values (e.g., USDC/USDT). Lower slippage for stable pairs.",
                    "Volatile Pools: Standard constant product (x*y=k) pools for uncorrelated assets (e.g., KON/KORAL).",
                  ]}
                />

                <GuideSection
                  title="Vote-Escrowed KORAL (veKORAL)"
                  steps={[
                    "Lock KORAL tokens for a period (1 week to 4 years)",
                    "Receive veKORAL NFT representing your lock position",
                    "Use veKORAL to vote on gauge emissions",
                    "Earn a share of protocol trading fees",
                    "Longer locks = more voting power and rewards",
                  ]}
                  cta={{ text: "Create Lock", href: "/lock" }}
                />

                <GuideSection
                  title="Gauge Voting & Incentives"
                  steps={[
                    "veKORAL holders vote on which pools receive KORAL emissions",
                    "Liquidity providers stake LP tokens in gauges to earn rewards",
                    "External protocols can add incentives (bribes) to attract votes",
                    "Rewards are distributed weekly based on gauge weights",
                  ]}
                  cta={{ text: "Vote on Gauges", href: "/voting" }}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Network Information */}
        <section id="network" className="mb-16 md:mb-20 scroll-mt-8">
          <Card variant="elevated" hover="glow">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="text-blue-400" size={24} />
                Network Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-400">
                    Network Name
                  </h3>
                  <p className="text-white">Konet Mainnet</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-400">
                    Chain ID
                  </h3>
                  <p className="text-white">{ChainId.KONET}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-400">
                    Explorer
                  </h3>
                  <a
                    href={EXPLORERS[ChainId.KONET]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                  >
                    {EXPLORERS[ChainId.KONET]}
                    <ExternalLink size={14} />
                  </a>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-400">
                    Native Currency
                  </h3>
                  <p className="text-white">KON</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-16 md:mb-20 scroll-mt-8">
          <Card variant="elevated" hover="glow">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Book className="text-blue-400" size={24} />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <FAQItem
                  question="What is KoralSwap?"
                  answer="KoralSwap is a decentralized exchange (DEX) on Konet Chain that allows users to swap tokens, provide liquidity, and earn rewards through an innovative vote-escrowed governance model."
                />
                <FAQItem
                  question="How do I earn rewards on KoralSwap?"
                  answer="You can earn rewards by: (1) Providing liquidity to pools and staking LP tokens in gauges, (2) Locking KORAL tokens to receive veKORAL and earn protocol fees, (3) Participating in governance and receiving incentives for your votes."
                />
                <FAQItem
                  question="What's the difference between KORAL and veKORAL?"
                  answer="KORAL is the protocol's native token that can be traded freely. veKORAL (vote-escrowed KORAL) is obtained by locking KORAL for a period of time and grants voting rights, fee sharing, and boost privileges."
                />
                <FAQItem
                  question="Are there any fees?"
                  answer="Trading fees vary by pool (typically 0.01% to 0.30%). A portion of trading fees goes to liquidity providers, and another portion is distributed to veKORAL holders."
                />
                <FAQItem
                  question="Is KoralSwap audited?"
                  answer="Yes, KoralSwap's smart contracts have been audited by leading security firms. The protocol is built on battle-tested code from established AMM designs."
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Support Section */}
        <section className="text-center mt-4 md:mt-8">
          <Card variant="gradient">
            <CardContent className="p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Need More Help?
              </h2>
              <p className="text-white/80 mb-8 text-base md:text-lg">
                Join our community or reach out to our support team
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://github.com/KoralSwap/contracts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto border-white/20 bg-white/10 text-white hover:bg-white/20"
                  >
                    <Code size={18} />
                    View on GitHub
                  </Button>
                </a>
                <Link href="/swap">
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto border-white/20 bg-white/10 text-white hover:bg-white/20"
                  >
                    Start Trading
                    <ChevronRight size={18} />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageMarginContainer>
  );
}

function QuickLinkCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <a href={href}>
      <Card
        variant="default"
        hover="both"
        className="group h-full cursor-pointer"
      >
        <CardContent className="p-6 md:p-7">
          <div className="mb-4 text-blue-400 transition-transform group-hover:scale-110">
            {icon}
          </div>
          <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </a>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 p-5 rounded-lg border border-neutral-900 bg-neutral-1000/50">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h4 className="font-semibold text-white mb-2">{title}</h4>
        <p className="text-sm text-neutral-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function ContractAddress({
  name,
  address,
  description,
}: {
  name: string;
  address: string;
  description?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 rounded-lg border border-neutral-900 bg-neutral-1000/50">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-base">{name}</h3>
          {description && (
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-300 hover:bg-neutral-800 transition-colors"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span className="text-xs">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span className="text-xs">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-sm text-blue-400 font-mono break-all">
          {address}
        </code>
        <a
          href={`${EXPLORERS[ChainId.KONET]}/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-neutral-400 hover:text-blue-400 transition-colors"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}

function GuideSection({
  title,
  steps,
  cta,
}: {
  title: string;
  steps: string[];
  cta?: { text: string; href: string };
}) {
  return (
    <div className="p-6 md:p-7 rounded-lg border border-neutral-900 bg-neutral-1000/30">
      <h3 className="text-lg font-bold text-white mb-5">{title}</h3>
      <ol className="space-y-3 mb-6">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-3 text-neutral-300">
            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold">
              {index + 1}
            </span>
            <span className="pt-0.5 leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
      {cta && (
        <Link href={cta.href}>
          <Button variant="primary" size="sm" className="mt-2">
            {cta.text}
            <ChevronRight size={16} />
          </Button>
        </Link>
      )}
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="pb-8 border-b border-neutral-900 last:border-0 last:pb-0">
      <h3 className="text-lg font-semibold text-white mb-3">{question}</h3>
      <p className="text-neutral-400 leading-relaxed">{answer}</p>
    </div>
  );
}
