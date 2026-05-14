import time
from playwright.sync_api import sync_playwright

def test_game_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the local server
        page.goto("http://localhost:8000")

        # Wait for the first content to appear
        page.wait_for_selector("#story p")

        print("Story started.")
        page.screenshot(path="verification/flow_0_start.png")

        # Click through some CONTINUE buttons
        # We need to be careful with multiple CONTINUE buttons (greyed out ones)
        for i in range(1, 5):
            continue_button = page.locator("p:not(.greyed).continue a")
            if continue_button.count() > 0:
                print(f"Clicking CONTINUE {i}...")
                continue_button.first.click()
                time.sleep(0.5) # Wait for animation
                page.screenshot(path=f"verification/flow_{i}_after_continue.png")
            else:
                print("No active CONTINUE button found.")
                break

        # Look for choices
        choices = page.locator("p:not(.greyed).choice a")
        if choices.count() > 0:
            print(f"Found {choices.count()} choices. Clicking the first one...")
            choices.first.click()
            time.sleep(0.5)
            page.screenshot(path="verification/flow_choice_clicked.png")

        # Verify if portrait is visible
        portrait = page.locator(".photoContainer")
        if portrait.is_visible():
            print("Portrait is visible.")
        else:
            print("Portrait is NOT visible (this might be expected if no PORTRAIT tag was provided recently).")

        browser.close()

if __name__ == "__main__":
    test_game_flow()
