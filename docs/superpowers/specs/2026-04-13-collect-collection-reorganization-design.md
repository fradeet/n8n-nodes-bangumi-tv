# Collect & Collection Resource Reorganization Design

**Date**: 2026-04-13
**Status**: Draft
**Author**: Claude Code
**Reviewer**: fradeet
**Supersedes**: Partially updates `2026-04-12-naming-normalization-design.md` section 2 (Resource Architecture)

## 1. Overview

### 1.1 Problem

The `Me` resource currently has **14 operations**, mixing two fundamentally different concepts:

1. **Collect** (binary toggle): simple "collect/uncollect" for Character, Person, Index via `/v0/{entity}/{id}/collect`
2. **Collection** (rich state management): subject watch status management via `/v0/users/-/collections/...` with type, rating, comment, tags, and privacy

Additionally, the `User` resource has **5 read-only collection viewing operations** that conceptually belong together but are squeezed between user profile operations.

### 1.2 Goal

Reorganize resources so that **operations follow their object entity**, following n8n UX guidelines and official node patterns (e.g., Twitter Like is a `Tweet` operation, not a separate resource).

### 1.3 Rules

1. **Binary collect actions** (Character/Person/Index) move to their respective entity resources, following the n8n Twitter Like pattern
2. **Subject collection management** moves to `Subject` resource — the operation object is the subject
3. **Episode collection management** moves to `Episode` resource — the operation object is the episode
4. **Read-only collection viewing** (from User) moves to a new `Collection` resource — a dedicated public-facing resource for viewing any user's collections
5. `Me` resource retains only `Get` (current user profile)
6. `User` resource retains only `Get` and `Get Avatar`

### 1.4 Naming Disambiguation

The word "Collection" appears in both a resource name and operation names. Use **alternative wording in descriptions** to help disambiguate:

- **Collection resource** descriptions: use wording like "View a user's collected subjects", "View a user's collected characters"
- **Subject/Episode "Collection Status"** descriptions: use wording like "Retrieve your watch status and rating", "Update your viewing progress"

## 2. Resource Architecture (After Reorganization)

```
┌──────────────────────────────────────────────────────┐
│ Resource: Collection (NEW — public read-only)        │
│  Get Many                                            │
│  Get Character Collection                            │
│  Get Many Character Collections                      │
│  Get Person Collection                               │
│  Get Many Person Collections                         │
├──────────────────────────────────────────────────────┤
│ Resource: Subject (8 → 11)                           │
│  Get, Get Calendar, Get Image, Get Many, Search      │
│  Get Many Characters, Get Many Persons               │
│  Get Many Related Subjects                           │
│  ── new ──                                           │
│  Get Collection Status                               │
│  Create or Update Collection Status                  │
│  Update Collection Status                            │
├──────────────────────────────────────────────────────┤
│ Resource: Episode (2 → 6)                            │
│  Get, Get Many                                       │
│  ── new ──                                           │
│  Get Collection Status                               │
│  Get Many Collection Statuses                        │
│  Update Collection Status                            │
│  Update Collection Statuses                          │
├──────────────────────────────────────────────────────┤
│ Resource: Character (5 → 7)                          │
│  + Collect, Uncollect                                │
├──────────────────────────────────────────────────────┤
│ Resource: Person (5 → 7)                             │
│  + Collect, Uncollect                                │
├──────────────────────────────────────────────────────┤
│ Resource: Index (7 → 9)                              │
│  + Collect, Uncollect                                │
├──────────────────────────────────────────────────────┤
│ Resource: Me (14 → 1)                                │
│  Get                                                 │
├──────────────────────────────────────────────────────┤
│ Resource: User (7 → 2)                               │
│  Get, Get Avatar                                     │
├──────────────────────────────────────────────────────┤
│ Resource: Revision (unchanged)                       │
└──────────────────────────────────────────────────────┘
```

## 3. Detailed Operation Mapping

### 3.1 Collection Resource (NEW)

Public, read-only resource for viewing any user's collections.

