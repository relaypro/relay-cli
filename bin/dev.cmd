@echo off

rem Copyright © 2022 Relay Inc.

node --loader ts-node/esm --no-warnings=ExperimentalWarning "%~dp0\dev" %*
