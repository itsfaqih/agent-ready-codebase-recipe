# Native mobile e2e

For iOS and Android apps, the suite drives a release build on a simulator or emulator. One spec per flow, the step screenshots, and the proof all follow `docs/e2e.md`; this file covers what changes on a device.

## Driver

Keep the project's driver when it has one. Otherwise use the mobile driver in `docs/stack.md`: one suite for both platforms, or a declarative flow runner when flows are linear. A flow file calls one UI layer (find, tap, wait, screenshot). Per-platform modules implement it, so one flow file runs on both platforms:

- **Platform**: how elements are found, system dialogs, pickers, deep links.
- **Device**: boot, install, gallery, reading the app's database.

Put platform-only flows in their own directory (`flows/android/`).

## Harness rules

- **Own the device.** The run creates or boots a simulator or emulator named for the worktree (`<app>-<branch>`). It targets that device by UDID or serial, and deletes it or shuts it down at teardown. Other agents' devices on the same machine stay untouched.
- **Adopt only what the run started**, per the container rules in `docs/hermetic-dependencies.md`. On a device run, setup stops and names the leftover when its compose project has containers, a needed port is taken, or its device is already booted. Teardown stops only the driver, automation, emulator, and bundler processes it started. Clearing leftovers after a crashed run is a manual step, printed with the exact command.
- **Ports per run.** Give each worktree its own bundler port (read from env), driver server port, platform-automation ports, and backend stack ports. Each comes from an env var with a default, and the driver connects to the configured port.
- **Stamp the build.** The build step writes a manifest of the sources, lockfile, and baked-in config (API URL, ports) next to the artifact. Setup refuses an artifact whose manifest differs from the checkout, so a test never runs stale native code.
- **Start from a clean install.** Uninstall, reset what survives uninstall (`xcrun simctl keychain <udid> reset` on iOS), then install. Grant permissions up front (`simctl privacy grant`, `adb shell pm grant`) so system prompts never cover the app.
- **Reach the host stack.** iOS simulators share the host's `localhost`. Android emulators need `adb reverse tcp:<port> tcp:<port>` for each backend port, or the host alias `10.0.2.2`; release builds also need cleartext allowed for a plain-HTTP test stack.
- **Hardware the device lacks** (camera, barcode scanner, biometrics) is replaced at the single seam where its result enters the app. Feed in a real JPEG or a real barcode string, and let everything downstream run for real.

## Evidence

Write screenshots to `e2e-artifacts/<platform>/<flow>/NN-<step>.png` and generate an `e2e-artifacts/index.html` that lists them per platform. With `E2E_VIDEO=1` set (`docs/e2e.md`, Video), record each test to `e2e-artifacts/<platform>/<flow>/video.mp4`, with the driver's recording call or the platform's own recorder (`xcrun simctl io <udid> recordVideo`, `adb shell screenrecord`). Start it before the flow's first step and stop it in teardown, failure included. Stop a platform recorder with an interrupt signal and wait for it to exit, since a killed recorder leaves an unplayable file. `adb shell screenrecord` stops itself at its time limit (three minutes), so a longer flow records in segments or through the driver. Report each platform the suite has not run on as unverified.
