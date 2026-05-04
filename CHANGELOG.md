# Changelog

All notable changes to this project will be documented in this file.

## [0.1.14] - 2026-05-04
### Fixed
- Implement `NodeApiError` for all HTTP calls to comply with n8n verification guidelines.
- Use `JsonObject` type for error handling as requested by n8n reviewers.
- Completely translated README.md to English.
### Changed
- Updated node icon to the official HonoWA logo.

## [0.1.13] - 2026-05-02
### Added
- Moved Session ID configuration to Credentials for better user experience.
### Removed
- Removed Session ID selection from individual nodes to simplify workflow design.

## [0.1.12] - 2026-05-02
### Fixed
- Improved session fetching logic to support multiple API response formats.
- Added automatic trailing slash removal for Base URL to prevent 524 timeout errors.

## [0.1.11] - 2026-05-02
### Fixed
- Added mandatory build step in GitHub Actions CI/CD to ensure `dist` folder is included in the npm package.

## [0.1.10] - 2026-05-02
### Documentation
- Updated README with a CDN-hosted logo for better visibility in npm and n8n registries.

## [0.1.5] - 2026-05-02
### Changed
- Configured GitHub Actions for verified publishing with npm provenance.
- Standardized package structure for n8n community node requirements.

## [0.1.1] - 2026-05-02
### Added
- Initial release of HonoWA nodes for n8n.
- Support for Text, Media (URL/Binary), and Group messaging.
- Broadcast engine with automatic delay.

---
[0.1.14]: https://github.com/ardianryan/n8n-nodes-honowa/compare/v0.1.13...v0.1.14
[0.1.13]: https://github.com/ardianryan/n8n-nodes-honowa/compare/v0.1.12...v0.1.13
[0.1.12]: https://github.com/ardianryan/n8n-nodes-honowa/compare/v0.1.11...v0.1.12
[0.1.11]: https://github.com/ardianryan/n8n-nodes-honowa/compare/v0.1.10...v0.1.11
[0.1.10]: https://github.com/ardianryan/n8n-nodes-honowa/compare/v0.1.8...v0.1.10
[0.1.5]: https://github.com/ardianryan/n8n-nodes-honowa/compare/v0.1.1...v0.1.5
