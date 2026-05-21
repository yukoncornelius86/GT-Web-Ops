import subprocess
from pathlib import Path

ROOT = Path('/workspace')

def run_git(args: list[str]) -> tuple[bool, str]:
    try:
        p = subprocess.run(['git', *args], cwd=ROOT, capture_output=True, text=True, check=False)
        return p.returncode == 0, (p.stdout + p.stderr).strip()
    except Exception as e:
        return False, str(e)
