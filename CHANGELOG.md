# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.3.1] - 2018-10-12
### Changed
- Fixed error thrown when there are no plugins attached to the element

## [1.3.0] - 2018-07-26
### Changed
- Updated dependencies
- Don't override default settings when calling ```$.fn.app({})```
- Added helper methods ```$.app.hasPluginDefined```, ```$.app.hasPlugin```

## [1.2.0] - 2018-03-13
### Changed
- Allow whitespace additionally to comma as multiple plugin name separator

## [1.1.0] - 2017-08-07
### Changed
- Updated depedencies

## [1.0.0] - 2017-08-07
### Changed
- Fixed jQuery module loading to prevent webpack from requiring jQuery during build

## [0.4.0] - 2016-09-01
### Changed
- Implemented proper jQuery loading/factory method

## [0.3.1] - 2016-08-29
### Added
- ```debug``` configuration option [\#1](https://github.com/kasparsz/jquery-app/issues/1)


[1.3.0]: https://github.com/kasparsz/jquery-app/compare/v1.3.0...v1.3.1
[1.2.0]: https://github.com/kasparsz/jquery-app/compare/v1.2.0...v1.3.0
[1.1.0]: https://github.com/kasparsz/jquery-app/compare/v1.1.0...v1.2.0
[1.0.0]: https://github.com/kasparsz/jquery-app/compare/v1.0.0...v1.1.0
[0.4.0]: https://github.com/kasparsz/jquery-app/compare/v0.4.0...v1.0.0
[0.4.0]: https://github.com/kasparsz/jquery-app/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/kasparsz/jquery-app/compare/v0.2.2...v0.3.1
