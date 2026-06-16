"use client";

import { useState, useEffect } from "react";
import WebsiteView from "./components/WebsiteView";
import { defaultContent, type SiteContent } from "./lib/content";

export default function Home() {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nail-salon-content");
      if (saved) setContent(JSON.parse(saved));
    } catch {}
  }, []);

  return <WebsiteView content={content} />;
}
