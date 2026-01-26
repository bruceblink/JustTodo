use std::sync::mpsc;
use tauri::{Manager, WebviewWindow};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};
use windows::Win32::Foundation::HWND;
use windows::Win32::UI::WindowsAndMessaging::{BringWindowToTop, SetForegroundWindow, SetWindowPos, ShowWindow, HWND_NOTOPMOST, HWND_TOPMOST, SWP_NOMOVE, SWP_NOSIZE, SWP_SHOWWINDOW, SW_RESTORE, SW_SHOW};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


const AUTOSTART_HIDDEN_ARG: &str = "--justtodo-autostart-hidden";

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        //.plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = surface_main_window(&window);
            }else {
                app.dialog()
                    .message("app is running...")
                    .kind(MessageDialogKind::Error)
                    .title("Warning")
                    .blocking_show();
            }
        }))
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![AUTOSTART_HIDDEN_ARG]), /* arbitrary number of args to pass to your app */
        ))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

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