# Changelog

All notable changes to this project will be documented in this file.

## [0.1.16] - 2026-05-05
### Added
- **AI Integration**: Added support for AI Chat (Claude, Gemini, OpenAI) and AI Image Generation.
- **Status Support**: Added ability to create WhatsApp Status (Text and Media).
- **Group Messaging**: New operation to send messages to WhatsApp Groups using Group ID.
- **Session Management**: Added 'List Sessions' operation to view all active sessions.

## [0.1.15] - 2026-05-04
### Fixed
- Updated node and credential icons to the new HonoWA logo.
- Fixed icon paths to resolve n8n lint errors.
- Professional cleanup of CHANGELOG.md formatting.

## [0.1.14] - 2026-05-04
### Fixed
- Implemented `NodeApiError` for all HTTP calls as per n8n guidelines.
- Used `JsonObject` type for improved error handling.
- Translated entire README.md to English for n8n verification.

## [0.1.13] - 2026-05-02
### Added
- Moved Session ID configuration to Credentials for a better user experience.
### Removed
- Removed Session ID selection from individual nodes.

## [0.1.12] - 2026-05-02
### Fixed
- Robust session fetching and automatic trailing slash removal for Base URL.

## [0.1.11] - 2026-05-02
### Fixed
- Added mandatory build step in CI/CD to include `dist` folder in npm package.

## [0.1.1] - 2026-05-02
### Added
- Initial release with support for Text, Media, and Broadcast operations.

---
[0.1.16]: https://github.com/ardianryan/n8n-nodes-honowa/compare/0.1.15...0.1.16
[0.1.15]: https://github.com/ardianryan/n8n-nodes-honowa/compare/0.1.14...0.1.15
[0.1.14]: https://github.com/ardianryan/n8n-nodes-honowa/compare/0.1.13...0.1.14
[0.1.13]: https://github.com/ardianryan/n8n-nodes-honowa/compare/0.1.12...0.1.13
[0.1.12]: https://github.com/ardianryan/n8n-nodes-honowa/compare/0.1.11...0.1.12
[0.1.11]: https://github.com/ardianryan/n8n-nodes-honowa/compare/0.1.1...0.1.11