import os
import sys
import time
from rich.progress import track

print(os.path.expanduser("~"))

print(" ".join(sys.argv[1:]))

for i in track(range(100)):
    time.sleep(0.05)
