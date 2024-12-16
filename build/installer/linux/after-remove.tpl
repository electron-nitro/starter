#!/bin/bash

# 刷新 desktop 数据库
echo "Updating desktop database..."
update-desktop-database /usr/share/applications

# 取消注册自定义协议
echo "Unregistering URL scheme handler for electron-nitro-basic..."
xdg-mime default "" "x-scheme-handler/electron-nitro-basic"

echo "Unregistration complete. electron-nitro-basic:// protocol has been removed."

exit 0
