# UX Naming Refinement Design

**Date**: 2026-04-13
**Status**: Approved

## Overview

Refine operation naming and descriptions in the BangumiTV n8n node to comply with n8n UX guidelines while maintaining clarity with Bangumi API terminology.

## Background

The current node has some naming inconsistencies with n8n UX guidelines:
1. "Create or Update" doesn't reflect Bangumi's "collect" terminology
2. Collection resource descriptions use non-standard vocabulary ("View" vs "Retrieve")
3. Batch update operations don't follow "Update Many" convention
4. "Status" suffix is redundant with "Collection" terminology

## Design Decisions

### 1. Subject: "Create or Update" → "Collect or Update Collection"

**Rationale**: Bangumi UI uses "collect" (收藏) terminology, not "create". This change aligns with the service's actual language.

| Field | Current | New |
|-------|---------|-----|
| name | `Create or Update Collection Status` | `Collect or Update Collection` |
| action | `Create or update subject collection status` | `Collect or update subject collection` |
| description | `Create or update your watch status for a subject` | `Collect a subject or update an existing collection` |

**Files to modify**:
- `nodes/BangumitvApi/actions/subject/Subject.resource.ts`

---

### 2. Collection: Description and Action Standardization

**Rationale**: n8n UX guidelines specify "Retrieve" or "List" as standard vocabulary, not "View". Also omit articles ("a user's" → "user"). Actions should clearly indicate user context.

| Operation | Current action | New action | Current Description | New Description |
|-----------|----------------|------------|---------------------|-----------------|
| Get Many | `Get many collections` | `Get many user collections` | `View a user's collected subjects` | `Retrieve collected subjects for a user` |
| Get Character Collection | `Get character collection` | `Get user's character collection` | `View a user's collected character` | `Retrieve collected character for a user` |
| Get Many Character Collections | `Get many character collections` | `Get many user character collections` | `View a user's collected characters` | `Retrieve collected characters for a user` |
| Get Person Collection | `Get person collection` | `Get user's person collection` | `View a user's collected person` | `Retrieve collected person for a user` |
| Get Many Person Collections | `Get many person collections` | `Get many user person collections` | `View a user's collected persons` | `Retrieve collected persons for a user` |

**Files to modify**:
- `nodes/BangumitvApi/actions/collection/Collection.resource.ts`

---

### 3. Episode: "Update Statuses" → "Update Many Collections"

**Rationale**: n8n UX guidelines recommend "Update Many" for batch operations, not plural "Statuses".

| Operation | Current name | New name | Current action | New action |
|-----------|--------------|----------|----------------|------------|
| Get Collection Status | `Get Collection Status` | `Get Collection` | `Get episode collection status` | `Get episode collection` |
| Get Many Collection Statuses | `Get Many Collection Statuses` | `Get Many Collections` | `Get many episode collection statuses` | `Get many episode collections` |
| Update Collection Status | `Update Collection Status` | `Update Collection` | `Update episode collection status` | `Update episode collection` |
| Update Collection Statuses | `Update Collection Statuses` | `Update Many Collections` | `Update episode collection statuses` | `Update many episode collections` |

**Files to modify**:
- `nodes/BangumitvApi/actions/episode/Episode.resource.ts`

---

### 4. Subject: Remove "Status" Suffix

**Rationale**: "Collection" already implies status/watch state. The "Status" suffix is redundant.

| Operation | Current name | New name | Current action | New action |
|-----------|--------------|----------|----------------|------------|
| Get Collection Status | `Get Collection Status` | `Get Collection` | `Get subject collection status` | `Get subject collection` |
| Update Collection Status | `Update Collection Status` | `Update Collection` | `Update subject collection status` | `Update subject collection` |

**Note**: `Create or Update Collection Status` is already covered in change #1.

**Files to modify**:
- `nodes/BangumitvApi/actions/subject/Subject.resource.ts`

---

## Implementation Summary

| File | Changes |
|------|---------|
| `actions/subject/Subject.resource.ts` | Update 3 operations |
| `actions/episode/Episode.resource.ts` | Update 4 operations |
| `actions/collection/Collection.resource.ts` | Update 5 actions and descriptions |

---

## Testing Checklist

- [ ] Verify all operations appear correctly in n8n UI dropdown
- [ ] Test each modified operation still works with API
- [ ] Run linter to ensure no type errors
- [ ] Check displayOptions still reference correct operation values

---

## References

- n8n UX Guidelines: https://docs.n8n.io/integrations/creating-nodes/build/reference/ux-guidelines
- Bangumi API: https://github.com/bangumi/api
