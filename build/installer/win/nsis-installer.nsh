# windows 注册表写入app的唤起协议

!macro customInstall
  DetailPrint "Register ztx-bid-invitation URI Handler"
  DeleteRegKey HKCR "ztx-bid-invitation"
  WriteRegStr HKCR "ztx-bid-invitation" "" "URL:ztx-bid-invitation"
  WriteRegStr HKCR "ztx-bid-invitation" "URL Protocol" ""
  WriteRegStr HKCR "ztx-bid-invitation\shell" "" ""
  WriteRegStr HKCR "ztx-bid-invitation\shell\Open" "" ""
  WriteRegStr HKCR "ztx-bid-invitation\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend

!macro customUnInstall
  DeleteRegKey HKCR "ztx-bid-invitation"
!macroend
