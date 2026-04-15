# Operation Naming & Structure Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename all operation values, delete Me resource (merge into User), delete Subject.getCollection, and update all name/action/description copy to match `temp/RESOURCES.md`.

**Architecture:** Mechanical refactoring of n8n declarative node. Each resource is modified independently: rename operation files (git mv), update internal `displayOptions.operation` values, update resource file imports and option entries. No routing/URL changes.

**Tech Stack:** TypeScript, n8n-workflow, n8n-node CLI (build/lint)

**Source of truth:** `temp/RESOURCES.md` — all name/value/action/description values must match this file exactly.

---

## File Map

All paths relative to `nodes/BangumiTv/actions/`.

### Files to Delete
- `me/Me.resource.ts`
- `me/get.operation.ts`
- `subject/getCollection.operation.ts`

### Files to Create
- `user/getMe.operation.ts`

### Files to Rename (27 operation files)

| # | Current Path | New Path | Operation Value Change |
|---|---|---|---|
| 1 | `character/collect.operation.ts` | `character/createCollection.operation.ts` | `collect` → `createCollection` |
| 2 | `character/getPersons.operation.ts` | `character/getManyRelatedPersons.operation.ts` | `getPersons` → `getManyRelatedPersons` |
| 3 | `character/getSubjects.operation.ts` | `character/getManyRelatedSubjects.operation.ts` | `getSubjects` → `getManyRelatedSubjects` |
| 4 | `character/uncollect.operation.ts` | `character/deleteCollection.operation.ts` | `uncollect` → `deleteCollection` |
| 5 | `person/collect.operation.ts` | `person/createCollection.operation.ts` | `collect` → `createCollection` |
| 6 | `person/getCharacters.operation.ts` | `person/getManyRelatedCharacters.operation.ts` | `getCharacters` → `getManyRelatedCharacters` |
| 7 | `person/getSubjects.operation.ts` | `person/getManyRelatedSubjects.operation.ts` | `getSubjects` → `getManyRelatedSubjects` |
| 8 | `person/uncollect.operation.ts` | `person/deleteCollection.operation.ts` | `uncollect` → `deleteCollection` |
| 9 | `index/addSubject.operation.ts` | `index/addendSubject.operation.ts` | `addSubject` → `addendSubject` |
| 10 | `index/collect.operation.ts` | `index/createCollection.operation.ts` | `collect` → `createCollection` |
| 11 | `index/getSubjects.operation.ts` | `index/getManySubjects.operation.ts` | `getSubjects` → `getManySubjects` |
| 12 | `index/uncollect.operation.ts` | `index/deleteCollection.operation.ts` | `uncollect` → `deleteCollection` |
| 13 | `collection/getCharacterCollection.operation.ts` | `collection/getCharacter.operation.ts` | `getCharacterCollection` → `getCharacter` |
| 14 | `collection/getMany.operation.ts` | `collection/getManySubjects.operation.ts` | `getMany` → `getManySubjects` |
| 15 | `collection/getCharacterCollections.operation.ts` | `collection/getManyCharacters.operation.ts` | `getCharacterCollections` → `getManyCharacters` |
| 16 | `collection/getPersonCollections.operation.ts` | `collection/getManyPersons.operation.ts` | `getPersonCollections` → `getManyPersons` |
| 17 | `collection/getPersonCollection.operation.ts` | `collection/getPerson.operation.ts` | `getPersonCollection` → `getPerson` |
| 18 | `episode/getCollections.operation.ts` | `episode/getManyCollection.operation.ts` | `getCollections` → `getManyCollection` |
| 19 | `episode/updateCollections.operation.ts` | `episode/updateManyCollections.operation.ts` | `updateCollections` → `updateManyCollections` |
| 20 | `revision/getCharacterRevisions.operation.ts` | `revision/getManyCharacterRevisions.operation.ts` | `getCharacterRevisions` → `getManyCharacterRevisions` |
| 21 | `revision/getEpisodeRevisions.operation.ts` | `revision/getManyEpisodeRevisions.operation.ts` | `getEpisodeRevisions` → `getManyEpisodeRevisions` |
| 22 | `revision/getPersonRevisions.operation.ts` | `revision/getManyPersonRevisions.operation.ts` | `getPersonRevisions` → `getManyPersonRevisions` |
| 23 | `revision/getSubjectRevisions.operation.ts` | `revision/getManySubjectRevisions.operation.ts` | `getSubjectRevisions` → `getManySubjectRevisions` |
| 24 | `subject/getCharacters.operation.ts` | `subject/getManyRelatedCharacters.operation.ts` | `getCharacters` → `getManyRelatedCharacters` |
| 25 | `subject/getPersons.operation.ts` | `subject/getManyRelatedPersons.operation.ts` | `getPersons` → `getManyRelatedPersons` |
| 26 | `subject/getRelations.operation.ts` | `subject/getManyRelatedSubjects.operation.ts` | `getRelations` → `getManyRelatedSubjects` |

