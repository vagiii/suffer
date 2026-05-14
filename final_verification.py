import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Desktop view
        await page.set_viewport_size({"width": 1280, "height": 720})
        await page.goto("http://localhost:8000")
        await asyncio.sleep(2)

        # Capture initial state
        await page.screenshot(path="verification/final_v2_desktop_start.png")
        print("Captured desktop start")

        # Click CONTINUE (the first one)
        # Using .first to avoid strict mode violation if multiple exist (though there should only be one now)
        continue_btn = page.locator("p:not(.greyed).continue a").first
        if await continue_btn.is_visible():
            await continue_btn.click()
            await asyncio.sleep(1)
            await page.screenshot(path="verification/final_v2_desktop_after_click.png")
            print("Captured after first click")

        # Mobile view
        await page.set_viewport_size({"width": 375, "height": 667})
        await page.reload()
        await asyncio.sleep(2)
        await page.screenshot(path="verification/final_v2_mobile.png")
        print("Captured mobile view")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
