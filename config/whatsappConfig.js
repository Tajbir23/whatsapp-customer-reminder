// WhatsApp Client Configuration
const whatsappConfig = {
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-software-rasterizer",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-skip-list",
      "--disable-features=site-per-process",
    ],
    timeout: 60000,
  },
  // WhatsApp Web version - important for stability
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/AdenRehana/AdenCache/main/AdenCache/wwebjs.json",
  },
};

module.exports = whatsappConfig;
