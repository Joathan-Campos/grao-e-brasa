@echo off
title Grao e Brasa - servidor local
cd /d "%~dp0site"

if not exist "node_modules" (
  echo Instalando dependencias pela primeira vez...
  call npm install
)

if not exist "out\index.html" (
  echo Gerando o site...
  call npm run build
)

echo.
echo Site rodando em http://localhost:4173
echo Deixe esta janela aberta. Para parar, feche a janela ou aperte Ctrl+C.
echo.
start "" http://localhost:4173
call npx -y serve out -l 4173 --no-clipboard
pause
