#!/bin/bash

# 刷新 desktop 数据库
echo "Updating desktop database..."
update-desktop-database /usr/share/applications

# 注册自定义协议
echo "Registering URL scheme handler for ztx-bid-invitation..."
xdg-mime default "ztx-bid-invitation-app.desktop" "x-scheme-handler/ztx-bid-invitation"

echo "Registration complete. ztx-bid-invitation:// protocol is now handled by ztx-bid-invitation-app."

exit 0