| Operation Name | value | action | API Endpoint | Migrated From |
|---|---|---|---|---|
| Get Many | `getMany` | Get many collections | `GET /v0/users/{username}/collections` | User |
| Get Character Collection | `getCharacterCollection` | Get character collection | `GET /v0/users/{username}/collections/-/characters/{characterId}` | User |
| Get Many Character Collections | `getCharacterCollections` | Get many character collections | `GET /v0/users/{username}/collections/-/characters` | User |
| Get Person Collection | `getPersonCollection` | Get person collection | `GET /v0/users/{username}/collections/-/persons/{personId}` | User |
| Get Many Person Collections | `getPersonCollections` | Get many person collections | `GET /v0/users/{username}/collections/-/persons` | User |

### 3.2 Subject Resource — New Operations

Collection status management for current user (auth required).

| Operation Name | value | action | API Endpoint | Migrated From |
|---|---|---|---|---|
| Get Collection Status | `getCollection` | Get subject collection status | `GET /v0/users/-/collections/{subjectId}` | Me |
| Create or Update Collection Status | `createOrUpdateCollection` | Create or update subject collection status | `POST /v0/users/-/collections/{subjectId}` | Me |
| Update Collection Status | `updateCollection` | Update subject collection status | `PATCH /v0/users/-/collections/{subjectId}` | Me |

### 3.3 Episode Resource — New Operations

Episode collection (watch progress) management for current user (auth required).

| Operation Name | value | action | API Endpoint | Migrated From |
|---|---|---|---|---|
| Get Collection Status | `getCollection` | Get episode collection status | `GET /v0/users/-/collections/-/episodes/{episodeId}` | Me |
| Get Many Collection Statuses | `getCollections` | Get many episode collection statuses | `GET /v0/users/-/collections/{subjectId}/episodes` | Me |
| Update Collection Status | `updateCollection` | Update episode collection status | `PUT /v0/users/-/collections/-/episodes/{episodeId}` | Me |
| Update Collection Statuses | `updateCollections` | Update episode collection statuses | `PATCH /v0/users/-/collections/{subjectId}/episodes` | Me |

### 3.4 Character Resource — New Operations

| Operation Name | value | action | API Endpoint | Migrated From |
|---|---|---|---|---|
| Collect | `collect` | Collect character | `POST /v0/characters/{characterId}/collect` | Me |
| Uncollect | `uncollect` | Uncollect character | `DELETE /v0/characters/{characterId}/collect` | Me |

### 3.5 Person Resource — New Operations

| Operation Name | value | action | API Endpoint | Migrated From |
|---|---|---|---|---|
| Collect | `collect` | Collect person | `POST /v0/persons/{personId}/collect` | Me |
| Uncollect | `uncollect` | Uncollect person | `DELETE /v0/persons/{personId}/collect` | Me |

### 3.6 Index Resource — New Operations

| Operation Name | value | action | API Endpoint | Migrated From |
|---|---|---|---|---|
| Collect | `collect` | Collect index | `POST /v0/indices/{indexId}/collect` | Me |
| Uncollect | `uncollect` | Uncollect index | `DELETE /v0/indices/{indexId}/collect` | Me |

### 3.7 Me Resource — After Cleanup

Only 1 operation remains:

| Operation Name | value | action | API Endpoint |
|---|---|---|---|
| Get | `get` | Get current user | `GET /v0/users/-/me` |

### 3.8 User Resource — After Cleanup

2 operations remain:

| Operation Name | value | action | API Endpoint |
|---|---|---|---|
| Get | `get` | Get user | `GET /v0/users/{username}` |
| Get Avatar | `getAvatar` | Get user avatar | `GET /v0/users/{username}/avatar` |

## 4. File Structure Changes

### 4.1 New Files

