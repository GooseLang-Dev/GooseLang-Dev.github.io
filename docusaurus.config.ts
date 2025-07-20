import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "GooseLang Documentation",
  tagline: "The Ultimate Guide to GooseLang Development & Usage",
  favicon: "img/goose.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://gooselang.github.io",
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "GooseLang-Dev", // Usually your GitHub org/user name.
  projectName: "gooselang.github.io", // Usually your repo name.
  deploymentBranch: "gh-pages",
  trailingSlash: false,

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
    localeConfigs: {
      en: {
        label: "English",
        htmlLang: "en-GB",
      },
      zh: {
        label: "简体中文",
        htmlLang: "zh-Hans",
      },
    },
  },

  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "dev",
          routeBasePath: "dev",
          sidebarPath: require.resolve("./devSidebars.ts"),
          editUrl:
            "https://github.com/GooseLang-Dev/gooselang.github.io/tree/main/",
          editLocalizedFiles: true,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          changefreq: "daily",
          priority: 0.5,
          filename: "sitemap.xml",
        },
      },
    ],
  ],

  plugins: [
    "docusaurus-plugin-image-zoom",
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "guide",
        path: "guide",
        routeBasePath: "guide",
        sidebarPath: require.resolve("./guideSidebars.ts"),
        editUrl:
          "https://github.com/GooseLang-Dev/gooselang.github.io/tree/main/",
        editLocalizedFiles: true,
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      }
    ],
  ],

  // local search,npm install @easyops-cn/docusaurus-search-local --save，
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        // config
        hashed: true,
        language: ["en", "zh"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarPosition: "right",
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "GooseLang",
      logo: {
        alt: "GooseLang",
        src: "img/goose.png",
        href: "https://github.com/GooseLang-Dev",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "devSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          to: "/guide/intro",
          position: "left",
          label: "User Guide",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="-5 -5 30 30"><path fill="currentColor" d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436c.55.096.756-.233.756-.522c0-.262-.013-1.128-.013-2.049c-2.764.509-3.479-.674-3.699-1.292c-.124-.317-.66-1.293-1.127-1.554c-.385-.207-.936-.715-.014-.729c.866-.014 1.485.797 1.691 1.128c.99 1.663 2.571 1.196 3.204.907c.096-.715.385-1.196.701-1.471c-2.448-.275-5.005-1.224-5.005-5.432c0-1.196.426-2.186 1.128-2.956c-.111-.275-.496-1.402.11-2.915c0 0 .921-.288 3.024 1.128a10.2 10.2 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371c2.104-1.43 3.025-1.128 3.025-1.128c.605 1.513.221 2.64.111 2.915c.701.77 1.127 1.747 1.127 2.956c0 4.222-2.571 5.157-5.019 5.432c.399.344.743 1.004.743 2.035c0 1.471-.014 2.654-.014 3.025c0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11"/></svg>`,
          position: "right",
          href:'https://github.com/GooseLang-Dev/GooseLang-Dev.github.io',
          target: "_blank"
        }
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["csharp", "go"],
    },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    zoom: {
      selector: ".markdown img",
      background: {
        light: "var(--ifm-background-surface-color)",
        dark: "var(--ifm-background-surface-color)",
      },
      config: {
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
