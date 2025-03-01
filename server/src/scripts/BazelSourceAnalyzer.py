import json
import subprocess
import os
import re
from typing import Set, Dict

SRC_REGEX = r"^source "

LIB_REGEX = r"^.*_library"

def generate_source_file_path(workspace_root: str, source_path: str) -> str:
    removed_double_slash = source_path.replace(r"//", r"")
    replaced_colon = removed_double_slash.replace(":", "/")
    return os.path.join(workspace_root, replaced_colon)

def analyze_target(workspace_root: str, target: str, visited_src: Set, visited_lib: Set) -> Dict:
    
    current_target = {}
    current_target["source_files"] = {}
    current_target["dependent_libraries"] = {}
    current_target["target_path"] = target

    libs_to_search = []
    
    try:
        cquery_result = subprocess.run(
            ["bazel", "cquery", f"deps({target}, 1)", "--output=label_kind"],
            cwd=workspace_root,
            capture_output=True,
        )
        for line in cquery_result.stdout.decode("utf-8").splitlines():
            cquery_target = line.split(" ")[2]
            if not cquery_target.startswith(r"//"):
                continue
            
            if re.match(SRC_REGEX, line) and cquery_target not in visited_src:
                visited_src.add(cquery_target)
                with open(generate_source_file_path(workspace_root, cquery_target), "r") as f:
                    current_target["source_files"][cquery_target] = f.read()
                    
            elif re.match(LIB_REGEX, line) and cquery_target not in visited_lib:
                visited_lib.add(cquery_target)
                if cquery_target != target:
                    libs_to_search.append(cquery_target)
            
        for lib in libs_to_search:
            current_target["dependent_libraries"][lib] = analyze_target(workspace_root, lib, visited_src, visited_lib)
        
        return current_target
                
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Analyze Bazel target source files")
    parser.add_argument("workspace_root", help="Path to Bazel workspace root")
    parser.add_argument("target", help="Bazel target to analyze")
    
    args = parser.parse_args()
    
    visited_src = set()
    visited_lib = set()
    print(json.dumps(analyze_target(args.workspace_root, args.target, visited_src, visited_lib), indent=2))
