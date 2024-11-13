# Ticket Hawk 🎫

Ticket Hawk is a program that automates the process of monitoring multiple browser windows for queue availability on ticket websites. It's perfect for getting into ticket queues early when trying to purchase high-demand tickets.

## Getting Started 🚀

1. Install Node.js on your machine.
2. Clone this repository.
3. Run `npm install` or `bun install` to install the required dependencies.
4. Run the program using `npm start` or `bun start`.

## How It Works 🎯

Ticket Hawk uses Selenium WebDriver to:

1. Prompt you for the target URL, number of browser windows, and refresh timeout.
2. Initialize Chrome browser windows and navigate them to the target URL.
3. Continuously monitor each window for queue-related elements.
4. When a queue button is found in any window:
  - The queue button is clicked
  - That window is brought into focus
  - All other windows are automatically closed
  - You can proceed with the ticket purchase process
5. If no queue is found, windows will continue refreshing at random intervals within your specified timeout.

## Configuration 🛠️

You can configure the following parameters when running the program:

- `targetURL`: The ticket website URL to monitor
- `spawnTargets`: The number of browser windows to spawn
- `refreshTimeout`: The maximum timeout (in seconds) between page refreshes. The actual refresh time will be randomized up to this value.

## Error Handling 🚨

Ticket Hawk includes robust error handling mechanisms:

- Automatically retries page checks when errors occur
- Handles graceful shutdown of browser windows
- Uses randomized refresh timing to avoid detection
- Includes built-in timeout handling for page loads
- Ignores certificate errors to work with various ticket sites

## Contributing 🤝

Contributions are what make the open-source community such an amazing place to learn, inspire, and create.
Any contributions you make are greatly appreciated.

1. Fork the project.
2. Create your feature branch `git checkout -b feature/AmazingFeature`.
3. Commit your changes `git commit -m 'Add some AmazingFeature'`.
4. Push to the branch `git push origin feature/AmazingFeature`.
5. Open a pull request.

## License 📄

Distributed under the MIT License. See LICENSE for more information.

## Contact 📬

Twitter - [@olwiba](https://twitter.com/Olwiba)