### Resource Files to Update (9 `.resource.ts` + 1 `descriptions.ts`)
- `descriptions.ts` — remove Me import, remove 'Me' from resource options
- `user/User.resource.ts` — add getMe operation
- `character/Character.resource.ts` — update 4 operations
- `person/Person.resource.ts` — update 4 operations
- `index/Index.resource.ts` — update 4 operations
- `collection/Collection.resource.ts` — update 5 operations
- `episode/Episode.resource.ts` — update 2 operations
- `revision/Revision.resource.ts` — update 4 operations
- `subject/Subject.resource.ts` — delete getCollection, update 3 operations

---

### Task 1: Me → User Migration

**Files:**
- Delete: `nodes/BangumiTv/actions/me/Me.resource.ts`
- Delete: `nodes/BangumiTv/actions/me/get.operation.ts`
- Create: `nodes/BangumiTv/actions/user/getMe.operation.ts`
- Modify: `nodes/BangumiTv/actions/user/User.resource.ts`

- [ ] **Step 1: Create `user/getMe.operation.ts`**

Migrated from `me/get.operation.ts`. Change resource from `'me'` to `'user'`, operation from `'get'` to `'getMe'`:

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Get',
		name: 'get',
		type: 'hidden',
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/me',
			},
		},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getMe'],
			},
		},
	},
];
```

- [ ] **Step 2: Update `user/User.resource.ts`**

Add getMe import and operation option. Update existing descriptions per `temp/RESOURCES.md`:

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as getAvatarProps } from './getAvatar.operation';
import { properties as getMeProps } from './getMe.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get',
				value: 'get',
				action: "Get user's profile",
				description: 'Retrieve user profile by username',
			},
			{
				name: 'Get Avatar',
				value: 'getAvatar',
				action: "Get user's avatar",
				description: 'Retrieve user avatar by username',
			},
			{
				name: 'Get Me',
				value: 'getMe',
				action: 'Get current user',
				description: 'Retrieve current authenticated user profile',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['user'] } },
	},
	...getProps,
	...getAvatarProps,
	...getMeProps,
];
```

- [ ] **Step 3: Delete Me resource files**

```bash
git rm nodes/BangumiTv/actions/me/Me.resource.ts nodes/BangumiTv/actions/me/get.operation.ts
rmdir nodes/BangumiTv/actions/me
```

- [ ] **Step 4: Build verify**

Run: `n8n-node build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add nodes/BangumiTv/actions/
git commit -m "refactor: migrate Me resource to User.getMe operation"
```

---

### Task 2: Subject Resource Refactoring

**Files:**
- Delete: `nodes/BangumiTv/actions/subject/getCollection.operation.ts`
- Rename: `subject/getCharacters.operation.ts` → `subject/getManyRelatedCharacters.operation.ts`
- Rename: `subject/getPersons.operation.ts` → `subject/getManyRelatedPersons.operation.ts`
- Rename: `subject/getRelations.operation.ts` → `subject/getManyRelatedSubjects.operation.ts`
- Modify: `nodes/BangumiTv/actions/subject/Subject.resource.ts`

- [ ] **Step 1: Rename operation files**

```bash
cd nodes/BangumiTv/actions/subject
git mv getCharacters.operation.ts getManyRelatedCharacters.operation.ts
git mv getPersons.operation.ts getManyRelatedPersons.operation.ts
git mv getRelations.operation.ts getManyRelatedSubjects.operation.ts
```

- [ ] **Step 2: Delete getCollection**

```bash
git rm subject/getCollection.operation.ts
```

- [ ] **Step 3: Update `getManyRelatedCharacters.operation.ts`**

Change `displayOptions.operation` from `['getCharacters']` to `['getManyRelatedCharacters']`:

```
- show: { resource: ['subject'], operation: ['getCharacters'] },
+ show: { resource: ['subject'], operation: ['getManyRelatedCharacters'] },
```

- [ ] **Step 4: Update `getManyRelatedPersons.operation.ts`**

```
- show: { resource: ['subject'], operation: ['getPersons'] },
+ show: { resource: ['subject'], operation: ['getManyRelatedPersons'] },
```

- [ ] **Step 5: Update `getManyRelatedSubjects.operation.ts`**

