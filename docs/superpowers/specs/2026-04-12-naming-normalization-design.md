# Naming Normalization & Resource Restructuring Design

**Date**: 2026-04-12
**Status**: Approved
**Author**: Claude Code
**Reviewer**: fradeet

## 1. Overview

### 1.1 Goal
Restructure resource/operation naming to conform to n8n UX guidelines, introduce a Me resource for current-user-only operations, and eliminate the Collection resource by redistributing its operations.

### 1.2 Scope
- Rename all operations to follow n8n naming conventions (Title Case name, Sentence Case action/description)
- Add Me resource, remove Collection resource
- Move operations between resources based on API ownership semantics
- Apply consistent Get Many / Search / Create / Update / Delete vocabulary

### 1.3 Rules Applied
1. Follow n8n UX guidelines (omit articles, repeat resource in action, use alternative wording in description)
2. Move user-related operations to User resource
3. Add Me resource for current-user-only operations (Collect/Uncollect, self collections)
4. Use Get Many for batch retrieval without search; use Search for keyword-based retrieval
5. Subject collection uses Create or Update (upsert); other Collect uses Create
6. Related operations: add "related" to action and description (not name)
7. Related operations use Get Many (one-to-many relationship)
8. All `getAll` values renamed to `getMany`

## 2. Resource Architecture

### 2.1 Summary

| Change | Detail |
|--------|--------|
| Add Me resource | 14 operations for current authenticated user |
| Remove Collection resource | Operations redistributed to Me and User |
| User resource expanded | +5 operations from Collection |
| Character/Person shrunk | -2 each (Collect/Uncollect → Me) |
| Index shrunk | -2 (Collect/Uncollect → Me), Edit→Update, Remove→Delete |
| Revision normalized | Batch ops use "Get Many" |
| Total resources | 8 → 8 (Me replaces Collection) |
| Total operations | 56 (was 56, redistribution only) |

### 2.2 Directory Structure Change

```
nodes/BangumitvApi/actions/
├── descriptions.ts
├── common.descriptions.ts
├── subject/           # 8 ops (unchanged count)
├── episode/           # 2 ops
├── character/         # 5 ops (-2 collect/uncollect)
├── person/            # 5 ops (-2 collect/uncollect)
├── user/              # 7 ops (+5 from collection, -1 getMyself)
├── me/                # 14 ops (NEW)
├── revision/          # 8 ops
└── index/             # 7 ops (-2 collect/uncollect)
```

Collection directory deleted entirely.

## 3. Operation Mapping

### 3.1 Subject (8 ops)

| Name | value | action | description |
|------|-------|--------|-------------|
| Get | `get` | Get subject | Retrieve a subject by ID |
| Get Many | `getMany` | Get many subjects | Browse subjects with filters |
| Search | `search` | Search subjects | Search subjects by keyword |
| Get Calendar | `getCalendar` | Get calendar | Retrieve daily broadcast schedule for subjects |
| Get Image | `getImage` | Get subject image | Retrieve subject image |
| Get Many Characters | `getCharacters` | Get related characters for subject | Retrieve related characters for a subject |
| Get Many Persons | `getPersons` | Get related persons for subject | Retrieve related persons for a subject |
| Get Many Related Subjects | `getRelations` | Get related subjects for subject | Retrieve related subjects for a subject |

**Changes from current:**
- `getAll` → `getMany`
- `Get Persons` → `Get Many Persons` (related, one-to-many)
- `Get Characters` → `Get Many Characters` (related, one-to-many)
- `Get Relations` → `Get Many Related Subjects` (related, returns subjects)
- action/description for getCharacters, getPersons, getRelations now include "related"

### 3.2 Episode (2 ops)

| Name | value | action | description |
|------|-------|--------|-------------|
| Get | `get` | Get episode | Retrieve an episode by ID |
| Get Many | `getMany` | Get many episodes | Retrieve episodes for a subject |

**Changes from current:**
- `getAll` → `getMany`

### 3.3 Character (5 ops)

| Name | value | action | description |
|------|-------|--------|-------------|
| Get | `get` | Get character | Retrieve a character by ID |
| Search | `search` | Search characters | Search characters by keyword |
| Get Image | `getImage` | Get character image | Retrieve character image |
| Get Many Subjects | `getSubjects` | Get related subjects for character | Retrieve related subjects for a character |
| Get Many Persons | `getPersons` | Get related persons for character | Retrieve related persons for a character |

