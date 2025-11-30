# MCP Servers Comprehensive Test Report

**Generated:** 2025-11-30T17:57:08.689Z

---

## 📊 Executive Summary

| Metric | Value |
|--------|-------|
| Servers Tested | 4 |
| Successful Connections | 4/4 |
| Total Tools Discovered | 56 |
| Total Tests Executed | 9 |
| Passed Tests | 5/9 (56%) |

---

## 🔍 Server Test Results

### ⚠️ GitHub Official MCP

**Status:** PARTIAL  
**Connected:** ✅ Yes  
**Tools Discovered:** 26  
**Test Duration:** 2127ms

#### Available Tools (26)

- **create_or_update_file**: Create or update a single file in a GitHub repository
- **search_repositories**: Search for GitHub repositories
- **create_repository**: Create a new GitHub repository in your account
- **get_file_contents**: Get the contents of a file or directory from a GitHub repository
- **push_files**: Push multiple files to a GitHub repository in a single commit
- **create_issue**: Create a new issue in a GitHub repository
- **create_pull_request**: Create a new pull request in a GitHub repository
- **fork_repository**: Fork a GitHub repository to your account or specified organization
- **create_branch**: Create a new branch in a GitHub repository
- **list_commits**: Get list of commits of a branch in a GitHub repository
- *...and 16 more tools*

#### Test Results (1/3 passed)

| Test | Tool | Result | Duration |
|------|------|--------|----------|
| Search for modelcontextprotocol repositories | `search_repositories` | ✅ Pass | 860ms |
| Search for MCP-related code | `search_code` | ❌ Fail | N/A |
| Search for MCP issues | `search_issues` | ❌ Fail | N/A |

#### Errors

- Test "Search for MCP-related code": MCP error -32603: Invalid input: [{"code":"invalid_type","expected":"string","received":"undefined","path":["q"],"message":"Required"}]
- Test "Search for MCP issues": MCP error -32603: Invalid input: [{"code":"invalid_type","expected":"string","received":"undefined","path":["q"],"message":"Required"}]

---

### ⚠️ Puppeteer MCP (Browser Automation)

**Status:** PARTIAL  
**Connected:** ✅ Yes  
**Tools Discovered:** 7  
**Test Duration:** 999ms

#### Available Tools (7)

- **puppeteer_navigate**: Navigate to a URL
- **puppeteer_screenshot**: Take a screenshot of the current page or a specific element
- **puppeteer_click**: Click an element on the page
- **puppeteer_fill**: Fill out an input field
- **puppeteer_select**: Select an element on the page with Select tag
- **puppeteer_hover**: Hover an element on the page
- **puppeteer_evaluate**: Execute JavaScript in the browser console

#### Test Results (0/2 passed)

| Test | Tool | Result | Duration |
|------|------|--------|----------|
| Navigate to localhost MCP monitor | `puppeteer_navigate` | ❌ Fail | N/A |
| Take screenshot | `puppeteer_screenshot` | ❌ Fail | N/A |

#### Errors

- Test "Navigate to localhost MCP monitor": MCP error -32603: Failed to launch the browser process!
/home/dataops-lab/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome: error while loading shared libraries: libnss3.so: cannot open shared object file: No such file or directory


TROUBLESHOOTING: https://pptr.dev/troubleshooting

- Test "Take screenshot": MCP error -32603: Failed to launch the browser process!
/home/dataops-lab/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome: error while loading shared libraries: libnss3.so: cannot open shared object file: No such file or directory


TROUBLESHOOTING: https://pptr.dev/troubleshooting


---

### ✅ Filesystem MCP

**Status:** PASS  
**Connected:** ✅ Yes  
**Tools Discovered:** 14  
**Test Duration:** 1174ms

#### Available Tools (14)

- **read_file**: Read the complete contents of a file as text. DEPRECATED: Use read_text_file instead.
- **read_text_file**: Read the complete contents of a file from the file system as text. Handles various text encodings an
- **read_media_file**: Read an image or audio file. Returns the base64 encoded data and MIME type. Only works within allowe
- **read_multiple_files**: Read the contents of multiple files simultaneously. This is more efficient than reading files one by
- **write_file**: Create a new file or completely overwrite an existing file with new content. Use with caution as it 
- **edit_file**: Make line-based edits to a text file. Each edit replaces exact line sequences with new content. Retu
- **create_directory**: Create a new directory or ensure a directory exists. Can create multiple nested directories in one o
- **list_directory**: Get a detailed listing of all files and directories in a specified path. Results clearly distinguish
- **list_directory_with_sizes**: Get a detailed listing of all files and directories in a specified path, including sizes. Results cl
- **directory_tree**: Get a recursive tree view of files and directories as a JSON structure. Each entry includes 'name', 
- *...and 4 more tools*

#### Test Results (2/2 passed)

| Test | Tool | Result | Duration |
|------|------|--------|----------|
| Read package.json | `read_file` | ✅ Pass | 13ms |
| List workspace files | `list_directory` | ✅ Pass | 8ms |

---

### ✅ Memory MCP

**Status:** PASS  
**Connected:** ✅ Yes  
**Tools Discovered:** 9  
**Test Duration:** 4522ms

#### Available Tools (9)

- **create_entities**: Create multiple new entities in the knowledge graph
- **create_relations**: Create multiple new relations between entities in the knowledge graph. Relations should be in active
- **add_observations**: Add new observations to existing entities in the knowledge graph
- **delete_entities**: Delete multiple entities and their associated relations from the knowledge graph
- **delete_observations**: Delete specific observations from entities in the knowledge graph
- **delete_relations**: Delete multiple relations from the knowledge graph
- **read_graph**: Read the entire knowledge graph
- **search_nodes**: Search for nodes in the knowledge graph based on a query
- **open_nodes**: Open specific nodes in the knowledge graph by their names

#### Test Results (2/2 passed)

| Test | Tool | Result | Duration |
|------|------|--------|----------|
| Store test knowledge | `store_memory` | ✅ Pass | 1ms |
| Retrieve stored knowledge | `retrieve_memory` | ✅ Pass | 1ms |

---

## 🎯 Recommendations

⚠️ **Partial success.** Several issues need to be addressed.

### Next Steps

1. Review failed tests and error messages
2. Check API tokens and credentials for external services
3. Verify network connectivity to required services
4. Ensure all required dependencies are installed
5. Test Docker Desktop MCP Toolkit servers separately

---

*Report generated by MCP Comprehensive Test Suite*
