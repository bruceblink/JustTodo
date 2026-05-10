use serde::Serialize;
use std::sync::{mpsc, Arc, Mutex};
use tauri::{menu::{Menu, MenuItem}, tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent}, Manager, WebviewWindow, WindowEvent};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};
use tauri_plugin_log::log;
use tauri_plugin_store::StoreExt;
#[cfg(target_os = "windows")]
use windows::Win32::Foundation::HWND;
#[cfg(target_os = "windows")]
use windows::Win32::UI::WindowsAndMessaging::{BringWindowToTop, SetForegroundWindow, SetWindowPos, ShowWindow, HWND_NOTOPMOST, HWND_TOPMOST, SWP_NOMOVE, SWP_NOSIZE, SWP_SHOWWINDOW, SW_RESTORE, SW_SHOW};

const AUTOSTART_HIDDEN_ARG: &str = "--justtodo-autostart-hidden";
const SETTINGS_FILE: &str = "settings.json";
const SETTINGS_KEY: &str = "app_settings";
const TRAY_SHOW_ID: &str = "tray_show_main";
const TRAY_QUIT_ID: &str = "tray_quit_app";

#[derive(Clone)]
struct AppState {
    close_to_tray: Arc<Mutex<bool>>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct AppInfo {
    app_version: String,
    package_name: String,
    platform: String,
    dev: bool,
}

#[tauri::command]
fn get_app_info(app: tauri::AppHandle) -> AppInfo {
    AppInfo {
        app_version: app.package_info().version.to_string(),
        package_name: app.package_info().name.to_string(),
        platform: std::env::consts::OS.to_string(),
        dev: cfg!(debug_assertions),
    }
}

#[tauri::command]
fn show_main_window(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        surface_main_window(&window)
    } else {
        Err("main window is not available".to_string())
    }
}

#[tauri::command]
fn set_close_to_tray(app: tauri::AppHandle, enabled: bool) -> Result<(), String> {
    let state = app.state::<AppState>();
    let mut close_to_tray = state
        .close_to_tray
        .lock()
        .map_err(|_| "failed to update close-to-tray state".to_string())?;
    *close_to_tray = enabled;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = surface_main_window(&window);
            } else {
                app.dialog()
                    .message("app is running...")
                    .kind(MessageDialogKind::Error)
                    .title("Warning")
                    .blocking_show();
            }
        }))
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![AUTOSTART_HIDDEN_ARG]),
        ))
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_log::Builder::default().build())
        .setup(|app| {
            let close_to_tray = read_close_to_tray_setting(app.handle()).unwrap_or(true);
            app.manage(AppState {
                close_to_tray: Arc::new(Mutex::new(close_to_tray)),
            });

            let show_item = MenuItem::with_id(app, TRAY_SHOW_ID, "Show JustTodo", true, None::<&str>)
                .map_err(|err| err.to_string())?;
            let quit_item = MenuItem::with_id(app, TRAY_QUIT_ID, "Quit", true, None::<&str>)
                .map_err(|err| err.to_string())?;
            let tray_menu = Menu::with_items(app, &[&show_item, &quit_item])
                .map_err(|err| err.to_string())?;

            let mut tray_builder = TrayIconBuilder::with_id("main-tray")
                .menu(&tray_menu)
                .tooltip("JustTodo")
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id().0.as_ref() {
                    TRAY_SHOW_ID => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = surface_main_window(&window);
                        }
                    }
                    TRAY_QUIT_ID => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        if let Some(window) = tray.app_handle().get_webview_window("main") {
                            let _ = surface_main_window(&window);
                        }
                    }
                });

            if let Some(icon) = app.default_window_icon().cloned() {
                tray_builder = tray_builder.icon(icon);
            }

            tray_builder.build(app).map_err(|err| err.to_string())?;

            if let Some(window) = app.get_webview_window("main") {
                let app_handle = app.handle().clone();
                window.on_window_event(move |event| {
                    if let WindowEvent::CloseRequested { api, .. } = event {
                        let should_close_to_tray = app_handle
                            .state::<AppState>()
                            .close_to_tray
                            .lock()
                            .map(|value| *value)
                            .unwrap_or(true);

                        if should_close_to_tray {
                            api.prevent_close();
                            if let Some(window) = app_handle.get_webview_window("main") {
                                let _ = window.hide();
                            }
                        }
                    }
                });
            }

            if std::env::args().any(|arg| arg == AUTOSTART_HIDDEN_ARG) {
                if let Some(window) = app.get_webview_window("main") {
                    if let Err(err) = window.hide() {
                        log::warn!("failed to hide main window for autostart: {err}");
                    }
                }
            }
            log::info!("App setup completed");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_app_info, show_main_window, set_close_to_tray])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn read_close_to_tray_setting(app: &tauri::AppHandle) -> Option<bool> {
    let store = app.store(SETTINGS_FILE).ok()?;
    let settings = store.get(SETTINGS_KEY)?;
    settings.get("closeToTray")?.as_bool()
}

#[cfg(target_os = "windows")]
fn surface_main_window(window: &WebviewWindow) -> Result<(), String> {
    let window_for_handle = window.clone();
    let (tx, rx) = mpsc::channel();

    window.run_on_main_thread(move || {
            let result = (|| -> Result<(), String> {
                let hwnd :HWND = window_for_handle.hwnd().map_err(|err| err.to_string())?;

                unsafe {
                   let _ = ShowWindow(hwnd, SW_RESTORE);
                   let _ = ShowWindow(hwnd, SW_SHOW);
                   let _ = SetForegroundWindow(hwnd);
                   let _ = SetWindowPos(
                        hwnd,
                        Some(HWND_TOPMOST),
                        0,
                        0,
                        0,
                        0,
                        SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW,
                    );
                   let _ = SetWindowPos(
                        hwnd,
                        Some(HWND_NOTOPMOST),
                        0,
                        0,
                        0,
                        0,
                        SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW,
                    );
                   let _ = BringWindowToTop(hwnd);
                }

                if let Err(err) = window_for_handle.unminimize() {
                    eprintln!("Failed to unminimize window: {err}");
                }
                if let Err(err) = window_for_handle.show() {
                    eprintln!("Failed to show window: {err}");
                }
                if let Err(err) = window_for_handle.set_focus() {
                    eprintln!("Failed to focus window: {err}");
                }

                Ok(())
            })();

            let _ = tx.send(result);
        })
        .map_err(|err| err.to_string())?;

    rx.recv().map_err(|_| "failed to surface window on main thread".to_string())?
}

#[cfg(not(target_os = "windows"))]
fn surface_main_window(window: &WebviewWindow) -> Result<(), String> {
    if let Err(err) = window.unminimize() {
        log::warn!("Failed to unminimize window: {err}");
    }
    if let Err(err) = window.show() {
        log::warn!("Failed to show window: {err}");
    }
    if let Err(err) = window.set_focus() {
        log::warn!("Failed to focus window: {err}");
    }
    Ok(())
}
