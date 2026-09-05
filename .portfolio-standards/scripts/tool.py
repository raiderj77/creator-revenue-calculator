"""Run a release-locked scanner without package installs or install scripts."""
import argparse
import hashlib
import io
import json
import os
from pathlib import Path
import platform
import subprocess
import tarfile
import tempfile
import urllib.request
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def digest(data):
    return 'sha256:' + hashlib.sha256(data).hexdigest()


def unpack(data, asset_name, executable):
    if asset_name.endswith('.zip'):
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            matches = [n for n in archive.namelist() if n.split('/')[-1] == executable]
            if len(matches) != 1:
                raise ValueError('Expected exactly one executable')
            return archive.read(matches[0])
    if asset_name.endswith('.tar.gz'):
        with tarfile.open(fileobj=io.BytesIO(data), mode='r:gz') as archive:
            matches = [m for m in archive.getmembers() if m.isfile() and m.name.split('/')[-1] == executable]
            if len(matches) != 1:
                raise ValueError('Expected exactly one regular executable')
            return archive.extractfile(matches[0]).read()
    return data


def install(name):
    system = platform.system().lower()
    if system not in ('windows', 'linux') or platform.machine().lower() not in ('amd64', 'x86_64'):
        raise ValueError('Supported platforms: Windows/Linux x86_64')
    lock = json.loads((ROOT / 'config/tools.lock.json').read_text())
    tool = lock[name]
    assets = [a for a in tool['assets'] if system in a['name']]
    if len(assets) != 1:
        raise ValueError('Expected one locked platform asset')
    asset = assets[0]
    expected = asset['digest']
    if not expected or not expected.startswith('sha256:') or len(expected) != 71:
        raise ValueError('Missing SHA-256 digest')
    url = asset['browser_download_url']
    if not url.startswith(f"https://github.com/{tool['repo']}/releases/download/{tool['version']}/"):
        raise ValueError('Asset is outside the locked upstream release')
    cache = ROOT / '.local/tools' / name / tool['version']
    cache.mkdir(parents=True, exist_ok=True)
    archive = cache / asset['name']
    if archive.exists():
        data = archive.read_bytes()
    else:
        with urllib.request.urlopen(url, timeout=120) as response:
            data = response.read()
    if digest(data) != expected:
        raise ValueError('Release archive checksum mismatch; refusing execution')
    if not archive.exists():
        with tempfile.NamedTemporaryFile(dir=cache, delete=False) as staging:
            staging.write(data)
            staging_path = Path(staging.name)
        os.replace(staging_path, archive)
    executable = ('osv-scanner' if name == 'osv' else name) + ('.exe' if system == 'windows' else '')
    # Separate executables let concurrent scans run on Windows without locking
    # or overwriting one another's running program.
    fd, output_name = tempfile.mkstemp(prefix='run-', suffix='-' + executable, dir=cache)
    os.close(fd)
    output = Path(output_name)
    output.write_bytes(unpack(data, asset['name'], executable))
    output.chmod(0o755)
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('tool', choices=['actionlint', 'gitleaks', 'osv', 'zizmor', 'pinact'])
    parser.add_argument('args', nargs=argparse.REMAINDER)
    args = parser.parse_args()
    command_args = args.args[1:] if args.args[:1] == ['--'] else args.args
    try:
        executable = install(args.tool)
        try:
            return subprocess.run([str(executable), *command_args], check=False).returncode
        finally:
            executable.unlink(missing_ok=True)
    except (ValueError, OSError) as error:
        print(f'Tool setup failed: {error}')
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
