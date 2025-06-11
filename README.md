# [🎮 Click here to play! 🎮](https://yonadaa.github.io/)

Simple games that test the general intelligence of AI systems.

Each game only uses a few mechanics and is solvable with basic algorithms (eg. _breadth-first search_). The challenge is to build an AI system that can figure out how each game works and devise a winning strategy on the fly, **without any [scaffolding](https://x.com/giffmana/status/1916117387562057867)**.

While there are benchmarks on popular video games (see [vgbench](https://www.vgbench.com/), [lmgame](https://lmgame.org/)), these simple, modular games provide a more sensitive measure of the abilities of current systems. 

You can read a transcript of Claude playing [here](https://github.com/yonadaa/agi-games/blob/main/examples/llm-agents/logs/game-1_claude-sonnet-4-20250514/20250611_152242.txt). 

## Testing

The games are played on a fixed-sized canvas via a web interface:

<img width="1470" alt="Screenshot 2025-06-11 at 11 48 05" src="https://github.com/user-attachments/assets/e0737392-c0ee-469b-8ff0-e54b58b1b00b"/>

Each game is a self-contained JavaScript module that listens for user input and draws to the canvas. There are no instructions on how to play; the test-taker has to experiment. Once they have met the win condition, the game ends and they can start the next one.

As this runs in the browser, for now we expect test-takers not to scrape the game code. In future the games could be rendered server-side to prevent this.

You can run the interface locally:

```
python -m http.server 8000
```

## Example solutions

The `examples/` folder has scripts for playing the games with `claude-sonnet-4` and `gemini-2.5-flash`. They are LangGraph [agents](https://www.langchain.com/agents) and have tools to take a screenshot and press keys with [PlayWright](https://playwright.dev/).

Test the agents with:
```
cd examples/llm-agents/ 
python main.py
```
