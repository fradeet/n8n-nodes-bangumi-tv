# BangumiTV Full API Node Design

**Date**: 2026-04-07
**Status**: Approved
**Author**: Claude Code
**Reviewer**: fradeet

## 1. Overview

### 1.1 Goal
Implement all 50 public Bangumi API operations into a single n8n declarative node, organized by 8 API resource categories.

### 1.2 Scope
- Replace the existing placeholder User/Company resources with the complete Bangumi API
- Implement 8 resources with 50 operations total
- Use declarative node style (properties + routing)
- Single OAuth2 credential for all operations
- Delete the existing `company` resource directory

### 1.3 API Source
- OpenAPI spec: https://bangumi.github.io/api/dist.json
- API version: 2026-02-22 (OAS 3.0.3)
- Base URL: `https://api.bgm.tv`

## 2. Architecture

### 2.1 Node Type
- Single declarative node (`BangumitvApi`)
- Credentials: `bangumitvApiOAuth2Api` (OAuth2, required)
- All operations routed via `routing` property on each parameter

### 2.2 Directory Structure

```
nodes/BangumitvApi/
├── BangumitvApi.node.ts              # Main node description
├── BangumitvApi.node.json            # Node metadata
├── bangumitvApi.svg                  # Light icon
├── bangumitvApi.dark.svg             # Dark icon
└── actions/
    ├── descriptions.ts               # Properties aggregation center
    ├── common.descriptions.ts        # Shared properties (pagination, etc.)
    ├── subject/
    │   ├── Subject.resource.ts       # Resource aggregator
    │   ├── getAll.operation.ts
    │   ├── get.operation.ts
    │   ├── search.operation.ts
    │   ├── getCalendar.operation.ts
    │   ├── getPersons.operation.ts
    │   ├── getCharacters.operation.ts
    │   ├── getRelations.operation.ts
    │   └── getImage.operation.ts
    ├── episode/
    │   ├── Episode.resource.ts
    │   ├── getAll.operation.ts
    │   └── get.operation.ts
    ├── character/
    │   ├── Character.resource.ts
    │   ├── get.operation.ts
    │   ├── search.operation.ts
    │   ├── getSubjects.operation.ts
    │   ├── getPersons.operation.ts
    │   ├── getImage.operation.ts
    │   ├── collect.operation.ts
    │   └── uncollect.operation.ts
    ├── person/
    │   ├── Person.resource.ts
    │   ├── get.operation.ts
    │   ├── search.operation.ts
    │   ├── getSubjects.operation.ts
    │   ├── getCharacters.operation.ts
    │   ├── getImage.operation.ts
    │   ├── collect.operation.ts
    │   └── uncollect.operation.ts
    ├── user/
    │   ├── User.resource.ts
    │   ├── get.operation.ts
    │   ├── getMyself.operation.ts
    │   └── getAvatar.operation.ts
    ├── collection/
    │   ├── Collection.resource.ts
    │   ├── getCollections.operation.ts
    │   ├── get.operation.ts
    │   ├── create.operation.ts
    │   ├── update.operation.ts
    │   ├── getEpisodes.operation.ts
    │   ├── updateEpisodes.operation.ts
    │   ├── getEpisode.operation.ts
    │   ├── updateEpisode.operation.ts
    │   ├── getCharacterCollections.operation.ts
    │   ├── getCharacterCollection.operation.ts
    │   ├── getPersonCollections.operation.ts
    │   └── getPersonCollection.operation.ts
    ├── revision/
    │   ├── Revision.resource.ts
    │   ├── getSubjectRevisions.operation.ts
    │   ├── getSubjectRevision.operation.ts
    │   ├── getEpisodeRevisions.operation.ts
    │   ├── getEpisodeRevision.operation.ts
    │   ├── getCharacterRevisions.operation.ts
    │   ├── getCharacterRevision.operation.ts
    │   ├── getPersonRevisions.operation.ts
    │   └── getPersonRevision.operation.ts
    └── index/
        ├── Index.resource.ts
        ├── create.operation.ts
        ├── get.operation.ts
        ├── edit.operation.ts
        ├── getSubjects.operation.ts
        ├── addSubject.operation.ts
        ├── editSubject.operation.ts
        ├── removeSubject.operation.ts
        ├── collect.operation.ts
        └── uncollect.operation.ts
```

### 2.3 File Patterns

**`.operation.ts`** — Each exports a `properties: INodeProperties[]` array with `displayOptions` and `routing`:

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
  {
    displayName: 'Subject ID',
    name: 'subjectId',
    type: 'string',
    required: true,
    routing: {
      request: {
        method: 'GET',
        url: '=/v0/subjects/{{$value}}',
      },
    },
    displayOptions: {
      show: {
        resource: ['subject'],
        operation: ['get'],
      },
    },
  },
];
```

**`.resource.ts`** — Aggregates operations, defines the operation selector:

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getAllProps } from './getAll.operation';
import { properties as getProps } from './get.operation';

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    options: [
      { name: 'Get All', value: 'getAll' },
      { name: 'Get', value: 'get' },
    ],
    default: 'getAll',
    displayOptions: {
      show: {
        resource: ['subject'],
      },
    },
  },
  ...getAllProps,
  ...getProps,
];
```