**Changes from current:**
- Removed `collect` → moved to Me as `createCharacterCollect`
- Removed `uncollect` → moved to Me as `deleteCharacterCollect`
- `Get Subjects` → `Get Many Subjects` (related, one-to-many)
- `Get Persons` → `Get Many Persons` (related, one-to-many)
- action/description for getSubjects, getPersons now include "related"

### 3.4 Person (5 ops)

| Name | value | action | description |
|------|-------|--------|-------------|
| Get | `get` | Get person | Retrieve a person by ID |
| Search | `search` | Search persons | Search persons by keyword |
| Get Image | `getImage` | Get person image | Retrieve person image |
| Get Many Subjects | `getSubjects` | Get related subjects for person | Retrieve related subjects for a person |
| Get Many Characters | `getCharacters` | Get related characters for person | Retrieve related characters for a person |

**Changes from current:**
- Removed `collect` → moved to Me as `createPersonCollect`
- Removed `uncollect` → moved to Me as `deletePersonCollect`
- `Get Subjects` → `Get Many Subjects` (related, one-to-many)
- `Get Characters` → `Get Many Characters` (related, one-to-many)
- action/description for getSubjects, getCharacters now include "related"

### 3.5 User (7 ops)

| Name | value | action | description |
|------|-------|--------|-------------|
| Get | `get` | Get user | Retrieve user profile by username |
| Get Avatar | `getAvatar` | Get user avatar | Retrieve user avatar by username |
| Get Many Collections | `getCollections` | Get many user collections | Retrieve subject collections for user |
| Get Many Character Collections | `getCharacterCollections` | Get many user character collections | Retrieve character collections for user |
| Get Character Collection | `getCharacterCollection` | Get user character collection | Retrieve single character collection for user |
| Get Many Person Collections | `getPersonCollections` | Get many user person collections | Retrieve person collections for user |
| Get Person Collection | `getPersonCollection` | Get user person collection | Retrieve single person collection for user |

**Changes from current:**
- Removed `getMyself` → moved to Me as `get`
- Added 5 operations from Collection resource (any-user-visible collection queries)
- `Get Collections` → `Get Many Collections`

### 3.6 Me (14 ops) — NEW RESOURCE

| Name | value | action | description |
|------|-------|--------|-------------|
| Get | `get` | Get current user | Retrieve current authenticated user profile |
| Get Collection | `getCollection` | Get subject collection for current user | Retrieve subject collection status for current user |
| Create or Update Collection | `createOrUpdateCollection` | Create or update subject collection for current user | Create a new subject collection or update existing one |
| Update Collection | `updateCollection` | Update subject collection for current user | Update subject collection status for current user |
| Get Many Episodes | `getEpisodes` | Get many episode collections for current user | Retrieve episode collection statuses for a subject |
| Update Episodes | `updateEpisodes` | Update episode collections for current user | Update episode collection statuses for a subject |
| Get Episode | `getEpisode` | Get episode collection for current user | Retrieve single episode collection status |
| Update Episode | `updateEpisode` | Update episode collection for current user | Update single episode collection status |
| Create Character Collection | `createCharacterCollect` | Create character collection for current user | Add character to current user's collection |
| Delete Character Collection | `deleteCharacterCollect` | Delete character collection for current user | Remove character from current user's collection |
| Create Person Collection | `createPersonCollect` | Create person collection for current user | Add person to current user's collection |
| Delete Person Collection | `deletePersonCollect` | Delete person collection for current user | Remove person from current user's collection |
| Create Index Collection | `createIndexCollect` | Create index collection for current user | Add index to current user's collection |
| Delete Index Collection | `deleteIndexCollect` | Delete index collection for current user | Remove index from current user's collection |

**API endpoint mapping:**

