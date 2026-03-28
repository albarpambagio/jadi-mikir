# Errors

Command failures, exceptions, and integration/tool failures. Append new entries at the bottom.

**ID format**: `ERR-YYYYMMDD-XXX` (see [`.agents/skills/self-improvement/SKILL.md`](../.agents/skills/self-improvement/SKILL.md)).

## Entry template

```markdown
## [ERR-YYYYMMDD-XXX] skill_or_command_name

**Logged**: ISO-8601 timestamp
**Priority**: high
**Status**: pending
**Area**: frontend | backend | infra | tests | docs | config

### Summary
Brief description of what failed

### Error
```
Actual error message or output
```

### Context
- Command/operation attempted
- Input or parameters used
- Environment details if relevant

### Suggested Fix
If identifiable, what might resolve this

### Metadata
- Reproducible: yes | no | unknown
- Related Files: path/to/file.ext
- See Also: ERR-20250110-001 (if recurring)

---
```

---
