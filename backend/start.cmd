@echo off
echo Starting CyberOpus Backend...

:: Load .env file
for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    if not "%%A"=="" if not "%%A:~0,1%"=="#" (
        set "%%A=%%B"
    )
)

set JAVA_HOME=%USERPROFILE%\.jdk\jdk-25.0.2
set PATH=%JAVA_HOME%\bin;%PATH%

call mvnw.cmd spring-boot:run -Dspring.profiles.active=prod

pause
