# React Native iOS builds from any operating system

This repository demonstrates a simple idea: developers can edit and test React Native JavaScript on Windows, Linux, or macOS, while GitHub Actions performs the native iOS build on a hosted Mac with Xcode.

The app itself visualizes the same six-step pipeline implemented by [`.github/workflows/ios.yml`](.github/workflows/ios.yml).

## What this proves

```text
Windows / Linux / macOS        GitHub                 Hosted macOS runner
┌─────────────────────┐       ┌──────────────┐       ┌────────────────────────┐
│ Edit App.tsx        │ push  │ Store source │ start │ npm ci + pod install   │
│ Run tests and lint  ├──────►│ Trigger CI   ├──────►│ Xcode Release build    │
└─────────────────────┘       └──────────────┘       │ Upload zipped .app     │
                                                     └────────────────────────┘
                                                                 │
                                               Apple secrets set │ optional
                                                                 ▼
                                                     Signed IPA → App Store Connect
```

1. A developer edits the React Native code in [`App.tsx`](App.tsx) using any operating system.
2. A push or pull request triggers GitHub Actions.
3. The `build` job requests `macos-latest`, a GitHub-hosted Mac with Xcode.
4. The runner installs npm packages, Ruby gems, CocoaPods, and then builds the Release configuration with `xcodebuild`.
5. The compiled simulator `.app` is zipped and uploaded as a GitHub Actions artifact for every successful build.
6. A manually enabled `release` job imports Apple signing material, exports an IPA, and uploads it to App Store Connect for TestFlight testing or later App Store submission.

The normal CI artifact is an **unsigned simulator build**. It proves that Xcode compiled the native iOS application and can be installed in an iOS Simulator. Apple does not allow that artifact to run directly on a physical iPhone. The optional release job creates the signed device IPA.

## Edit and test on Windows, Linux, or macOS

Install Node.js 22 or newer, clone this repository, and install the packages:

```bash
npm ci
```

### Important: port 8081 is not the app

Running `npm start` starts **Metro**, the service that sends JavaScript to a native React Native application. If you open `http://localhost:8081` in a browser, you will see a small **Welcome to React Native** status page. That is expected; this project is a native mobile app and does not include a web version.

To see the interface from `App.tsx`, launch it in a native simulator or emulator:

**On macOS with Xcode:**

```bash
bundle install
cd ios && bundle exec pod install && cd ..
npm run ios
```

**On Windows, Linux, or macOS with Android Studio:**

Start an Android emulator, then run:

```bash
npm run android
```

The React Native command starts Metro automatically. Once the application is open in the simulator or emulator, edit `App.tsx` and Fast Refresh will show the changes there—not in the browser tab.

If you only want to start Metro yourself, run `npm start` in one terminal and `npm run ios` or `npm run android` in a second terminal.

Platform-independent checks work on every desktop OS, even when no emulator is installed:

```bash
npm run verify
```

Running the iOS Simulator or compiling the native iOS target locally still requires macOS and Xcode. Windows and Linux developers can preview the same React Native screen with Android, then push their changes so the GitHub-hosted Mac performs the iOS build.

## Run the proof in GitHub Actions

1. Create an empty GitHub repository and push this project.
2. Open the repository's **Actions** tab.
3. Select **iOS build** and open the run created by the push.
4. Watch the **Build unsigned iOS app** job show the Xcode version, install CocoaPods, and compile the project.
5. Download `CrossPlatformIOS-simulator-<commit>` from the run's **Artifacts** section.

You can also choose **Run workflow** to start the same build manually. Leave **Upload a signed IPA to App Store Connect without submitting for review** disabled for the credential-free demonstration.

## Optional App Store Connect upload

The workflow has one optional upload checkbox, `upload_to_app_store_connect`. It defaults to disabled. When enabled for a manual run, the release job signs a device IPA and uploads it to App Store Connect after the unsigned build passes.

The same uploaded build can be used for TestFlight testing and App Store submission. You choose those next steps in App Store Connect after Apple processes the upload. The workflow does not assign TestFlight groups, submit for App Review, or publish the app.

### Configure Apple credentials

