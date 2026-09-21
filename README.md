# Token Sprint - AI Toolkit

A modern AI toolkit built with Next.js 15 and shadcn/ui, featuring token generation speed visualization and LLM GPU memory calculation.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Open in your browser
# http://localhost:3000
```

## Core Features

- **Token Generation Speed Visualizer** - Experience in real time how different token generation speeds affect the user experience
- **LLM Inference GPU Memory Calculator** - Calculate the GPU memory and number of GPUs required for large language model inference

## Tech Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- shadcn/ui + Tailwind CSS
- Chinese and English language support
- Datadog log monitoring (optional)

## Log Monitoring (Optional)

The project integrates Datadog log monitoring to help you:

- Monitor user activity and calculation results
- Track performance metrics and errors
- Analyze user behavior and usage patterns

### Quick Setup

1. Create a `.env.local` file.
2. Add your Datadog Client Token:
   ```env
   NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=your_token_here
   ```
3. Restart the development server.

For detailed configuration instructions, see the [Datadog Setup Guide](./doc/DATADOG_SETUP.md).

### Test the Configuration

```bash
# Run the configuration check script
node scripts/test-datadog.js
```

> **Note:** The application works without Datadog configuration. Logs will be written to the console instead.

## Documentation

For detailed documentation, see the [doc/](./doc/) directory:

- [Project Overview](./doc/README.md)
- [Technical Architecture](./doc/ARCHITECTURE.md)
- [Component Design](./doc/COMPONENTS.md)
- [Styling Guide](./doc/STYLING.md)
- [Development Guide](./doc/DEVELOPMENT.md)
- [Datadog Setup Guide](./doc/DATADOG_SETUP.md)
