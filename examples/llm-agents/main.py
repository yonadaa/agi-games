import asyncio
from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from play_game import play_game

# Load environment variables
load_dotenv()


NUM_GAMES = 3


async def main():
    base_url = "http://127.0.0.1:8000"
    games = range(1, NUM_GAMES + 1)

    llms = [
        ChatAnthropic(
            model="claude-sonnet-4-20250514",
            max_tokens=5000,
            thinking={
                "type": "enabled",
                "budget_tokens": 1024,
            },
        ),
        ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-preview-04-17",
            thinking_budget=1024,
            include_thoughts=True,
        ),
    ]

    for llm in llms:
        for game in games:
            print(f"\n{'='*60}")
            print(f"Starting Game {game}")
            print(f"{'='*60}")

            try:
                await play_game(game=game, base_url=base_url, llm=llm)
            except Exception as e:
                print(f"Error playing game {game}: {e}")
                continue

            print(f"Completed Game {game}")

            # Add a small delay between games
            await asyncio.sleep(2)

    print(f"\n{'='*60}")
    print("All games completed!")
    print(f"{'='*60}")


if __name__ == "__main__":
    asyncio.run(main())
