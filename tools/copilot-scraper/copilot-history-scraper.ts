import { chromium, Browser, Page, BrowserContext } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CopilotConversation {
  id: string;
  title: string;
  messages: CopilotMessage[];
  scrapedAt: string;
}

async function scrapeCopilotHistory(maxConversations: number = 2): Promise<CopilotConversation[]> {
  // Use a separate profile directory for Edge with debugging
  const edgeProfileDir = path.join(__dirname, '.edge-profile');

  console.log('Launching Edge with Windows SSO support...');
  console.log(`Profile: ${edgeProfileDir}\n`);

  // Launch Edge - it has native Windows SSO, no extension needed
  const context: BrowserContext = await chromium.launchPersistentContext(edgeProfileDir, {
    headless: false,
    channel: 'msedge',
    slowMo: 300,
    args: [
      '--start-maximized',
      '--auth-server-allowlist=*.microsoft.com,*.microsoftonline.com',
      '--auth-negotiate-delegate-allowlist=*.microsoft.com,*.microsoftonline.com',
    ],
    viewport: null,
  });

  const page: Page = context.pages()[0] || await context.newPage();
  const conversations: CopilotConversation[] = [];

  try {
    console.log('Navigating to M365 Copilot...');
    await page.goto('https://m365.cloud.microsoft/chat', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);

    if (currentUrl.includes('login.microsoftonline.com') || currentUrl.includes('login.live.com')) {
      console.log('\n========================================');
      console.log('AUTHENTICATION REQUIRED');
      console.log('Complete login in the Edge window.');
      console.log('Windows SSO may auto-fill your credentials.');
      console.log('Waiting up to 3 minutes...');
      console.log('========================================\n');

      await page.waitForURL('**/m365.cloud.microsoft/**', { timeout: 180000 });
      console.log('Authentication successful!');
    }

    // Wait for page to settle - use longer timeout for complex SPA
    try {
      await page.waitForLoadState('networkidle', { timeout: 60000 });
    } catch (e) {
      console.log('Network not fully idle, continuing anyway...');
    }
    await page.waitForTimeout(8000);

    console.log('Looking for conversation list...');
    await page.screenshot({ path: 'copilot-initial.png', fullPage: true });

    // Find chat items specifically - they have aria-posinset and aria-setsize attributes
    // and are in the "Chats" section with draggable="true"
    const chatSelector = '[class*="SplitCopilotNavItem"][draggable="true"][aria-posinset]';

    let conversationElements = await page.$$(chatSelector);
    console.log(`Found ${conversationElements.length} chat items with selector: ${chatSelector}`);

    if (conversationElements.length === 0) {
      // Fallback: find items by looking for specific patterns
      const allNavItems = await page.$$('[class*="SplitCopilotNavItem"]');
      console.log(`Found ${allNavItems.length} total nav items`);

      // Filter to only draggable items (chat conversations are draggable)
      conversationElements = [];
      for (const item of allNavItems) {
        const draggable = await item.getAttribute('draggable');
        if (draggable === 'true') {
          conversationElements.push(item);
        }
      }
      console.log(`Filtered to ${conversationElements.length} draggable items (chats)`);
    }

    if (conversationElements.length === 0) {
      console.log('Selectors failed. Saving debug info...');
      await page.screenshot({ path: 'copilot-debug.png', fullPage: true });
      const html = await page.content();
      fs.writeFileSync('copilot-debug.html', html);
      console.log('Saved copilot-debug.png and copilot-debug.html');
      console.log('\nLeaving browser open. Inspect the page and press Ctrl+C when done.');
      await page.waitForTimeout(300000);
      throw new Error('Could not find conversations');
    }

    const numToScrape = Math.min(maxConversations, conversationElements.length);
    console.log(`\nScraping ${numToScrape} conversations...`);

    for (let i = 0; i < numToScrape; i++) {
      try {
        // Re-query chat items
        conversationElements = await page.$$('[class*="SplitCopilotNavItem"][draggable="true"]');

        const convElement = conversationElements[i];
        if (!convElement) continue;

        const title = await convElement.textContent() || `Conversation ${i + 1}`;
        console.log(`\n[${i + 1}/${numToScrape}] Opening: "${title.trim().substring(0, 50)}"`);

        await convElement.click();
        await page.waitForTimeout(3000);
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: `copilot-conv-${i + 1}.png`, fullPage: true });

        const messageSelectors = [
          '[data-testid="message"]',
          '[class*="MessageContainer"]',
          '[class*="ChatMessage"]',
          '[class*="message-content"]',
          '[class*="turn-container"]',
          '[role="article"]',
        ];

        let messageElements: any[] = [];
        for (const selector of messageSelectors) {
          messageElements = await page.$$(selector);
          if (messageElements.length > 0) {
            console.log(`Found ${messageElements.length} messages: ${selector}`);
            break;
          }
        }

        const messages: CopilotMessage[] = [];

        for (const msgElement of messageElements) {
          try {
            const content = await msgElement.textContent();
            if (!content || content.trim().length === 0) continue;

            const classList = await msgElement.getAttribute('class') || '';
            const dataRole = await msgElement.getAttribute('data-role') || '';
            const outerHtml = await msgElement.evaluate((el: Element) => el.outerHTML.substring(0, 1000));
            const indicators = [classList, dataRole, outerHtml].join(' ').toLowerCase();

            let role: 'user' | 'assistant' = 'assistant';
            if (indicators.includes('user') || indicators.includes('human') || indicators.includes('prompt')) {
              role = 'user';
            }

            messages.push({ role, content: content.trim() });
          } catch (e) {}
        }

        conversations.push({
          id: `conv-${i + 1}`,
          title: title.trim(),
          messages,
          scrapedAt: new Date().toISOString(),
        });

        console.log(`Extracted ${messages.length} messages`);

      } catch (convError) {
        console.error(`Error on conversation ${i + 1}:`, convError);
      }
    }

  } catch (error) {
    console.error('Error:', error);
    try {
      await page.screenshot({ path: 'copilot-error.png', fullPage: true });
    } catch (e) {}
  } finally {
    console.log('\nClosing Edge...');
    await context.close();
  }

  return conversations;
}

async function main() {
  // Parse command line args for max conversations
  const args = process.argv.slice(2);
  let maxConversations = 10; // Default to 10

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--max' && args[i + 1]) {
      maxConversations = parseInt(args[i + 1], 10);
    }
  }

  console.log('='.repeat(50));
  console.log('M365 Copilot History Scraper (Edge)');
  console.log('='.repeat(50));
  console.log('\nUsing Edge with native Windows SSO.');
  console.log(`Scraping up to ${maxConversations} conversations.\n`);

  const conversations = await scrapeCopilotHistory(maxConversations);

  fs.writeFileSync('copilot-history.json', JSON.stringify(conversations, null, 2));
  console.log(`\nSaved ${conversations.length} conversations to copilot-history.json`);

  console.log('\n--- SUMMARY ---\n');
  for (const conv of conversations) {
    console.log(`Conversation: ${conv.title.substring(0, 60)}`);
    console.log(`  Messages: ${conv.messages.length}`);
    const userMessages = conv.messages.filter(m => m.role === 'user');
    if (userMessages.length > 0) {
      console.log(`  Your prompts:`);
      userMessages.forEach((m, idx) => {
        console.log(`    [${idx + 1}] ${m.content.substring(0, 80)}...`);
      });
    }
    console.log('');
  }
}

main().catch(console.error);
