import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const websitePlanTool = createTool({
  id: "build_website_plan",
  description:
    "Generate a concise website plan including pages, routes, and key sections. Use when the user describes a site idea but hasn't provided a concrete structure yet.",
  inputSchema: z.object({
    topic: z
      .string()
      .describe(
        "Short description of the website (brand/business, goal, audience).",
      ),
    preferredStyle: z
      .string()
      .optional()
      .describe("Design direction keywords (e.g. modern, minimal, playful)."),
    numPages: z
      .number()
      .int()
      .min(1)
      .max(30)
      .optional()
      .describe("Approximate number of pages to plan for."),
  }),
  outputSchema: z.object({
    sitemap: z.array(
      z.object({
        route: z.string(),
        title: z.string(),
        purpose: z.string(),
        sections: z.array(z.string()),
      }),
    ),
    globalComponents: z.array(z.string()),
    designNotes: z.string(),
  }),
  async execute({ context }: { context: { topic: string; preferredStyle?: string; numPages?: number } }) {
    // This tool is deterministic and does not call external APIs.
    // It transforms the user's intent into a structured plan the agent can use
    // with MCP file/edit tools.
    const topic = String((context as any)?.topic ?? "Website").trim();
    const preferredStyle = String((context as any)?.preferredStyle ?? "").trim();
    const numPagesRaw = (context as any)?.numPages;
    const numPages =
      typeof numPagesRaw === "number" && Number.isInteger(numPagesRaw)
        ? Math.min(Math.max(numPagesRaw, 1), 30)
        : 5;

    const basePages = [
      {
        route: "/",
        title: "Home",
        purpose: "Hero value prop, primary CTA, social proof",
        sections: ["Hero", "Feature Highlights", "Testimonials", "CTA"],
      },
      {
        route: "/about",
        title: "About",
        purpose: "Company story, mission, team",
        sections: ["Mission", "Team", "Values"],
      },
      {
        route: "/contact",
        title: "Contact",
        purpose: "Contact form and company details",
        sections: ["Form", "Email/Phone", "Map"],
      },
      {
        route: "/pricing",
        title: "Pricing",
        purpose: "Plans, tiers, FAQs, conversion CTA",
        sections: ["Plans Table", "FAQs", "CTA"],
      },
      {
        route: "/blog",
        title: "Blog",
        purpose: "Content marketing hub",
        sections: ["Posts List", "Categories", "Subscribe"],
      },
    ];

    const sitemap = basePages.slice(0, numPages);

    const globalComponents = [
      "Navbar",
      "Footer",
      "ThemeProvider",
      "Button",
      "Card",
    ];

    const designNotes = [
      preferredStyle ? `Style: ${preferredStyle}` : null,
      `Topic: ${topic}`,
      "Focus on clarity and strong above-the-fold CTA",
      "Use semantic HTML, accessible colors, and responsive layout",
    ]
      .filter(Boolean)
      .join("\n");

    return { sitemap, globalComponents, designNotes };
  },
});


