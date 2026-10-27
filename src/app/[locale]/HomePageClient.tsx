"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Compass,
  ExternalLink,
  Eye,
  Lightbulb,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
// import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// Module section header: eyebrow + h2 + intro
function ModuleHeader({
  eyebrow,
  title,
  intro,
  linkData,
  locale,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  linkData: { url: string; title: string } | null | undefined;
  locale: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      <div
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4
                      bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                      text-xs uppercase tracking-wider text-[hsl(var(--nav-theme-light))]"
      >
        {eyebrow}
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
        <LinkedTitle linkData={linkData} locale={locale}>
          {title}
        </LinkedTitle>
      </h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

// Priority / type badge tone mapping (theme tokens only, no hardcoded hex)
function badgeTone(value: string): string {
  switch (value) {
    case "Essential":
    case "Severe":
    case "High Spoilers":
      return "bg-destructive/10 border-destructive/30 text-destructive";
    case "Recommended":
    case "Moderate":
    case "Moderate Spoilers":
      return "bg-orange-500/10 border-orange-500/30 text-orange-400";
    default:
      return "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]";
  }
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.divinefrequency.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Divine Frequency Wiki",
        description:
          "Explore Divine Frequency Wiki for horror FPS lore, weapons, enemies, builds, puzzles, updates, and Early Access guides for Abraxaes' surreal shooter.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Divine Frequency - Surreal Retro Horror FPS",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Divine Frequency Wiki",
        alternateName: "Divine Frequency",
        url: siteUrl,
        description:
          "Divine Frequency Wiki resource hub for horror FPS lore, weapons, enemies, builds, puzzles, and Early Access guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Divine Frequency Wiki - Surreal Retro Horror FPS",
        },
        sameAs: [
          "https://store.steampowered.com/app/2548880/Divine_Frequency/",
          "https://discord.gg/jnyFVSTgf3",
          "https://x.com/DFGame_",
          "https://www.youtube.com/@genghiskhan8942",
          "https://bsky.app/profile/dfgame.bsky.social",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Divine Frequency",
        gamePlatform: ["PC", "Steam"],
        applicationCategory: "Game",
        genre: ["Horror", "FPS", "RPG", "Psychological Horror", "Surreal", "Boomer Shooter"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/2548880/Divine_Frequency/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Divine Frequency - Early Access Release Date Trailer",
        description:
          "Official Divine Frequency trailer announcing the Early Access release date for Abraxaes' surreal retro horror FPS on Steam.",
        uploadDate: "2026-09-25",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/a6Ln4mXmSgI",
        url: "https://www.youtube.com/watch?v=a6Ln4mXmSgI",
      },
    ],
  };

  // Accordion states (secrets / roadmap)
  const [secretsExpanded, setSecretsExpanded] = useState<number | null>(null);
  const [roadmapExpanded, setRoadmapExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Tools Grid: 8 navigation cards -> module anchors (1:1)
  const moduleSectionIds = [
    "beginner-guide",
    "weapons-mods",
    "classes-builds",
    "walkthrough",
    "enemy-guide",
    "secrets-puzzles",
    "settings-requirements",
    "updates-roadmap",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      {/* <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x300"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300}
        />
      </aside> */}

      {/* 右侧广告容器 - Fixed 定位 */}
      {/* <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x600"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600}
        />
      </aside> */}

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/2548880/Divine_Frequency/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section（紧跟 Hero，容器上限 max-w-5xl） */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="a6Ln4mXmSgI"
              title="Divine Frequency - Early Access Release Date Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（视频区之后、Latest Updates 之前） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = moduleSectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section（紧接 Tools Grid 之下） */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.divineFrequencyBeginnerGuide.eyebrow}
            title={t.modules.divineFrequencyBeginnerGuide.title}
            intro={t.modules.divineFrequencyBeginnerGuide.intro}
            linkData={moduleLinkMap["divineFrequencyBeginnerGuide"]}
            locale={locale}
          />

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.divineFrequencyBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                      <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                        {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5 md:mb-2">
                        <h3 className="text-lg md:text-xl font-bold">
                          <LinkedTitle
                            linkData={
                              moduleLinkMap[
                                `divineFrequencyBeginnerGuide::steps::${index}`
                              ]
                            }
                            locale={locale}
                          >
                            {step.title}
                          </LinkedTitle>
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${badgeTone(step.priority)}`}
                        >
                          {step.priority}
                        </span>
                      </div>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-3 md:mt-4 space-y-1.5 md:pl-16">
                    {step.tips.map((tip: string, ti: number) => (
                      <li key={ti} className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Weapons and Mods */}
      <section
        id="weapons-mods"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.divineFrequencyWeaponsAndMods.eyebrow}
            title={t.modules.divineFrequencyWeaponsAndMods.title}
            intro={t.modules.divineFrequencyWeaponsAndMods.intro}
            linkData={moduleLinkMap["divineFrequencyWeaponsAndMods"]}
            locale={locale}
          />
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.08)] border-b border-border">
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    {t.modules.divineFrequencyWeaponsAndMods.tableHeaders.category}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.divineFrequencyWeaponsAndMods.tableHeaders.combatRole}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.divineFrequencyWeaponsAndMods.tableHeaders.bestUse}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.divineFrequencyWeaponsAndMods.tableHeaders.mainResource}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.divineFrequencyWeaponsAndMods.tableHeaders.upgradeFocus}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.divineFrequencyWeaponsAndMods.tableHeaders.recommendedPairing}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.divineFrequencyWeaponsAndMods.rows.map(
                  (row: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-border/60 last:border-0 align-top hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-4 font-semibold whitespace-nowrap text-[hsl(var(--nav-theme-light))]">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `divineFrequencyWeaponsAndMods::rows::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {row.category}
                        </LinkedTitle>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{row.combatRole}</td>
                      <td className="px-4 py-4 text-muted-foreground">{row.bestUse}</td>
                      <td className="px-4 py-4 text-muted-foreground">{row.mainResource}</td>
                      <td className="px-4 py-4 text-muted-foreground">{row.upgradeFocus}</td>
                      <td className="px-4 py-4 text-muted-foreground">{row.recommendedPairing}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 3: Classes and Builds */}
      <section id="classes-builds" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.divineFrequencyClassesAndBuilds.eyebrow}
            title={t.modules.divineFrequencyClassesAndBuilds.title}
            intro={t.modules.divineFrequencyClassesAndBuilds.intro}
            linkData={moduleLinkMap["divineFrequencyClassesAndBuilds"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.divineFrequencyClassesAndBuilds.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <h3 className="font-bold text-lg mb-1 text-[hsl(var(--nav-theme-light))]">
                    <LinkedTitle
                      linkData={
                        moduleLinkMap[
                          `divineFrequencyClassesAndBuilds::cards::${index}`
                        ]
                      }
                      locale={locale}
                    >
                      {card.name}
                    </LinkedTitle>
                  </h3>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-4">
                    {card.role}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">
                        Strengths
                      </p>
                      <ul className="space-y-1.5">
                        {card.strengths.map((s: string, si: number) => (
                          <li key={si} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">
                        Weaknesses
                      </p>
                      <ul className="space-y-1.5">
                        {card.weaknesses.map((w: string, wi: number) => (
                          <li key={wi} className="flex items-start gap-2">
                            <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm border-t border-border pt-4">
                    <p>
                      <span className="font-semibold">Beginner build: </span>
                      <span className="text-muted-foreground">{card.beginnerBuild}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Hybrid option: </span>
                      <span className="text-muted-foreground">{card.hybridOption}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Recommended for: </span>
                      <span className="text-muted-foreground">{card.recommendedFor}</span>
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 4: Walkthrough */}
      <section
        id="walkthrough"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.divineFrequencyWalkthrough.eyebrow}
            title={t.modules.divineFrequencyWalkthrough.title}
            intro={t.modules.divineFrequencyWalkthrough.intro}
            linkData={moduleLinkMap["divineFrequencyWalkthrough"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.divineFrequencyWalkthrough.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                      <Compass className="w-4 h-4" />
                      {step.section}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${badgeTone(step.type === "Essential" ? "Essential" : "Other")}`}
                    >
                      {step.type}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${badgeTone(step.spoilerLevel)}`}
                    >
                      {step.spoilerLevel}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5">
                    <LinkedTitle
                      linkData={
                        moduleLinkMap[`divineFrequencyWalkthrough::steps::${index}`]
                      }
                      locale={locale}
                    >
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  <ul className="space-y-1.5">
                    {step.navigationTips.map((tip: string, ti: number) => (
                      <li key={ti} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Enemy Guide */}
      <section id="enemy-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.divineFrequencyEnemyGuide.eyebrow}
            title={t.modules.divineFrequencyEnemyGuide.title}
            intro={t.modules.divineFrequencyEnemyGuide.intro}
            linkData={moduleLinkMap["divineFrequencyEnemyGuide"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.modules.divineFrequencyEnemyGuide.enemies.map(
              (enemy: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="mb-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${badgeTone(enemy.threatLevel)}`}
                    >
                      Threat: {enemy.threatLevel}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-3">
                    <LinkedTitle
                      linkData={
                        moduleLinkMap[`divineFrequencyEnemyGuide::enemies::${index}`]
                      }
                      locale={locale}
                    >
                      {enemy.name}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{enemy.attackPattern}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="font-semibold text-foreground">Weakness: </span>
                    {enemy.weakness}
                  </p>
                  <ul className="space-y-1.5 mb-4">
                    {enemy.tactics.map((tac: string, ti: number) => (
                      <li key={ti} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{tac}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">
                      Recommended Equipment
                    </p>
                    <ul className="space-y-1.5">
                      {enemy.equipment.map((eq: string, ei: number) => (
                        <li key={ei} className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{eq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-auto text-sm text-muted-foreground border-t border-border pt-4">
                    <AlertTriangle className="w-4 h-4 inline mr-1.5 -mt-0.5 text-[hsl(var(--nav-theme-light))]" />
                    {enemy.preparation}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Secrets and Puzzles */}
      <section
        id="secrets-puzzles"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.divineFrequencySecretsAndPuzzles.eyebrow}
            title={t.modules.divineFrequencySecretsAndPuzzles.title}
            intro={t.modules.divineFrequencySecretsAndPuzzles.intro}
            linkData={moduleLinkMap["divineFrequencySecretsAndPuzzles"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-2">
            {t.modules.divineFrequencySecretsAndPuzzles.entries.map(
              (entry: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() =>
                      setSecretsExpanded(secretsExpanded === index ? null : index)
                    }
                    className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{entry.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {entry.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${badgeTone(entry.spoilerLevel)}`}
                      >
                        {entry.spoilerLevel}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${secretsExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {secretsExpanded === index && (
                    <div className="px-5 pb-5 space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        <Eye className="w-4 h-4 inline mr-1.5 -mt-0.5 text-[hsl(var(--nav-theme-light))]" />
                        <span className="font-semibold text-foreground">Observation: </span>
                        {entry.observation}
                      </p>
                      <div className="border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] rounded-lg p-4 space-y-2">
                        <p className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">Hint 1: </span>
                            {entry.hint1}
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">Hint 2: </span>
                            {entry.hint2}
                          </span>
                        </p>
                      </div>
                      <p className="text-muted-foreground">
                        <Check className="w-4 h-4 inline mr-1.5 -mt-0.5 text-[hsl(var(--nav-theme-light))]" />
                        <span className="font-semibold text-foreground">Solution: </span>
                        {entry.solution}
                      </p>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Settings and System Requirements */}
      <section
        id="settings-requirements"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.divineFrequencySettingsAndSystemRequirements.eyebrow}
            title={t.modules.divineFrequencySettingsAndSystemRequirements.title}
            intro={t.modules.divineFrequencySettingsAndSystemRequirements.intro}
            linkData={moduleLinkMap["divineFrequencySettingsAndSystemRequirements"]}
            locale={locale}
          />
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.08)] border-b border-border">
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    {t.modules.divineFrequencySettingsAndSystemRequirements.tableHeaders.category}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.divineFrequencySettingsAndSystemRequirements.tableHeaders.setting}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.divineFrequencySettingsAndSystemRequirements.tableHeaders.recommendedUse}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {t.modules.divineFrequencySettingsAndSystemRequirements.tableHeaders.troubleshooting}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.divineFrequencySettingsAndSystemRequirements.rows.map(
                  (row: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-border/60 last:border-0 align-top hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-4 font-semibold whitespace-nowrap text-[hsl(var(--nav-theme-light))]">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `divineFrequencySettingsAndSystemRequirements::rows::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {row.category}
                        </LinkedTitle>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{row.setting}</td>
                      <td className="px-4 py-4 text-muted-foreground">{row.recommendedUse}</td>
                      <td className="px-4 py-4 text-muted-foreground">{row.troubleshooting}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 8: Updates and Early Access Roadmap */}
      <section
        id="updates-roadmap"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.divineFrequencyUpdatesAndRoadmap.eyebrow}
            title={t.modules.divineFrequencyUpdatesAndRoadmap.title}
            intro={t.modules.divineFrequencyUpdatesAndRoadmap.intro}
            linkData={moduleLinkMap["divineFrequencyUpdatesAndRoadmap"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-2">
            {t.modules.divineFrequencyUpdatesAndRoadmap.entries.map(
              (entry: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() =>
                      setRoadmapExpanded(roadmapExpanded === index ? null : index)
                    }
                    className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{entry.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {entry.status}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${roadmapExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {roadmapExpanded === index && (
                    <div className="px-5 pb-5 space-y-3 text-sm">
                      <ul className="space-y-1.5">
                        {entry.content.map((line: string, li: number) => (
                          <li key={li} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{line}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-muted-foreground border-t border-border pt-3">
                        <span className="font-semibold text-foreground">What it means for you: </span>
                        {entry.playerImpact}
                      </p>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/jnyFVSTgf3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/DFGame_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@genghiskhan8942"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://bsky.app/profile/dfgame.bsky.social"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.bluesky}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/2548880"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/2548880/Divine_Frequency/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
