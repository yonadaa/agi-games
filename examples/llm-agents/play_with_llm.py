import base64
import datetime
import json
import os
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent
from playwright.async_api import Page
from PIL import Image
import io


def create_log_file(game_id, llm):
    # Replace slashes and special characters to avoid naming issues
    model_clean = llm.model.replace("/", "-").replace(":", "-")

    # Create logs directory for this game and model
    logs_dir = f"logs/game-{game_id}_{model_clean}"
    os.makedirs(logs_dir, exist_ok=True)

    # Create timestamped log file
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = os.path.join(logs_dir, f"{timestamp}.txt")

    return log_file


async def play_with_llm(page: Page, llm, game_id):
    """
    Play games with any LLM as a LangGraph agent.

    Args:
        page: Playwright page object
        llm: Any LangChain-compatible LLM instance (ChatAnthropic, ChatGoogleGenerativeAI, etc.)
        game_id: Game ID to include in log filename
    """

    @tool
    async def pressKey(key: str):
        """Press the intended [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)"""
        await page.keyboard.press(key)
        return f"you executed {key}"

    @tool
    async def screenshot():
        """Take a screenshot of the page"""
        screenshot = await page.screenshot(type="png")

        # Resize image to decrease token usage
        image = Image.open(io.BytesIO(screenshot))
        image = image.resize(
            (image.width // 2, image.height // 2), Image.Resampling.LANCZOS
        )
        buffer = io.BytesIO()
        image.save(buffer, "PNG")
        resized_bytes = buffer.getvalue()

        screenshot_base64 = base64.b64encode(resized_bytes).decode("utf-8")
        return [
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/png;base64,{screenshot_base64}"},
            }
        ]

    log_file = create_log_file(game_id, llm)

    try:
        tools = [pressKey, screenshot]
        agent = create_react_agent(llm, tools)

        prompt = """You are playing a game. Experiment with the tools to figure what the game is and how to win. You have not succeeded until the screen says "you win", so be sure to check this."""

        input_message = {"role": "user", "content": [{"type": "text", "text": prompt}]}

        with open(log_file, "w", encoding="utf-8") as f:
            f.write(
                f"Game Log - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
            )
            f.write("=" * 60 + "\n\n")

            async for step in agent.astream(
                {"messages": [input_message]},
                stream_mode="values",
                config={"recursion_limit": 15},
            ):
                message = step["messages"][-1]

                # Write to file
                f.write(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] ")
                f.write(f"Role: {message.type}\n")

                content = message.content
                # Truncate any screenshot responses
                if isinstance(content, list):
                    truncated_content = []
                    for item in content:
                        if isinstance(item, dict) and item["type"] == "image_url":
                            url = item["image_url"]["url"]
                            truncated_url = url[:50] + "..."
                            truncated_content.append(
                                {
                                    "type": "image_url",
                                    "image_url": {"url": truncated_url},
                                }
                            )
                        else:
                            truncated_content.append(item)
                    content = truncated_content

                # Pretty print the content as indented JSON if possible
                try:
                    if isinstance(content, (dict, list)):
                        content_str = json.dumps(content, indent=2, ensure_ascii=False)
                    else:
                        content_str = str(content)
                except:
                    content_str = str(content)

                f.write(f"Content:\n{content_str}\n")
                f.write("-" * 40 + "\n")
                f.flush()

                print(
                    f"[{datetime.datetime.now().strftime('%H:%M:%S')}] Message logged"
                )

    except Exception as error:
        print(f"❌ Error sending message: {error}")
        raise error