```
- show: { resource: ['subject'], operation: ['getRelations'] },
+ show: { resource: ['subject'], operation: ['getManyRelatedSubjects'] },
```

- [ ] **Step 6: Rewrite `Subject.resource.ts`**

Remove getCollection import and spread. Update imports for renamed files. Update all option entries per `temp/RESOURCES.md`:

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getCalendarProps } from './getCalendar.operation';
import { properties as searchProps } from './search.operation';
import { properties as getManyProps } from './getMany.operation';
import { properties as getProps } from './get.operation';
import { properties as getImageProps } from './getImage.operation';
import { properties as getManyRelatedPersonsProps } from './getManyRelatedPersons.operation';
import { properties as getManyRelatedCharactersProps } from './getManyRelatedCharacters.operation';
import { properties as getManyRelatedSubjectsProps } from './getManyRelatedSubjects.operation';
import { properties as createOrUpdateCollectionProps } from './createOrUpdateCollection.operation';
import { properties as updateCollectionProps } from './updateCollection.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Create or Update Collection',
				value: 'createOrUpdateCollection',
				action: 'Create or update subject collection',
				description: 'Create a new subject collection or update an existing one',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get subject',
				description: 'Retrieve a subject detail',
			},
			{
				name: 'Get Calendar',
				value: 'getCalendar',
				action: 'Get calendar',
				description: 'Retrieve daily broadcast schedule for subjects',
			},
			{
				name: 'Get Image',
				value: 'getImage',
				action: 'Get subject image',
				description: 'Retrieve subject image',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many subjects',
				description: 'Retrieve a list of subjects',
			},
			{
				name: 'Get Related Characters',
				value: 'getManyRelatedCharacters',
				action: 'Get related characters for subject',
				description: 'Retrieve related characters inside a subject',
			},
			{
				name: 'Get Related Persons',
				value: 'getManyRelatedPersons',
				action: 'Get related persons for subject',
				description: 'Retrieve related persons inside a subject',
			},
			{
				name: 'Get Related Subjects',
				value: 'getManyRelatedSubjects',
				action: 'Get related subjects for subject',
				description: 'Retrieve related subjects inside a subject',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search subjects',
				description: 'Search subjects by keyword',
			},
			{
				name: 'Update Collection',
				value: 'updateCollection',
				action: 'Update subject collection',
				description: 'Update collection inside a subject',
			},
		],
		default: 'getMany',
		displayOptions: { show: { resource: ['subject'] } },
	},
	...getCalendarProps,
	...searchProps,
	...getManyProps,
	...getProps,
	...getImageProps,
	...getManyRelatedPersonsProps,
	...getManyRelatedCharactersProps,
	...getManyRelatedSubjectsProps,
	...createOrUpdateCollectionProps,
	...updateCollectionProps,
];
```

- [ ] **Step 7: Build verify**

Run: `n8n-node build`
Expected: Build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git add nodes/BangumiTv/actions/subject/
git commit -m "refactor(subject): rename operations and remove getCollection"
```

---

### Task 3: Character Resource Refactoring

**Files:**
- Rename: `character/collect.operation.ts` → `character/createCollection.operation.ts`
- Rename: `character/getPersons.operation.ts` → `character/getManyRelatedPersons.operation.ts`
- Rename: `character/getSubjects.operation.ts` → `character/getManyRelatedSubjects.operation.ts`
- Rename: `character/uncollect.operation.ts` → `character/deleteCollection.operation.ts`
- Modify: `nodes/BangumiTv/actions/character/Character.resource.ts`

- [ ] **Step 1: Rename operation files**

```bash
cd nodes/BangumiTv/actions/character
git mv collect.operation.ts createCollection.operation.ts
git mv getPersons.operation.ts getManyRelatedPersons.operation.ts
git mv getSubjects.operation.ts getManyRelatedSubjects.operation.ts
git mv uncollect.operation.ts deleteCollection.operation.ts
```

- [ ] **Step 2: Update `createCollection.operation.ts` — change displayOptions.operation**

```
- show: { resource: ['character'], operation: ['collect'] },
+ show: { resource: ['character'], operation: ['createCollection'] },
```

- [ ] **Step 3: Update `getManyRelatedPersons.operation.ts`**

```
- show: { resource: ['character'], operation: ['getPersons'] },
+ show: { resource: ['character'], operation: ['getManyRelatedPersons'] },
```

- [ ] **Step 4: Update `getManyRelatedSubjects.operation.ts`**

```
- show: { resource: ['character'], operation: ['getSubjects'] },
+ show: { resource: ['character'], operation: ['getManyRelatedSubjects'] },
```