Uploading requires an active Apple Developer Program membership, an App Store Connect app record, a unique bundle identifier, and distribution credentials. Create a protected GitHub environment named `app-store`, then add these environment secrets:

| Secret                              | Value                                                         |
| ----------------------------------- | ------------------------------------------------------------- |
| `APPLE_CERTIFICATE_BASE64`          | Base64-encoded Apple Distribution `.p12` certificate          |
| `APPLE_CERTIFICATE_PASSWORD`        | Password used when exporting the `.p12`                       |
| `APPLE_PROVISIONING_PROFILE_BASE64` | Base64-encoded App Store distribution `.mobileprovision`      |
| `APPLE_TEAM_ID`                     | Ten-character Apple Developer team ID                         |
| `IOS_BUNDLE_IDENTIFIER`             | Bundle ID registered in Apple Developer and App Store Connect |
| `IOS_PROVISIONING_PROFILE_NAME`     | Exact name of the distribution provisioning profile           |
| `APP_STORE_CONNECT_API_KEY_ID`      | App Store Connect API key ID                                  |
| `APP_STORE_CONNECT_ISSUER_ID`       | App Store Connect API issuer ID                               |
| `APP_STORE_CONNECT_API_KEY_BASE64`  | Base64-encoded contents of the API key `.p8` file             |

On macOS or Linux, encode binary credentials without line wrapping:

```bash
base64 < distribution.p12 | tr -d '\n'
base64 < profile.mobileprovision | tr -d '\n'
base64 < AuthKey_ABC1234567.p8 | tr -d '\n'
```

On Windows PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("distribution.p12"))
[Convert]::ToBase64String([IO.File]::ReadAllBytes("profile.mobileprovision"))
[Convert]::ToBase64String([IO.File]::ReadAllBytes("AuthKey_ABC1234567.p8"))
```

For safer production use, add required reviewers to the `app-store` environment and rotate credentials regularly. Never commit certificates, profiles, passwords, or API keys to the repository.

### Run the upload

1. Open **Actions**, select **iOS build**, then choose **Run workflow**.
2. Select the branch to build.
3. Enable **Upload a signed IPA to App Store Connect without submitting for review**.
4. Start the workflow and wait for the unsigned build to pass. Approve the environment deployment if required.
5. Check that **Sign and upload to App Store Connect** succeeds. Download `CrossPlatformIOS-AppStoreConnect-<run number>` from the run's artifacts if you need a copy of the IPA.
6. Open the app in [App Store Connect](https://appstoreconnect.apple.com/) and wait for Apple to process the build.

The archive uses `github.run_number` as its build number. Rerunning the same workflow run keeps that number, so start a new manual run for a new upload. Check the app version and build number against existing uploads before releasing.

### Test with TestFlight

After processing finishes, open the app's TestFlight tab, complete any required compliance information, and make the build available to your test group. External testing may require Beta App Review. Testers install the app through TestFlight on their devices.

### Submit to the App Store

Uploading is not publishing. To release on the App Store, create or open the matching iOS app version in App Store Connect and select the processed build. Complete the required screenshots, description, privacy details, age rating, review information, and compliance questions. Set pricing, availability, and the release method, then submit for App Review. Apple must approve the submission before the app can be released. Submission and public release remain manual.

See Apple's [upload guidance](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/) for how one uploaded build supports testing and App Store submission.

## Project map

| Path                                                     | Purpose                                                   |
| -------------------------------------------------------- | --------------------------------------------------------- |
| [`App.tsx`](App.tsx)                                     | Simple interactive React Native demonstration UI          |
| [`.github/workflows/ios.yml`](.github/workflows/ios.yml) | macOS/Xcode build and optional Apple upload               |
| [`ios/`](ios)                                            | Native Xcode project and CocoaPods definition             |
| [`__tests__/App.test.tsx`](__tests__/App.test.tsx)       | Basic render test run before Xcode builds                 |

## Local iOS build on a Mac

If a Mac is available, install Xcode and then run:

```bash
npm ci
bundle install
cd ios && bundle exec pod install && cd ..
npm run ios
```

This repository was scaffolded with React Native 0.87.1 and requires iOS 15.1 or newer.
