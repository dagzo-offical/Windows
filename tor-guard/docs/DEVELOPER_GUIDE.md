# Developer guide

## Layout

```
src/tor_guard/
  cli.py            Typer CLI (thin presentation layer)
  context.py        dependency-injection container (build_context)
  orchestrator.py   start/stop/verify sequences (testable, fail-closed)
  config.py         validated YAML -> frozen Config
  constants.py      paths, table names, defaults, exit codes
  exceptions.py     exception hierarchy (all -> stay locked)
  logging_config.py structured logs + secret/IP redaction + audit log
  platform.py       OS/init/firewall support checks
  privileges.py     root checks, uid resolution, permission guards
  services.py       systemctl wrapper
  state.py          persisted protection state + legal transitions
  subprocess_runner.py  single guarded subprocess gateway
  firewall/  generator, validator, manager, integrity, models
  tor/       manager, controller (cookie auth), bootstrap, health
  network/   dns, routes (tri-state verify), leak_tests, interfaces
  monitor/   daemon, checks, run (systemd entrypoint)
  install/   installer, backup, rollback, manifest
  diagnostics/ doctor, report
```

### Deviations from the reference layout

- `services.py` — shared systemd wrapper used by `tor.manager` and
  `install.installer` (keeps systemd calls in one place).
- `context.py` + `orchestrator.py` — added so the CLI stays thin and the
  security-critical start/stop logic is unit-testable with injected fakes.

## Dependency injection

Every collaborator that touches the outside world (subprocess, sockets, HTTP,
systemd) is injectable. `context.build_context(config)` wires the production
implementations; tests build an `AppContext` (or pass fakes directly) to drive
fail-closed paths without root/Tor/network. See `tests/unit/test_orchestrator.py`
and `tests/conftest.py`'s `FakeRunner`.

## Subprocess rules (enforced in one place)

All external commands go through `subprocess_runner.SubprocessRunner`:
no `shell=True`, argv lists only, mandatory timeouts, captured output, checked
return codes, missing-binary → `DependencyError`, redacted logging. Do not call
`subprocess` anywhere else.

## Adding a firewall rule

1. Change `firewall/generator.py` (pure function of `RulesetParams`).
2. Add/adjust a unit test in `tests/unit/test_generator.py`, including the live
   `nft -c` assertion.
3. Run `make nft-check` and `make test`.
4. If it introduces a new table/chain that must stay `drop`, add it to
   `firewall/integrity.py`'s `_REQUIRED` and to `manager.remove_tor_guard_tables`.

## Local quality loop

```bash
make format      # black + ruff --fix
make all         # ruff + mypy(strict) + bandit + shellcheck + unit tests
make nft-check   # validate the generated ruleset
```

Targets: no ruff errors, black-clean, mypy-strict clean, no high-severity
Bandit, shellcheck-clean, all unit tests passing. Accepted lint findings are
documented in `pyproject.toml` (`UP042`, `SIM105`, Bandit `B404`/`B603`, and
inline `# noqa`/`# nosec` with justification).

## Coding conventions

- Type-annotate everything (mypy strict).
- Prefer frozen dataclasses for value objects.
- Errors mean "stay locked" — never add a code path that opens clearnet on
  failure.
- Never log the real public IP; route user-facing text through the redactor
  where secrets may appear.

## Releasing

1. `make all` green; `make nft-check` green.
2. Run the VM matrix (`vm-tests/`) on each supported distro; archive results.
3. Update `docs/CHANGELOG.md`.
4. Tag; CI runs the static + unit + integration jobs.