- [ ] **Step 5: Update `deleteCollection.operation.ts`**

```
- show: { resource: ['character'], operation: ['uncollect'] },
+ show: { resource: ['character'], operation: ['deleteCollection'] },
```

- [ ] **Step 6: Rewrite `Character.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as searchProps } from './search.operation';
import { properties as getManyRelatedSubjectsProps } from './getManyRelatedSubjects.operation';
import { properties as getManyRelatedPersonsProps } from './getManyRelatedPersons.operation';
import { properties as getImageProps } from './getImage.operation';
import { properties as createCollectionProps } from './createCollection.operation';
import { properties as deleteCollectionProps } from './deleteCollection.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Create Collection',
				value: 'createCollection',
				action: 'Create character collection',
				description: 'Create a new character collection',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get character',
				description: 'Retrieve a character detail',
			},
			{
				name: 'Get Image',
				value: 'getImage',
				action: 'Get character image',
				description: 'Retrieve character image',
			},
			{
				name: 'Get Related Persons',
				value: 'getManyRelatedPersons',
				action: 'Get related persons for character',
				description: 'List all related persons in a character',
			},
			{
				name: 'Get Related Subjects',
				value: 'getManyRelatedSubjects',
				action: 'Get related subjects for character',
				description: 'List all related subjects in a character',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search characters',
				description: 'Search characters by keyword',
			},
			{
				name: 'Delete Collection',
				value: 'deleteCollection',
				action: 'Delete character collection',
				description: 'Delete a character collection',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['character'] } },
	},
	...getProps,
	...searchProps,
	...getManyRelatedSubjectsProps,
	...getManyRelatedPersonsProps,
	...getImageProps,
	...createCollectionProps,
	...deleteCollectionProps,
];
```

- [ ] **Step 7: Build verify**

Run: `n8n-node build`
Expected: Build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git add nodes/BangumiTv/actions/character/
git commit -m "refactor(character): rename collect/uncollect/getPersons/getSubjects operations"
```

---

### Task 4: Person Resource Refactoring

**Files:**
- Rename: `person/collect.operation.ts` → `person/createCollection.operation.ts`
- Rename: `person/getCharacters.operation.ts` → `person/getManyRelatedCharacters.operation.ts`
- Rename: `person/getSubjects.operation.ts` → `person/getManyRelatedSubjects.operation.ts`
- Rename: `person/uncollect.operation.ts` → `person/deleteCollection.operation.ts`
- Modify: `nodes/BangumiTv/actions/person/Person.resource.ts`

- [ ] **Step 1: Rename operation files**

```bash
cd nodes/BangumiTv/actions/person
git mv collect.operation.ts createCollection.operation.ts
git mv getCharacters.operation.ts getManyRelatedCharacters.operation.ts
git mv getSubjects.operation.ts getManyRelatedSubjects.operation.ts
git mv uncollect.operation.ts deleteCollection.operation.ts
```

- [ ] **Step 2: Update `createCollection.operation.ts` — displayOptions.operation**

```
- show: { resource: ['person'], operation: ['collect'] },
+ show: { resource: ['person'], operation: ['createCollection'] },
```

- [ ] **Step 3: Update `getManyRelatedCharacters.operation.ts`**

```
- show: { resource: ['person'], operation: ['getCharacters'] },
+ show: { resource: ['person'], operation: ['getManyRelatedCharacters'] },
```

- [ ] **Step 4: Update `getManyRelatedSubjects.operation.ts`**

```
- show: { resource: ['person'], operation: ['getSubjects'] },
+ show: { resource: ['person'], operation: ['getManyRelatedSubjects'] },
```

- [ ] **Step 5: Update `deleteCollection.operation.ts`**

```
- show: { resource: ['person'], operation: ['uncollect'] },
+ show: { resource: ['person'], operation: ['deleteCollection'] },
```

- [ ] **Step 6: Rewrite `Person.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as createCollectionProps } from './createCollection.operation';
import { properties as getProps } from './get.operation';
import { properties as getManyRelatedCharactersProps } from './getManyRelatedCharacters.operation';
import { properties as getImageProps } from './getImage.operation';
import { properties as getManyRelatedSubjectsProps } from './getManyRelatedSubjects.operation';
import { properties as searchProps } from './search.operation';
import { properties as deleteCollectionProps } from './deleteCollection.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Create Collection',
				value: 'createCollection',
				action: 'Create character collection',
				description: 'Create a new character collection',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get person',
				description: 'Retrieve a person detail',
			},
			{
				name: 'Get Image',
				value: 'getImage',
				action: 'Get person image',
				description: 'Retrieve person image',
			},
			{
				name: 'Get Related Characters',
				value: 'getManyRelatedCharacters',
				action: 'Get related characters for person',
				description: 'Retrieve related characters for a person',
			},
			{
				name: 'Get Related Subjects',
				value: 'getManyRelatedSubjects',
				action: 'Get related subjects for person',
				description: 'Retrieve related subjects for a person',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search persons',
				description: 'Search persons by keyword',
			},
			{
				name: 'Delete Collection',
				value: 'deleteCollection',
				action: 'Delete person collection',
				description: 'Delete a person collection',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['person'] } },
	},
	...createCollectionProps,
	...getProps,
	...getManyRelatedCharactersProps,
	...getImageProps,
	...getManyRelatedSubjectsProps,
	...searchProps,
	...deleteCollectionProps,
];
```

- [ ] **Step 7: Build verify**

Run: `n8n-node build`
Expected: Build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git add nodes/BangumiTv/actions/person/
git commit -m "refactor(person): rename collect/uncollect/getCharacters/getSubjects operations"
```