| Operation | HTTP | Endpoint |
|-----------|------|----------|
| Get | GET | `/v0/me` |
| Get Collection | GET | `/v0/users/-/collections/{subject_id}` |
| Create or Update Collection | POST | `/v0/users/-/collections/{subject_id}` |
| Update Collection | PATCH | `/v0/users/-/collections/{subject_id}` |
| Get Many Episodes | GET | `/v0/users/-/collections/{subject_id}/episodes` |
| Update Episodes | PATCH | `/v0/users/-/collections/{subject_id}/episodes` |
| Get Episode | GET | `/v0/users/-/collections/-/episodes/{episode_id}` |
| Update Episode | PUT | `/v0/users/-/collections/-/episodes/{episode_id}` |
| Create Character Collection | POST | `/v0/characters/{character_id}/collect` |
| Delete Character Collection | DELETE | `/v0/characters/{character_id}/collect` |
| Create Person Collection | POST | `/v0/persons/{person_id}/collect` |
| Delete Person Collection | DELETE | `/v0/persons/{person_id}/collect` |
| Create Index Collection | POST | `/v0/indices/{index_id}/collect` |
| Delete Index Collection | DELETE | `/v0/indices/{index_id}/collect` |

### 3.7 Revision (8 ops)

| Name | value | action | description |
|------|-------|--------|-------------|
| Get Subject Revision | `getSubjectRevision` | Get subject revision | Retrieve a subject revision by ID |
| Get Many Subject Revisions | `getSubjectRevisions` | Get many subject revisions | Retrieve revision history for a subject |
| Get Episode Revision | `getEpisodeRevision` | Get episode revision | Retrieve an episode revision by ID |
| Get Many Episode Revisions | `getEpisodeRevisions` | Get many episode revisions | Retrieve revision history for an episode |
| Get Character Revision | `getCharacterRevision` | Get character revision | Retrieve a character revision by ID |
| Get Many Character Revisions | `getCharacterRevisions` | Get many character revisions | Retrieve revision history for a character |
| Get Person Revision | `getPersonRevision` | Get person revision | Retrieve a person revision by ID |
| Get Many Person Revisions | `getPersonRevisions` | Get many person revisions | Retrieve revision history for a person |

**Changes from current:**
- Batch operations renamed from "Get X Revisions" to "Get Many X Revisions"

### 3.8 Index (7 ops)

| Name | value | action | description |
|------|-------|--------|-------------|
| Create | `create` | Create index | Create a new index |
| Get | `get` | Get index | Retrieve an index by ID |
| Update | `update` | Update index | Update index information |
| Get Many Subjects | `getSubjects` | Get many subjects in index | Retrieve subjects in an index |
| Append Subject | `addSubject` | Append subject to index | Insert a subject into an index |
| Update Subject | `updateSubject` | Update subject in index | Update subject information in an index |
| Delete Subject | `deleteSubject` | Delete subject from index | Remove a subject from an index |

**Changes from current:**
- Removed `collect` → moved to Me as `createIndexCollect`
- Removed `uncollect` → moved to Me as `deleteIndexCollect`
- `Edit` → `Update` (n8n vocabulary)
- `Edit Subject` → `Update Subject` (n8n vocabulary)
- `Remove Subject` → `Delete Subject` (n8n vocabulary)
- `Get Subjects` → `Get Many Subjects`

## 4. Resource Selector Options

Updated alphabetical order for the resource dropdown:

| name | value |
|------|-------|
| Character | `character` |
| Episode | `episode` |
| Index | `index` |
| Me | `me` |
| Person | `person` |
| Revision | `revision` |
| Subject | `subject` |
| User | `user` |

## 5. File Changes

### 5.1 New Files

```
nodes/BangumitvApi/actions/me/
├── Me.resource.ts
├── get.operation.ts
├── getCollection.operation.ts
├── createOrUpdateCollection.operation.ts
├── updateCollection.operation.ts
├── getEpisodes.operation.ts
├── updateEpisodes.operation.ts
├── getEpisode.operation.ts
├── updateEpisode.operation.ts
├── createCharacterCollect.operation.ts
├── deleteCharacterCollect.operation.ts
├── createPersonCollect.operation.ts
├── deletePersonCollect.operation.ts
├── createIndexCollect.operation.ts
└── deleteIndexCollect.operation.ts
```

### 5.2 Deleted Files

```
nodes/BangumitvApi/actions/collection/   (entire directory, 14 files)
nodes/BangumitvApi/actions/character/collect.operation.ts
nodes/BangumitvApi/actions/character/uncollect.operation.ts
nodes/BangumitvApi/actions/person/collect.operation.ts
nodes/BangumitvApi/actions/person/uncollect.operation.ts
nodes/BangumitvApi/actions/index/collect.operation.ts
nodes/BangumitvApi/actions/index/uncollect.operation.ts
```

