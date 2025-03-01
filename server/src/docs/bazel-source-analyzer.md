# BazelSourceAnalyzer.py - Technical Documentation

## Overview

The `BazelSourceAnalyzer.py` script is a critical component of the Bazel Scope application. It performs deep analysis of Bazel targets to extract dependency information, source code content, and build a comprehensive representation of the dependency tree. This information is then processed by an AI assistant to generate human-readable documentation about the codebase structure.

## Script Workflow

1. **Command-Line Interface**
   - Takes two required parameters: `workspace_root` and `target`
   - Parses these arguments using the argparse library

2. **Target Analysis**
   - Starts with the specified target and recursively analyzes its dependencies
   - Uses Bazel's query language (via `bazel cquery`) to identify dependencies
   - Categorizes dependencies as source files or library dependencies
   - Extracts content from source files
   - Returns a structured JSON representation of the entire dependency tree

## Key Functions

### `generate_source_file_path(workspace_root, source_path)`

Converts a Bazel target path to a filesystem path.

**Parameters:**
- `workspace_root`: Path to the Bazel workspace root directory
- `source_path`: Bazel target path (e.g., "//path/to:target")

**Returns:**
- Absolute path to the source file on the filesystem

**Logic:**
- Removes the initial `//` from the path
- Replaces the `:` separator with a directory separator (`/`)
- Joins the workspace root with the modified path

### `analyze_target(workspace_root, target, visited_src, visited_lib)`

Recursively analyzes a Bazel target and its dependencies.

**Parameters:**
- `workspace_root`: Path to the Bazel workspace root directory
- `target`: Bazel target to analyze (e.g., "//path/to:target")
- `visited_src`: Set of already analyzed source files (prevents infinite recursion)
- `visited_lib`: Set of already analyzed libraries (prevents infinite recursion)

**Returns:**
- Dictionary containing:
  - `source_files`: Map of source file paths to their content
  - `dependent_libraries`: Recursively analyzed dependent libraries
  - `target_path`: The original target path

**Logic:**
1. Initialize result dictionary structure
2. Execute `bazel cquery deps(target, 1) --output=label_kind` to get direct dependencies
3. Parse the output to identify:
   - Source files (matched by `SRC_REGEX`)
   - Library dependencies (matched by `LIB_REGEX`)
4. For source files:
   - Add to the visited set to prevent re-analysis
   - Read the file content and store it in the result
5. For library dependencies:
   - Add to the visited set to prevent re-analysis
   - If it's not the original target, recursively analyze it
   - Store the recursive analysis results
6. Return the complete structure

## Regular Expressions

The script uses two key regular expressions to identify different types of targets:

- `SRC_REGEX = r"^source "`: Identifies source file targets
- `LIB_REGEX = r"^.*_library"`: Identifies library targets (e.g., `cc_library`, `py_library`)

## Error Handling

The script implements basic error handling for the Bazel command execution:
- Catches `subprocess.CalledProcessError` exceptions if the Bazel command fails
- Prints error messages to standard error

## Data Structure

The script produces a hierarchical JSON structure representing the dependency tree:

```json
{
  "target_path": "//path/to:target",
  "source_files": {
    "//path/to:file1.cc": "Source code content...",
    "//path/to:file2.h": "Header content..."
  },
  "dependent_libraries": {
    "//lib/path:library1": {
      "target_path": "//lib/path:library1",
      "source_files": { ... },
      "dependent_libraries": { ... }
    },
    "//lib/path:library2": {
      ...
    }
  }
}
```

## Technical Dependencies

- **Python 3**: Required runtime
- **Bazel**: Must be installed and available in the PATH
- **Standard libraries used**:
  - `json`: For serializing the result
  - `subprocess`: For executing Bazel commands
  - `os`: For file path operations
  - `re`: For regular expression matching
  - `typing`: For type annotations
  - `argparse`: For command-line argument parsing

## Limitations and Considerations

1. **Performance**
   - For large codebases, the script may take significant time to execute
   - Every source file is read into memory, which could be problematic for very large files

2. **Bazel Compatibility**
   - The script assumes a working Bazel installation
   - May need adjustments for different Bazel versions or non-standard configurations

3. **File Encoding**
   - The script uses default file encoding, which might not work for all source files
   - Consider adding an explicit encoding parameter for file reading operations

4. **Security**
   - The script reads files from paths derived from user input
   - Path validation should be implemented to prevent unauthorized access

## Usage Example

```bash
python3 BazelSourceAnalyzer.py /path/to/workspace //bazel/target/path:name
```

This would:
1. Set the workspace root to `/path/to/workspace`
2. Analyze the target `//tools/private/update_deps:args`
3. Print a JSON representation of the dependency tree to stdout