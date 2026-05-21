from pathlib import Path
from datetime import datetime
import shutil

def make_backup(paths: list[Path]) -> Path:
    target = Path('/workspace/blog-studio/backups') / datetime.now().strftime('%Y-%m-%d-%H%M%S')
    target.mkdir(parents=True, exist_ok=True)
    for p in paths:
        if p.exists() and p.is_file():
            shutil.copy2(p, target / p.name)
    return target
