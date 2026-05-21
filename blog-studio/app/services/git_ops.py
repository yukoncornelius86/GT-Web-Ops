import subprocess
from pathlib import Path

ROOT = Path('/workspace')


def run_git(args: list[str]) -> tuple[bool, str]:
    try:
        p = subprocess.run(['git', *args], cwd=ROOT, capture_output=True, text=True, check=False)
        return p.returncode == 0, (p.stdout + p.stderr).strip()
    except Exception as e:
        return False, str(e)


def status() -> str:
    ok, out = run_git(['status', '--short'])
    return out if ok else f'error: {out}'


def current_branch() -> str:
    ok, out = run_git(['branch', '--show-current'])
    return out if ok else 'n/a'


def commit(message: str) -> tuple[bool, str]:
    return run_git(['commit', '-m', message])


def pull(remote: str, branch: str) -> tuple[bool, str]:
    return run_git(['pull', remote, branch])


def push(remote: str, branch: str) -> tuple[bool, str]:
    return run_git(['push', remote, branch])
