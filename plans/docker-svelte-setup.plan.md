<!-- f46d7395-605e-43a7-af90-91f4afd63161 687ce244-c995-4ca6-bab7-95626c6cf0ed -->
# Docker Setup for Svelte Frontend with Auto-Build

## Overview

Create a Docker-based development environment for a Svelte frontend that automatically rebuilds on code changes and serves pages via HTTP.

## Implementation Plan

### 1. Initialize SvelteKit Project Structure

- Create `package.json` with SvelteKit dependencies and dev scripts
- Create `svelte.config.js` with basic SvelteKit configuration
- Create `vite.config.js` for Vite dev server configuration
- Set up basic project structure (`src/routes/`, `static/`, etc.)

### 2. Create Docker Configuration

- **Dockerfile**: Multi-stage build for development
- Base Node.js image
- Install dependencies
- Expose port (default 5173 for Vite dev server)
- Run dev server with hot-reload enabled

- **docker-compose.yml**: 
- Service definition for the Svelte frontend
- Volume mount for source code (enables auto-rebuild on save)
- Port mapping (host:container)
- Environment variables for dev mode

### 3. Create Supporting Files

- `.dockerignore` to exclude unnecessary files from Docker context
- `.gitignore` for Node.js and build artifacts
- Basic `src/routes/+page.svelte` as a starter page

### 4. Configuration Details

- **Port**: 5173 (Vite default) mapped to host port 5173
- **Hot Reload**: Enabled via Vite HMR and volume mounting
- **Auto-rebuild**: File watching enabled through volume mounts
- **Development Mode**: Uses `npm run dev` in container

## Files to Create

- `package.json`
- `svelte.config.js`
- `vite.config.js`
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- `.gitignore`
- `src/routes/+page.svelte` (basic starter page)
- `src/app.html` (SvelteKit app template)

## Usage

After setup, run `docker-compose up` to start the dev server. Code changes will automatically trigger rebuilds.

### To-dos

- [x] Create package.json with SvelteKit dependencies and dev scripts
- [x] Create svelte.config.js and vite.config.js with development settings
- [x] Create Dockerfile for Node.js dev environment with hot-reload support
- [x] Create docker-compose.yml with volume mounts for auto-rebuild
- [x] Create .dockerignore, .gitignore, and basic SvelteKit project structure
- [x] Create basic src/routes/+page.svelte and src/app.html files