# windows 注册表写入app的唤起协议

!macro customInstall
  DetailPrint "Register electron-nitro-basic URI Handler"
  DeleteRegKey HKCR "electron-nitro-basic"
  WriteRegStr HKCR "electron-nitro-basic" "" "URL:electron-nitro-basic"
  WriteRegStr HKCR "electron-nitro-basic" "URL Protocol" ""
  WriteRegStr HKCR "electron-nitro-basic\shell" "" ""
  WriteRegStr HKCR "electron-nitro-basic\shell\Open" "" ""
  WriteRegStr HKCR "electron-nitro-basic\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend

!macro customUnInstall
  DeleteRegKey HKCR "electron-nitro-basic"
!macroend