### 5.3 Renamed Files

| From | To |
|------|----|
| `*/getAll.operation.ts` | `*/getMany.operation.ts` (subject, episode) |
| `index/edit.operation.ts` | `index/update.operation.ts` |
| `index/editSubject.operation.ts` | `index/updateSubject.operation.ts` |
| `index/removeSubject.operation.ts` | `index/deleteSubject.operation.ts` |
| `user/getMyself.operation.ts` | DELETED (content recreated as `me/get.operation.ts`) |

### 5.4 Modified Files

- `descriptions.ts` — update imports, replace Collection with Me
- `Subject.resource.ts` — update operation names/actions/descriptions
- `Character.resource.ts` — remove collect/uncollect, update names
- `Person.resource.ts` — remove collect/uncollect, update names
- `User.resource.ts` — add Collection operations, remove getMyself
- `Revision.resource.ts` — update batch operation names
- `Index.resource.ts` — remove collect/uncollect, rename operations
- All `.operation.ts` files — update value fields where changed

## 6. Migration Mapping (Current → New)

Complete mapping of every operation from current to new structure:

### Operations staying in same resource (renamed only)

| Resource | Current value | New value | Name change |
|----------|--------------|-----------|-------------|
| Subject | `getAll` | `getMany` | Get Many |
| Subject | `getPersons` | `getPersons` | Get Persons → Get Many Persons |
| Subject | `getCharacters` | `getCharacters` | Get Characters → Get Many Characters |
| Subject | `getRelations` | `getRelations` | Get Relations → Get Many Related Subjects |
| Episode | `getAll` | `getMany` | Get Many |
| Character | `getSubjects` | `getSubjects` | Get Subjects → Get Many Subjects |
| Character | `getPersons` | `getPersons` | Get Persons → Get Many Persons |
| Person | `getSubjects` | `getSubjects` | Get Subjects → Get Many Subjects |
| Person | `getCharacters` | `getCharacters` | Get Characters → Get Many Characters |
| Index | `edit` | `update` | Edit → Update |
| Index | `editSubject` | `updateSubject` | Edit Subject → Update Subject |
| Index | `removeSubject` | `deleteSubject` | Remove Subject → Delete Subject |
| Index | `getSubjects` | `getSubjects` | Get Subjects → Get Many Subjects |
| Revision (all 4 batch) | — | — | Add "Get Many" prefix |

### Operations moved to different resource

| Current Resource | Current value | New Resource | New value |
|-----------------|--------------|-------------|-----------|
| User | `getMyself` | Me | `get` |
| Collection | `getCollections` | User | `getCollections` |
| Collection | `getCharacterCollections` | User | `getCharacterCollections` |
| Collection | `getCharacterCollection` | User | `getCharacterCollection` |
| Collection | `getPersonCollections` | User | `getPersonCollections` |
| Collection | `getPersonCollection` | User | `getPersonCollection` |
| Collection | `get` | Me | `getCollection` |
| Collection | `create` | Me | `createOrUpdateCollection` |
| Collection | `update` | Me | `updateCollection` |
| Collection | `getEpisodes` | Me | `getEpisodes` |
| Collection | `updateEpisodes` | Me | `updateEpisodes` |
| Collection | `getEpisode` | Me | `getEpisode` |
| Collection | `updateEpisode` | Me | `updateEpisode` |
| Character | `collect` | Me | `createCharacterCollect` |
| Character | `uncollect` | Me | `deleteCharacterCollect` |
| Person | `collect` | Me | `createPersonCollect` |
| Person | `uncollect` | Me | `deletePersonCollect` |
| Index | `collect` | Me | `createIndexCollect` |
| Index | `uncollect` | Me | `deleteIndexCollect` |

## 7. n8n UX Guidelines Compliance Checklist

- [x] Operation names use Title Case
- [x] Action fields use Sentence Case
- [x] Description fields use Sentence Case with alternative wording
- [x] No articles (a/an/the) in action fields
- [x] Resource name repeated in action field
- [x] CRUD vocabulary: Create, Create or Update, Delete, Get, Get Many, Update
- [x] Related operations specify object in name (Get Many Characters, not just Get Many)
- [x] Operations on non-resource entities specify the object
