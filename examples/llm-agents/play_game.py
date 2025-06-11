import asyncio
from playwright.async_api import async_playwright
from play_with_llm import play_with_llm


async def play_game(game, base_url, llm):
    """
    Interact with the game page using Playwright and Langchain

    Args:
        game: Game number
        base_url: Base URL of the application
        llm: LLM instance to use
    """
    url = f"{base_url}/?game={game}"
    print(f"Starting game {game} at {url}")

    async with async_playwright() as p:
        try:
            # Launch browser
            browser = await p.chromium.launch(headless=False)

            # Create new page
            page = await browser.new_page()
            await page.set_viewport_size({"width": 1280, "height": 720})
            await page.goto(url, wait_until="networkidle")

            # Wait for any dynamic content to load
            await asyncio.sleep(2)

            # Let LLM play
            await play_with_llm(page, llm, game)

            await asyncio.sleep(10)

        except Exception as error:
            print(f"Error: {error}")
            await asyncio.sleep(10)
        finally:
            if "browser" in locals():
                await browser.close()
