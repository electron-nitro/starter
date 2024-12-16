#!/bin/bash

# 刷新 desktop 数据库
echo "Updating desktop database..."
update-desktop-database /usr/share/applications

# 注册自定义协议
echo "Registering URL scheme handler for electron-nitro-basic..."
xdg-mime default "electron-nitro-basic-app.desktop" "x-scheme-handler/electron-nitro-basic"

echo "Registration complete. electron-nitro-basic:// protocol is now handled by electron-nitro-basic-app."

exit 0
