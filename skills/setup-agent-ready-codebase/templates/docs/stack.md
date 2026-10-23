# Stack

The tools this project uses, chosen with the user during setup. The other docs name the job; this table says which tool does it.

| Job | Tool |
| --- | --- |
| `<JOB, e.g. dependency manager>` | `<TOOL>` |

Rules:

- **New parts start on the chosen tool; an existing part moves over as it is changed.** Where a part cannot move piecemeal (a web framework's routes, a backend's HTTP layer), it keeps its framework and only new projects use the chosen one.
- **One tool per job.** Adding a second tool for a job already in the table needs the user's approval and a row change.
- **Agent guides stay installed.** When a tool ships an agent guide or skill, it is installed, committed with its lockfile, and pointed at from the instructions file, so every worktree has it.
- **Every tool runs offline.** A tool that needs a paid token or a hosted account to run in a worktree is swapped for one that runs offline, and an unmaintained tool for a maintained one.