---

### Task 5: Index Resource Refactoring

**Files:**
- Rename: `index/addSubject.operation.ts` → `index/addendSubject.operation.ts`
- Rename: `index/collect.operation.ts` → `index/createCollection.operation.ts`
- Rename: `index/getSubjects.operation.ts` → `index/getManySubjects.operation.ts`
- Rename: `index/uncollect.operation.ts` → `index/deleteCollection.operation.ts`
- Modify: `nodes/BangumiTv/actions/index/Index.resource.ts`

- [ ] **Step 1: Rename operation files**

```bash
cd nodes/BangumiTv/actions/index
git mv addSubject.operation.ts addendSubject.operation.ts
git mv collect.operation.ts createCollection.operation.ts
git mv getSubjects.operation.ts getManySubjects.operation.ts
git mv uncollect.operation.ts deleteCollection.operation.ts
```

- [ ] **Step 2: Update `addendSubject.operation.ts` — displayOptions.operation**

```
- show: { resource: ['index'], operation: ['addSubject'] },
+ show: { resource: ['index'], operation: ['addendSubject'] },
```

- [ ] **Step 3: Update `createCollection.operation.ts`**

```
- show: { resource: ['index'], operation: ['collect'] },
+ show: { resource: ['index'], operation: ['createCollection'] },
```

- [ ] **Step 4: Update `getManySubjects.operation.ts`**

```
- show: { resource: ['index'], operation: ['getSubjects'] },
+ show: { resource: ['index'], operation: ['getManySubjects'] },
```

- [ ] **Step 5: Update `deleteCollection.operation.ts`**

```
- show: { resource: ['index'], operation: ['uncollect'] },
+ show: { resource: ['index'], operation: ['deleteCollection'] },
```

- [ ] **Step 6: Rewrite `Index.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as createProps } from './create.operation';
import { properties as getProps } from './get.operation';
import { properties as updateProps } from './update.operation';
import { properties as getManySubjectsProps } from './getManySubjects.operation';
import { properties as addendSubjectProps } from './addendSubject.operation';
import { properties as updateSubjectProps } from './updateSubject.operation';
import { properties as deleteSubjectProps } from './deleteSubject.operation';
import { properties as createCollectionProps } from './createCollection.operation';
import { properties as deleteCollectionProps } from './deleteCollection.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Append Subject',
				value: 'addendSubject',
				action: 'Append subject to index',
				description: 'Append a subject into an index',
			},
			{
				name: 'Create Collection',
				value: 'createCollection',
				action: 'Create index collection',
				description: 'Create a new index collection',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create index',
				description: 'Create a new index',
			},
			{
				name: 'Delete Subject',
				value: 'deleteSubject',
				action: 'Delete subject from index',
				description: 'Delete a subject inside an index',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get index',
				description: 'Retrieve an index detail',
			},
			{
				name: 'Get Subjects',
				value: 'getManySubjects',
				action: 'Get subjects in index',
				description: 'List all subjects in an index',
			},
			{
				name: 'Delete Collection',
				value: 'deleteCollection',
				action: 'Delete index collection',
				description: 'Delete an index collection',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update index',
				description: 'Update a index',
			},
			{
				name: 'Update Subject',
				value: 'updateSubject',
				action: 'Update subject in index',
				description: 'Update subject inside a index',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['index'] } },
	},
	...createProps,
	...getProps,
	...updateProps,
	...getManySubjectsProps,
	...addendSubjectProps,
	...updateSubjectProps,
	...deleteSubjectProps,
	...createCollectionProps,
	...deleteCollectionProps,
];
```

