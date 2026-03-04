@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem Random integer 1..10
set /a secret=(%RANDOM% %% 10) + 1

:prompt
set "guess="
set /p "guess=Guess a number between 1 and 10: "

rem Validate numeric input
set /a guessNum=guess 2>nul
if not "!guess!"=="!guessNum!" (
  echo Please enter a whole number.
  goto prompt
)

if !guessNum! LSS 1 (
  echo Please enter a number from 1 to 10.
  goto prompt
)
if !guessNum! GTR 10 (
  echo Please enter a number from 1 to 10.
  goto prompt
)

if !guessNum! LSS !secret! (
  echo Wrong guess! Too Low!
  goto prompt
)
if !guessNum! GTR !secret! (
  echo Wrong guess! Too High!
  goto prompt
)

echo Correct!!
exit /b 0
