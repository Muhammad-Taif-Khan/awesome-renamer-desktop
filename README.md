# Awesome Renamer Desktop

<p align="center">
  <img src="src/renderer/assets/icon-png.png" width="128" alt="Awesome Renamer Desktop icon">
</p>

<p align="center">A Free & Open Source Windows desktop application for previewing and batch-renaming files with filters and configurable rename rules.</p>

> **Visual tour:** the screenshots below show the current v1 interface. A short demo GIF would be a useful future addition.

<p align="center">
  <img src="screenshots/HomePage%20-%20Select%20Files%20or%20Drag%20And%20Drop.png" alt="Awesome Renamer Desktop file-selection screen" width="760">
</p>

## About

Awesome Renamer Desktop helps you rename a selected group of files without working through them one at a time. Select or drop files into the app, narrow the list with filters, configure renaming rules, and review the proposed filenames before committing the operation.

It is useful when a folder contains a mixture of files and only a subset needs a consistent naming change. Filters and rules work together: filters select the files to target, while rules define how their names change.

## Features

### File selection

- Drag and drop files into the start screen.
- Choose multiple files with the native file picker.
- Add more files to an existing selection.
- Remove selected rows or clear the current selection.

### File filters

- **Date modified** — select files within, before, or after a date/time range.
- **Date created** — select files by creation date/time range.
- **File size** — constrain files by minimum and/or maximum size in Bytes, KB, MB, or GB.
- **File type** — select one or more extensions from the loaded files.
- **Filename text** — match names that contain, start with, or end with specified text.

### Rename rules

- **Case transformations:** uppercase, lowercase, title case, and capitalize.
- **Find and replace** text in filenames.
- **Prefix and suffix** filenames.
- **Windows-style duplicate naming** to avoid name collisions in the same directory.
- Preview each proposed change, including any failed rename, before applying it.

## How it works

1. **Add Files** by dragging them onto the start screen or using the file picker.
2. Open **Filters** and apply the criteria for the files you want to rename. Active filters appear as removable tags above the file table.
3. Configure **Renaming Rules** in the side panel.
4. Select **Preview Changes** to inspect each original filename beside its proposed result.
5. Choose **Rename** in the preview dialog to apply the operation.

The app sends the currently filtered file list to the rename preview and rename operations. Multiple active filters are evaluated together; a file must match every active filter to remain in the filtered list.

<p align="center">
  <img src="screenshots/Filters%20Modal%20-%20Apply%20Filters.png" alt="Filters dialog" width="760">
</p>

<p align="center">
  <img src="screenshots/Set%20and%20Apply%20Rules.png" alt="File dashboard and rename rules" width="760">
</p>

<p align="center">
  <img src="screenshots/Rename%20Changes%20Preview%20Modal.png" alt="Rename changes preview dialog" width="760">
</p>

## Example

Suppose the selected files are:

```text
IMG_001.JPG
IMG_002.JPG
IMG_003.JPG
```

To make the names easier to identify:

1. In **Filters**, select the `.JPG` file type.
2. In **Renaming Rules**, apply **Lowercase** and set the prefix to `holiday_`.
3. Open **Preview Changes**, check the results, then select **Rename**.

The previewed filenames would be:

```text
holiday_img_001.jpg
holiday_img_002.jpg
holiday_img_003.jpg
```

## Installation and download

Download the Windows installer from the [v1.0.0 release](https://github.com/Muhammad-Taif-Khan/awesome-renamer-desktop/releases/tag/v1.0.0) or by clicking [download awesome-renamer-desktop](https://github.com/Muhammad-Taif-Khan/awesome-renamer-desktop/releases/download/v1.0.0/awesome-renamer-desktop-1.0.0-setup.zip). After downloading, run the installer and follow its prompts. 

To run the application from source or create a new package, use the development instructions below.

### Run from source

Prerequisites: Node.js and npm.

```bash
npm install
npm run dev
```

### Build a Windows installer

```bash
npm run build:win
```

The build uses Electron Builder's Windows configuration and produces an NSIS installer artifact. For an unpacked application directory instead, run:

```bash
npm run build:unpack
```

## Usage

1. Start the app and add files by dropping them onto the page or selecting **Add Files**.
2. With files loaded, use **Add Files** again whenever you need to extend the selection.
3. Select **Filters**, set one or more conditions, and choose **Apply Filters**.
4. Configure the desired fields and presets under **Renaming Rules**.
5. Select **Preview Changes** and review the original and proposed names; failures are shown in the preview.
6. Select **Rename** to rename the filtered files.

The Settings page lets you choose how invalid filename characters are handled: report an error or escape them.

## Development

### Stack

- [Electron](https://www.electronjs.org/) with [electron-vite](https://electron-vite.org/)
- React and TypeScript
- [Ant Design](https://ant.design/) UI components
- [Zustand](https://zustand.docs.pmnd.rs/) client state
- [`awesome-renamer`](https://www.npmjs.com/package/awesome-renamer) for file filtering, previews, and rename operations
- Electron Builder for application packaging

### Commands

```bash
# Start the development app
npm run dev

# Preview a built application
npm run start

# Run TypeScript checks for the main and renderer processes
npm run typecheck

# Run ESLint
npm run lint

# Format the repository with Prettier
npm run format

# Build the application
npm run build

# Package targets configured by the project
npm run build:unpack
npm run build:win
npm run build:mac
npm run build:linux
```

There is currently no test command defined in `package.json`.

## Technical overview

The project has three main areas:

- `src/main` contains Electron's main-process services, native file selection, metadata handling, and IPC handlers.
- `src/preload` exposes the supported IPC API to the renderer process.
- `src/renderer` contains the React interface, Ant Design components, application state, filters, settings, and rename-rule controls.

The renderer asks the main process to gather file metadata, apply filters, preview rename results, and perform the rename. Rename processing is provided by the `awesome-renamer` package.

## Possible future improvements

The following are potential directions, not current v1 features or release commitments:

- Filename placeholders such as `{NOW}`, `{MTIME}`, and `{CREATED}`
- Regular-expression renaming
- Sequential numbering
- Additional rename rules and filtering options
- Saved rename presets
- Additional file and folder operations

## Contributing

Contributions are welcome.

1. Fork this repository and clone your fork.
2. Create a branch for your change.
3. Install dependencies with `npm install`.
4. Make your changes and run the relevant checks:

   ```bash
   npm run typecheck
   npm run lint
   ```

5. Commit your changes and open a pull request describing the change and how you verified it.

## License

Awesome Renamer Desktop is licensed under the [MIT License](LICENCE).

## Credits

Created by [Muhammad Taif Khan](https://github.com/Muhammad-Taif-Khan). The application uses the [`awesome-renamer`](https://www.npmjs.com/package/awesome-renamer) package for its rename workflow.

## Third-party software

Third-party dependencies are installed through npm and are governed by their respective licenses. Review the dependency metadata in [`package.json`](package.json) and the licenses supplied by those packages before redistributing a packaged build.