- [ ] **Step 7: Build verify**

Run: `n8n-node build`
Expected: Build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git add nodes/BangumiTv/actions/index/
git commit -m "refactor(index): rename addSubject/collect/getSubjects/uncollect operations"
```

---

### Task 6: Collection Resource Refactoring

**Files:**
- Rename: `collection/getCharacterCollection.operation.ts` → `collection/getCharacter.operation.ts`
- Rename: `collection/getMany.operation.ts` → `collection/getManySubjects.operation.ts`
- Rename: `collection/getCharacterCollections.operation.ts` → `collection/getManyCharacters.operation.ts`
- Rename: `collection/getPersonCollections.operation.ts` → `collection/getManyPersons.operation.ts`
- Rename: `collection/getPersonCollection.operation.ts` → `collection/getPerson.operation.ts`
- Modify: `nodes/BangumiTv/actions/collection/Collection.resource.ts`

- [ ] **Step 1: Rename operation files**

```bash
cd nodes/BangumiTv/actions/collection
git mv getCharacterCollection.operation.ts getCharacter.operation.ts
git mv getMany.operation.ts getManySubjects.operation.ts
git mv getCharacterCollections.operation.ts getManyCharacters.operation.ts
git mv getPersonCollections.operation.ts getManyPersons.operation.ts
git mv getPersonCollection.operation.ts getPerson.operation.ts
```

- [ ] **Step 2: Update `getCharacter.operation.ts` — displayOptions.operation** (appears in 2 properties)

```
- show: { resource: ['collection'], operation: ['getCharacterCollection'] },
+ show: { resource: ['collection'], operation: ['getCharacter'] },
```

Apply to both properties in the file.

- [ ] **Step 3: Update `getManySubjects.operation.ts`**

```
- displayOptions: { show: { resource: ['collection'], operation: ['getMany'] } },
+ displayOptions: { show: { resource: ['collection'], operation: ['getManySubjects'] } },
```

- [ ] **Step 4: Update `getManyCharacters.operation.ts`**

```
- show: { resource: ['collection'], operation: ['getCharacterCollections'] },
+ show: { resource: ['collection'], operation: ['getManyCharacters'] },
```

- [ ] **Step 5: Update `getManyPersons.operation.ts`**

```
- show: { resource: ['collection'], operation: ['getPersonCollections'] },
+ show: { resource: ['collection'], operation: ['getManyPersons'] },
```

- [ ] **Step 6: Update `getPerson.operation.ts`** (appears in 2 properties)

```
- show: { resource: ['collection'], operation: ['getPersonCollection'] },
+ show: { resource: ['collection'], operation: ['getPerson'] },
```

Apply to both properties in the file.

- [ ] **Step 7: Rewrite `Collection.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getCharacterProps } from './getCharacter.operation';
import { properties as getManySubjectsProps } from './getManySubjects.operation';
import { properties as getManyCharactersProps } from './getManyCharacters.operation';
import { properties as getManyPersonsProps } from './getManyPersons.operation';
import { properties as getPersonProps } from './getPerson.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get Character',
				value: 'getCharacter',
				action: "Get user's character collection",
				description: "Retrieve a user's character collection",
			},
			{
				name: 'Get Many Subjects',
				value: 'getManySubjects',
				action: "Get many user's subject collections",
				description: "Retrieve a list of user's subject collections",
			},
			{
				name: 'Get Many Characters',
				value: 'getManyCharacters',
				action: "Get many user's character collections",
				description: "Retrieve a list of user's character collections",
			},
			{
				name: 'Get Many Persons',
				value: 'getManyPersons',
				action: "Get many user's person collections",
				description: 'Retrieve a list of person collections',
			},
			{
				name: 'Get Person',
				value: 'getPerson',
				action: "Get user's person collection",
				description: 'Retrieve a person collection',
			},
		],
		default: 'getManySubjects',
		displayOptions: { show: { resource: ['collection'] } },
	},
	...getCharacterProps,
	...getManySubjectsProps,
	...getManyCharactersProps,
	...getManyPersonsProps,
	...getPersonProps,
];
```

- [ ] **Step 8: Build verify**

Run: `n8n-node build`
Expected: Build succeeds with no errors.

- [ ] **Step 9: Commit**

```bash
git add nodes/BangumiTv/actions/collection/
git commit -m "refactor(collection): rename all 5 operations"
```

---

### Task 7: Episode Resource Refactoring

**Files:**
- Rename: `episode/getCollections.operation.ts` → `episode/getManyCollection.operation.ts`
- Rename: `episode/updateCollections.operation.ts` → `episode/updateManyCollections.operation.ts`
- Modify: `nodes/BangumiTv/actions/episode/Episode.resource.ts`

- [ ] **Step 1: Rename operation files**

```bash
cd nodes/BangumiTv/actions/episode
git mv getCollections.operation.ts getManyCollection.operation.ts
git mv updateCollections.operation.ts updateManyCollections.operation.ts
```

- [ ] **Step 2: Update `getManyCollection.operation.ts` — displayOptions.operation**

```
- show: { resource: ['episode'], operation: ['getCollections'] },
+ show: { resource: ['episode'], operation: ['getManyCollection'] },
```

- [ ] **Step 3: Update `updateManyCollections.operation.ts`**

```
- show: { resource: ['episode'], operation: ['updateCollections'] },
+ show: { resource: ['episode'], operation: ['updateManyCollections'] },
```

- [ ] **Step 4: Rewrite `Episode.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getManyProps } from './getMany.operation';
import { properties as getProps } from './get.operation';
import { properties as getCollectionProps } from './getCollection.operation';
import { properties as getManyCollectionProps } from './getManyCollection.operation';
import { properties as updateCollectionProps } from './updateCollection.operation';
import { properties as updateManyCollectionsProps } from './updateManyCollections.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get episode',
				description: 'Retrieve an episode detail',
			},
			{
				name: 'Get Collection',
				value: 'getCollection',
				action: 'Get episode collection',
				description: 'Retrieve watch status for an episode',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many episodes',
				description: 'Retrieve a list of episodes',
			},
			{
				name: 'Get Many Collection',
				value: 'getManyCollection',
				action: 'Get many episode collection',
				description: 'Retrieve episode watch statuses for a subject',
			},
			{
				name: 'Update Collection',
				value: 'updateCollection',
				action: 'Update episode collection status',
				description: 'Update one episode collection status',
			},
			{
				name: 'Update Many Collection',
				value: 'updateManyCollections',
				action: 'Update episode collection statuses',
				description: 'Update episodes inside a subject',
			},
		],
		default: 'getMany',
		displayOptions: { show: { resource: ['episode'] } },
	},
	...getManyProps,
	...getProps,
	...getCollectionProps,
	...getManyCollectionProps,
	...updateCollectionProps,
	...updateManyCollectionsProps,
];
```

- [ ] **Step 5: Build verify**

Run: `n8n-node build`
Expected: Build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add nodes/BangumiTv/actions/episode/
git commit -m "refactor(episode): rename getCollections/updateCollections operations"
```

