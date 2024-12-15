# Cyber Sanrakshak Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- MongoDB
- Git

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd CyberSanrakshak
   npm install
   ```

2. **Install Package Dependencies**
   ```bash
   npm run setup
   ```

3. **Start Services**

   **Backend:**
   ```bash
   cd packages/backend
   npm start
   ```

   **Frontend:**
   ```bash
   cd packages/frontend
   npm run dev
   ```

   **Client Agent:**
   ```bash
   cd packages/client
   python server.py
   ```

   **ML Service:**
   ```bash
   cd packages/ml-service
   python start.py
   ```

## Configuration

- Copy `.env.example` to `.env` in each package
- Update database connections and API endpoints
- Configure firewall rules as needed

## Architecture

- **Frontend**: Next.js dashboard (`packages/frontend`)
- **Backend**: Node.js API server (`packages/backend`) 
- **Client**: Python firewall agent (`packages/client`)
- **ML Service**: Anomaly detection service (`packages/ml-service`)