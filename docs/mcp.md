`relay mcp`
===========

Start MCP (Model Context Protocol) server for AI assistant integration

* [`relay mcp`](#relay-mcp)

## `relay mcp`

Start MCP (Model Context Protocol) server for AI assistant integration

```
USAGE
  $ relay mcp [--exclude-patterns <value>] [--host <value>] [--include-topics <value>] [--max-tools
    <value>] [--port <value>] [--profile <value>] [--show-filtered] [--strategy first|prioritize|balanced|strict]
    [--timeout <value>] [--transport stdio|http]

FLAGS
  --exclude-patterns=*:debug,test:*  Comma-separated patterns to exclude (e.g., "*:debug,test:*,internal:*")
  --host=127.0.0.1                   [default: 127.0.0.1] Host to bind HTTP server to (HTTP transport only)
  --include-topics=auth,deploy       Comma-separated topics to include (e.g., "auth,deploy,config")
  --max-tools=40                     Maximum number of tools to expose (overrides config)
  --port=3000                        [default: 3000] Port for HTTP server (HTTP transport only)
  --profile=production               Configuration profile to use
  --show-filtered                    Show commands that were filtered out and exit
  --strategy=prioritize              Filtering strategy when tool limit is exceeded
  --timeout=300                      [default: 300] Tool execution timeout in seconds (0 = no timeout)
  --transport=stdio                  [default: stdio] Transport protocol to use

DESCRIPTION
  Start MCP (Model Context Protocol) server for AI assistant integration

EXAMPLES
  $ sm mcp

  $ sm mcp --profile minimal

  $ sm mcp --max-tools 50

  $ sm mcp --include-topics auth,deploy,config

  $ sm mcp --exclude-patterns "*:debug,test:*"

  $ sm mcp --show-filtered
```

_See code: [oclif-plugin-mcp-server](https://github.com/npjonath/oclif-plugin-mcp-server/blob/v0.7.1/dist/commands/mcp/index.ts)_