---

### Task 8: Revision Resource Refactoring

**Files:**
- Rename: `revision/getCharacterRevisions.operation.ts` → `revision/getManyCharacterRevisions.operation.ts`
- Rename: `revision/getEpisodeRevisions.operation.ts` → `revision/getManyEpisodeRevisions.operation.ts`
- Rename: `revision/getPersonRevisions.operation.ts` → `revision/getManyPersonRevisions.operation.ts`
- Rename: `revision/getSubjectRevisions.operation.ts` → `revision/getManySubjectRevisions.operation.ts`
- Modify: `nodes/BangumiTv/actions/revision/Revision.resource.ts`

- [ ] **Step 1: Rename operation files**

```bash
cd nodes/BangumiTv/actions/revision
git mv getCharacterRevisions.operation.ts getManyCharacterRevisions.operation.ts
git mv getEpisodeRevisions.operation.ts getManyEpisodeRevisions.operation.ts
git mv getPersonRevisions.operation.ts getManyPersonRevisions.operation.ts
git mv getSubjectRevisions.operation.ts getManySubjectRevisions.operation.ts
```

- [ ] **Step 2: Update `getManyCharacterRevisions.operation.ts` — displayOptions.operation**

```
- show: { resource: ['revision'], operation: ['getCharacterRevisions'] },
+ show: { resource: ['revision'], operation: ['getManyCharacterRevisions'] },
```

- [ ] **Step 3: Update `getManyEpisodeRevisions.operation.ts`**

```
- show: { resource: ['revision'], operation: ['getEpisodeRevisions'] },
+ show: { resource: ['revision'], operation: ['getManyEpisodeRevisions'] },
```

- [ ] **Step 4: Update `getManyPersonRevisions.operation.ts`**

```
- show: { resource: ['revision'], operation: ['getPersonRevisions'] },
+ show: { resource: ['revision'], operation: ['getManyPersonRevisions'] },
```

- [ ] **Step 5: Update `getManySubjectRevisions.operation.ts`**