```
nodes/BangumitvApi/actions/collection/
├── Collection.resource.ts
├── getMany.operation.ts          ← from user/getCollections.operation.ts
├── getCharacterCollection.operation.ts   ← from user/getCharacterCollection.operation.ts
├── getCharacterCollections.operation.ts  ← from user/getCharacterCollections.operation.ts
├── getPersonCollection.operation.ts      ← from user/getPersonCollection.operation.ts
└── getPersonCollections.operation.ts     ← from user/getPersonCollections.operation.ts

nodes/BangumitvApi/actions/subject/
├── getCollection.operation.ts            ← from me/getCollection.operation.ts
├── createOrUpdateCollection.operation.ts ← from me/createOrUpdateCollection.operation.ts
└── updateCollection.operation.ts         ← from me/updateCollection.operation.ts

nodes/BangumitvApi/actions/episode/
├── getCollection.operation.ts            ← from me/getEpisode.operation.ts
├── getCollections.operation.ts           ← from me/getEpisodes.operation.ts
├── updateCollection.operation.ts         ← from me/updateEpisode.operation.ts
└── updateCollections.operation.ts        ← from me/updateEpisodes.operation.ts

nodes/BangumitvApi/actions/character/
├── collect.operation.ts                  ← from me/createCharacterCollect.operation.ts
└── uncollect.operation.ts                ← from me/deleteCharacterCollect.operation.ts

nodes/BangumitvApi/actions/person/
├── collect.operation.ts                  ← from me/createPersonCollect.operation.ts
└── uncollect.operation.ts                ← from me/deletePersonCollect.operation.ts

nodes/BangumitvApi/actions/index/
├── collect.operation.ts                  ← from me/createIndexCollect.operation.ts
└── uncollect.operation.ts                ← from me/deleteIndexCollect.operation.ts
```

### 4.2 Files to Remove

```
nodes/BangumitvApi/actions/me/
├── createCharacterCollect.operation.ts   → moved to character/collect.operation.ts
├── deleteCharacterCollect.operation.ts   → moved to character/uncollect.operation.ts
├── createPersonCollect.operation.ts      → moved to person/collect.operation.ts
├── deletePersonCollect.operation.ts      → moved to person/uncollect.operation.ts
├── createIndexCollect.operation.ts       → moved to index/collect.operation.ts
├── deleteIndexCollect.operation.ts       → moved to index/uncollect.operation.ts
├── getCollection.operation.ts            → moved to subject/getCollection.operation.ts
├── createOrUpdateCollection.operation.ts → moved to subject/createOrUpdateCollection.operation.ts
├── updateCollection.operation.ts         → moved to subject/updateCollection.operation.ts
├── getEpisode.operation.ts               → moved to episode/getCollection.operation.ts
├── getEpisodes.operation.ts              → moved to episode/getCollections.operation.ts
├── updateEpisode.operation.ts            → moved to episode/updateCollection.operation.ts
└── updateEpisodes.operation.ts           → moved to episode/updateCollections.operation.ts

nodes/BangumitvApi/actions/user/
├── getCollections.operation.ts           → moved to collection/getMany.operation.ts
├── getCharacterCollection.operation.ts   → moved to collection/getCharacterCollection.operation.ts
├── getCharacterCollections.operation.ts  → moved to collection/getCharacterCollections.operation.ts
├── getPersonCollection.operation.ts      → moved to collection/getPersonCollection.operation.ts
└── getPersonCollections.operation.ts     → moved to collection/getPersonCollections.operation.ts
```

### 4.3 Files to Keep (Modified)

```
nodes/BangumitvApi/actions/me/Me.resource.ts          ← slimmed to 1 operation
nodes/BangumitvApi/actions/user/User.resource.ts      ← slimmed to 2 operations
nodes/BangumitvApi/actions/subject/Subject.resource.ts ← +3 collection operations
nodes/BangumitvApi/actions/episode/Episode.resource.ts ← +4 collection operations
nodes/BangumitvApi/actions/character/Character.resource.ts ← +2 collect/uncollect
nodes/BangumitvApi/actions/person/Person.resource.ts      ← +2 collect/uncollect
nodes/BangumitvApi/actions/index/Index.resource.ts        ← +2 collect/uncollect
nodes/BangumitvApi/actions/descriptions.ts                 ← add Collection resource
```

## 5. displayOptions and Credential Considerations

- **Collection resource**: Public read-only API endpoints (no auth needed at API level), but OAuth2 credential is required at node level since Bangumi API applies stricter rate limits to unauthenticated requests
- **Subject/Episode collection operations**: Require OAuth2 credential (current user operations)
- **Character/Person/Index collect/uncollect**: Require OAuth2 credential
- The credential is set at the node level, so no per-operation credential changes needed

## 6. Out of Scope

- Renaming existing operations that are not moving (e.g., Subject's existing 8 operations)
- Adding new API operations not currently implemented
- Changing the credential model
- Changes to test files (tests will be updated to match new file locations)
