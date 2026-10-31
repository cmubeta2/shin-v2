@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === DONG BO SHIN ^<-^> github.com/cmubeta2/shin-v2 ===
git pull --rebase --autostash
if errorlevel 1 goto loi
git add -A
rem --- CHAN AN TOAN: kho cong khai, khong duoc day ma v1 / bi mat ---
git diff --cached --name-only | findstr /i /r "He.sinh.thai \.clasp \.env appsscript\.json \.gs$ 20_PTKH token" >nul
if not errorlevel 1 goto chan
git diff --cached --quiet && goto day
set /p MSG=Noi dung thay doi (Enter = mac dinh):
if "%MSG%"=="" set MSG=update: dong bo %date% %time:~0,5%
git commit -m "%MSG%"
:day
git push
if errorlevel 1 goto loi
echo.
echo Xong! Web cap nhat sau 1-2 phut: https://cmubeta2.github.io/shin-v2/
pause
exit /b 0
:chan
echo.
echo DUNG LAI! Co tep v1 / bi mat sap len GitHub cong khai:
git diff --cached --name-only | findstr /i /r "He.sinh.thai \.clasp \.env appsscript\.json \.gs$ 20_PTKH token"
git reset -q
echo Da huy, KHONG day gi ca. Chup man hinh nay gui cho Claude.
pause
exit /b 1
:loi
echo.
echo CO LOI - chup man hinh nay gui cho Claude.
pause
exit /b 1