```
- show: { resource: ['revision'], operation: ['getSubjectRevisions'] },
+ show: { resource: ['revision'], operation: ['getManySubjectRevisions'] },
```

- [ ] **Step 6: Rewrite `Revision.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getManySubjectRevisionsProps } from './getManySubjectRevisions.operation';
import { properties as getManyEpisodeRevisionsProps } from './getManyEpisodeRevisions.operation';
import { properties as getManyCharacterRevisionsProps } from './getManyCharacterRevisions.operation';
import { properties as getManyPersonRevisionsProps } from './getManyPersonRevisions.operation';
import { properties as getSubjectRevisionProps } from './getSubjectRevision.operation';
import { properties as getEpisodeRevisionProps } from './getEpisodeRevision.operation';
import { properties as getCharacterRevisionProps } from './getCharacterRevision.operation';
import { properties as getPersonRevisionProps } from './getPersonRevision.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get Character',
				value: 'getCharacterRevision',
				action: 'Get character revision',
				description: 'Retrieve a character revision',
			},
			{
				name: 'Get Episode',
				value: 'getEpisodeRevision',
				action: 'Get episode revision',
				description: 'Retrieve an episode revision',
			},
			{
				name: 'Get Many Character',
				value: 'getManyCharacterRevisions',
				action: 'Get many character revisions',
				description: 'List all revisions in a character',
			},
			{
				name: 'Get Many Episode',
				value: 'getManyEpisodeRevisions',
				action: 'Get many episode revisions',
				description: 'List all revisions in an episode',
			},
			{
				name: 'Get Many Person',
				value: 'getManyPersonRevisions',
				action: 'Get many person revisions',
				description: 'List all revisions in a person',
			},
			{
				name: 'Get Many Subject',
				value: 'getManySubjectRevisions',
				action: 'Get many subject revisions',
				description: 'List all revisions in a subject',
			},
			{
				name: 'Get Person',
				value: 'getPersonRevision',
				action: 'Get person revision',
				description: 'Retrieve a person revision',
			},
			{
				name: 'Get Subject',
				value: 'getSubjectRevision',
				action: 'Get subject revision',
				description: 'Retrieve a subject revision',
			},
		],
		default: 'getManySubjectRevisions',
		displayOptions: { show: { resource: ['revision'] } },
	},
	...getManySubjectRevisionsProps,
	...getManyEpisodeRevisionsProps,
	...getManyCharacterRevisionsProps,
	...getManyPersonRevisionsProps,
	...getSubjectRevisionProps,
	...getEpisodeRevisionProps,
	...getCharacterRevisionProps,
	...getPersonRevisionProps,
];
```

- [ ] **Step 7: Build verify**

Run: `n8n-node build`
Expected: Build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git add nodes/BangumiTv/actions/revision/
git commit -m "refactor(revision): rename get{Type}Revisions to getMany{Type}Revisions"
```

---

### Task 9: descriptions.ts Cleanup & Final Verification

**Files:**
- Modify: `nodes/BangumiTv/actions/descriptions.ts`

- [ ] **Step 1: Update `descriptions.ts`**

Remove Me import and spread. Remove 'Me' from resource options:

```typescript
// nodes/BangumiTv/actions/descriptions.ts
import type { INodeProperties } from 'n8n-workflow';
import { description as characterDescription } from './character/Character.resource';
import { description as collectionDescription } from './collection/Collection.resource';
import { description as episodeDescription } from './episode/Episode.resource';
import { description as indexDescription } from './index/Index.resource';
import { description as personDescription } from './person/Person.resource';
import { description as revisionDescription } from './revision/Revision.resource';
import { description as subjectDescription } from './subject/Subject.resource';
import { description as userDescription } from './user/User.resource';

export const properties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Character', value: 'character' },
			{ name: 'Collection', value: 'collection' },
			{ name: 'Episode', value: 'episode' },
			{ name: 'Index', value: 'index' },
			{ name: 'Person', value: 'person' },
			{ name: 'Revision', value: 'revision' },
			{ name: 'Subject', value: 'subject' },
			{ name: 'User', value: 'user' },
		],
		default: 'subject',
	},
	...characterDescription,
	...collectionDescription,
	...episodeDescription,
	...indexDescription,
	...personDescription,
	...revisionDescription,
	...subjectDescription,
	...userDescription,
];
```

- [ ] **Step 2: Full build verify**

Run: `n8n-node build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Lint verify**

Run: `n8n-node lint`
Expected: No lint errors.

- [ ] **Step 4: Commit**

```bash
git add nodes/BangumiTv/actions/descriptions.ts
git commit -m "refactor: remove Me resource from descriptions, keep 8 resources"
```