**`descriptions.ts`** — Aggregation center, imports all resource descriptions and merges with resource selector:

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { description as subjectDescription } from './subject/Subject.resource';
import { description as episodeDescription } from './episode/Episode.resource';
// ... all other resources

export const properties: INodeProperties[] = [
  {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
      { name: 'Subject', value: 'subject' },
      { name: 'Episode', value: 'episode' },
      { name: 'Character', value: 'character' },
      { name: 'Person', value: 'person' },
      { name: 'User', value: 'user' },
      { name: 'Collection', value: 'collection' },
      { name: 'Revision', value: 'revision' },
      { name: 'Index', value: 'index' },
    ],
    default: 'subject',
  },
  ...subjectDescription,
  ...episodeDescription,
  // ...
];
```

**`BangumitvApi.node.ts`** — Main node, imports `properties` from `descriptions.ts`:

```typescript
import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { properties } from './actions/descriptions';

export class BangumitvApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Bangumi',
    name: 'bangumitvApi',
    icon: { light: 'file:bangumitvApi.svg', dark: 'file:bangumitvApi.dark.svg' },
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Bangumi API',
    defaults: { name: 'Bangumi' },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [{ name: 'bangumitvApiOAuth2Api', required: true }],
    requestDefaults: {
      baseURL: 'https://api.bgm.tv',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'n8n-bangumi-tv/0.1.0',
      },
    },
    properties,
  };
}
```

## 3. Resource & Operation Mapping

### 3.1 Subject (8 operations)

| Operation | HTTP | Endpoint | Auth | Notes |
|-----------|------|----------|------|-------|
| getCalendar | GET | `/calendar` | N | Daily broadcast schedule |
| search | POST | `/v0/search/subjects` | N | JSON body: keyword, sort, type, etc. |
| getAll | GET | `/v0/subjects` | Y | QS: type, responseGroup, limit, offset |
| get | GET | `/v0/subjects/{subject_id}` | Y | Path: subject_id |
| getImage | GET | `/v0/subjects/{subject_id}/image` | Y | Path: subject_id |
| getPersons | GET | `/v0/subjects/{subject_id}/persons` | Y | Path: subject_id |
| getCharacters | GET | `/v0/subjects/{subject_id}/characters` | Y | Path: subject_id |
| getRelations | GET | `/v0/subjects/{subject_id}/subjects` | Y | Path: subject_id |

### 3.2 Episode (2 operations)

| Operation | HTTP | Endpoint | Auth | Notes |
|-----------|------|----------|------|-------|
| getAll | GET | `/v0/episodes` | Y | QS: subject_id, type, limit, offset |
| get | GET | `/v0/episodes/{episode_id}` | Y | Path: episode_id |

### 3.3 Character (7 operations)

| Operation | HTTP | Endpoint | Auth | Notes |
|-----------|------|----------|------|-------|
| get | GET | `/v0/characters/{character_id}` | N | |
| search | POST | `/v0/search/characters` | N | JSON body: keyword, limit, offset |
| getSubjects | GET | `/v0/characters/{character_id}/subjects` | N | |
| getPersons | GET | `/v0/characters/{character_id}/persons` | N | |
| getImage | GET | `/v0/characters/{character_id}/image` | Y | |
| collect | POST | `/v0/characters/{character_id}/collect` | Y | |
| uncollect | DELETE | `/v0/characters/{character_id}/collect` | Y | |

### 3.4 Person (7 operations)

| Operation | HTTP | Endpoint | Auth | Notes |
|-----------|------|----------|------|-------|
| get | GET | `/v0/persons/{person_id}` | N | |
| search | POST | `/v0/search/persons` | N | JSON body: keyword, limit, offset |
| getSubjects | GET | `/v0/persons/{person_id}/subjects` | N | |
| getCharacters | GET | `/v0/persons/{person_id}/characters` | N | |
| getImage | GET | `/v0/persons/{person_id}/image` | Y | |
| collect | POST | `/v0/persons/{person_id}/collect` | Y | |
| uncollect | DELETE | `/v0/persons/{person_id}/collect` | Y | |

### 3.5 User (3 operations)

| Operation | HTTP | Endpoint | Auth | Notes |
|-----------|------|----------|------|-------|
| get | GET | `/v0/users/{username}` | N | |
| getMyself | GET | `/v0/me` | Y | |
| getAvatar | GET | `/v0/users/{username}/avatar` | N | |

### 3.6 Collection (12 operations)

| Operation | HTTP | Endpoint | Auth | Notes |
|-----------|------|----------|------|-------|
| getCollections | GET | `/v0/users/{username}/collections` | Y | QS: subject_type, type, limit, offset |
| get | GET | `/v0/users/-/collections/{subject_id}` | Y | |
| create | POST | `/v0/users/-/collections/{subject_id}` | Y | JSON body: type, rate, comment, etc. |
| update | PATCH | `/v0/users/-/collections/{subject_id}` | Y | JSON body: partial update |
| getEpisodes | GET | `/v0/users/-/collections/{subject_id}/episodes` | Y | QS: type, limit, offset |
| updateEpisodes | PATCH | `/v0/users/-/collections/{subject_id}/episodes` | Y | JSON body: episode_id, type arrays |
| getEpisode | GET | `/v0/users/-/collections/-/episodes/{episode_id}` | Y | |
| updateEpisode | PUT | `/v0/users/-/collections/-/episodes/{episode_id}` | Y | JSON body: type (integer) |
| getCharacterCollections | GET | `/v0/users/{username}/collections/-/characters` | N | |
| getCharacterCollection | GET | `/v0/users/{username}/collections/-/characters/{character_id}` | N | |
| getPersonCollections | GET | `/v0/users/{username}/collections/-/persons` | N | |
| getPersonCollection | GET | `/v0/users/{username}/collections/-/persons/{person_id}` | N | |

### 3.7 Revision (8 operations)

| Operation | HTTP | Endpoint | Auth | Notes |
|-----------|------|----------|------|-------|
| getSubjectRevisions | GET | `/v0/revisions/subjects` | N | QS: subject_id, limit, offset |
| getSubjectRevision | GET | `/v0/revisions/subjects/{revision_id}` | N | |
| getEpisodeRevisions | GET | `/v0/revisions/episodes` | N | QS: episode_id, limit, offset |
| getEpisodeRevision | GET | `/v0/revisions/episodes/{revision_id}` | N | |
| getCharacterRevisions | GET | `/v0/revisions/characters` | N | QS: character_id, limit, offset |
| getCharacterRevision | GET | `/v0/revisions/characters/{revision_id}` | N | |
| getPersonRevisions | GET | `/v0/revisions/persons` | N | QS: person_id, limit, offset |
| getPersonRevision | GET | `/v0/revisions/persons/{revision_id}` | N | |

### 3.8 Index (9 operations)

| Operation | HTTP | Endpoint | Auth | Notes |
|-----------|------|----------|------|-------|
| create | POST | `/v0/indices` | Y | QS: title, description |
| get | GET | `/v0/indices/{index_id}` | Y | |
| edit | PUT | `/v0/indices/{index_id}` | Y | JSON body: title, description |
| getSubjects | GET | `/v0/indices/{index_id}/subjects` | Y | QS: limit, offset |
| addSubject | POST | `/v0/indices/{index_id}/subjects` | Y | JSON body: subject_id, sort, comment |
| editSubject | PUT | `/v0/indices/{index_id}/subjects/{subject_id}` | Y | JSON body: sort, comment |
| removeSubject | DELETE | `/v0/indices/{index_id}/subjects/{subject_id}` | Y | |
| collect | POST | `/v0/indices/{index_id}/collect` | Y | |
| uncollect | DELETE | `/v0/indices/{index_id}/collect` | Y | |

## 4. Shared Properties

### 4.1 Pagination (`common.descriptions.ts`)

- `limit`: number, default 20, max 50
- `offset`: number, default 0

Used by: getAll, search, getCollections, getEpisodes, all revision list operations, getIndexSubjects

### 4.2 Subject Type Options

Anime (1), Book (2), Music (3), Game (4), Real (6)

Used by: subject.getAll, collection.getCollections

### 4.3 Collection Type Options

Wish (1), Collect (2), Doing (3), OnHold (4), Dropped (5)

Used by: collection.getCollections, collection.create, collection.update

### 4.4 Response Group Options (Subject)

small, medium, large

Used by: subject.getAll, subject.get

## 5. Credentials

Existing OAuth2 credential (`BangumitvApiOAuth2Api`) is reused as-is. All operations require this credential (even public endpoints — trade-off for simplicity).

## 6. Cleanup

- Delete `nodes/BangumitvApi/resources/` directory (old user and company resources)
- Remove `company` imports from main node
- Update `BangumitvApi.node.json` with correct metadata
- Update `package.json` display name to "Bangumi"

## 7. Naming Conventions

- Node display name: "Bangumi"
- Resource names: `subject`, `episode`, `character`, `person`, `user`, `collection`, `revision`, `index`
- Operation names: camelCase verbs (e.g., `getAll`, `getSubjectRevisions`)
- File names: PascalCase for resources (`Subject.resource.ts`), camelCase for operations (`getAll.operation.ts`)
