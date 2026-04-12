# Naming Normalization & Resource Restructuring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure n8n Bangumi.tv node resources to conform to n8n UX guidelines — add Me resource, remove Collection resource, redistribute operations, and normalize all naming.

**Architecture:** Declarative n8n node pattern. Each resource has a `*.resource.ts` (operation registry) and per-operation `*.operation.ts` files (UI params + API routing). Changes are structural: create new files, update resource registries, update `descriptions.ts` (entry point), then delete old files. All operation files under `nodes/BangumitvApi/actions/`.

**Tech Stack:** TypeScript, n8n declarative node API, n8n-node CLI

**Verification:** This project has no test framework. Verification is via `bun run build` (TypeScript compilation) and `bun run lint` (code style). Run after each task to ensure no regressions.

**Spec:** `docs/superpowers/specs/2026-04-12-naming-normalization-design.md`

---

## Task 1: Create Me Resource (All New Files)

**Files:**
- Create: `nodes/BangumitvApi/actions/me/Me.resource.ts`
- Create: `nodes/BangumitvApi/actions/me/get.operation.ts`
- Create: `nodes/BangumitvApi/actions/me/getCollection.operation.ts`
- Create: `nodes/BangumitvApi/actions/me/createOrUpdateCollection.operation.ts`
- Create: `nodes/BangumitvApi/actions/me/updateCollection.operation.ts`
- Create: `nodes/BangumitvApi/actions/me/getEpisodes.operation.ts`
- Create: `nodes/BangumitvApi/actions/me/updateEpisodes.operation.ts`
- Create: `nodes/BangumitvApi/actions/me/getEpisode.operation.ts`
- Create: `nodes/BangumitvApi/actions/me/updateEpisode.operation.ts`
- Create: `nodes/BangumitvApi/actions/me/createCharacterCollect.operation.ts`
- Create: `nodes/BangumitvApi/actions/me/deleteCharacterCollect.operation.ts`
- Create: `nodes/BangumitvApi/actions/me/createPersonCollect.operation.ts`
- Create: `nodes/BangumitvApi/actions/me/deletePersonCollect.operation.ts`
- Create: `nodes/BangumitvApi/actions/me/createIndexCollect.operation.ts`
- Create: `nodes/BangumitvApi/actions/me/deleteIndexCollect.operation.ts`

- [ ] **Step 1: Create me directory**

```bash
mkdir -p nodes/BangumitvApi/actions/me
```

- [ ] **Step 2: Create `me/get.operation.ts`**

Port from `user/getMyself.operation.ts`. Simple hidden field routing to `GET /v0/me`.

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
				resource: ['me'],
				operation: ['get'],
			},
		},
	},
];
```

- [ ] **Step 3: Create `me/getCollection.operation.ts`**

Port from `collection/get.operation.ts`. Changes: `resource: ['me']`, `operation: ['getCollection']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'GET', url: '=/v0/users/-/collections/{{$value}}' },
		},
		displayOptions: { show: { resource: ['me'], operation: ['getCollection'] } },
	},
];
```

- [ ] **Step 4: Create `me/createOrUpdateCollection.operation.ts`**

Port from `collection/create.operation.ts`. Changes: `resource: ['me']`, `operation: ['createOrUpdateCollection']`.

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { collectionTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'POST', url: '=/v0/users/-/collections/{{$value}}' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const type = this.getNodeParameter('type', 0) as number | undefined;
						const rate = this.getNodeParameter('rate', 0) as number | undefined;
						const comment = this.getNodeParameter('comment', 0) as string | undefined;
						const tags = this.getNodeParameter('tags', 0) as string;
						const privacy = this.getNodeParameter('privacy', 0) as boolean | undefined;
						const body: Record<string, unknown> = {};
						if (type !== undefined) body.type = type;
						if (rate !== undefined) body.rate = rate;
						if (comment) body.comment = comment;
						if (tags) {
							const tagArray = tags
								.split(',')
								.map((t) => t.trim())
								.filter(Boolean);
							if (tagArray.length > 0) body.tags = tagArray;
						}
						if (privacy !== undefined) body.private = privacy;
						if (Object.keys(body).length > 0) requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['me'], operation: ['createOrUpdateCollection'] } },
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: collectionTypeOptions,
		default: 1,
		description: 'Collection type',
		displayOptions: { show: { resource: ['me'], operation: ['createOrUpdateCollection'] } },
	},
	{
		displayName: 'Rate',
		name: 'rate',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, maxValue: 10 },
		description: 'Rating (0-10)',
		displayOptions: { show: { resource: ['me'], operation: ['createOrUpdateCollection'] } },
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		description: 'Comment/review',
		displayOptions: { show: { resource: ['me'], operation: ['createOrUpdateCollection'] } },
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		description: 'Comma-separated tag names',
		displayOptions: { show: { resource: ['me'], operation: ['createOrUpdateCollection'] } },
	},
	{
		displayName: 'Private',
		name: 'privacy',
		type: 'boolean',
		default: false,
		description: 'Whether the collection is only visible to self',
		displayOptions: { show: { resource: ['me'], operation: ['createOrUpdateCollection'] } },
	},
];
```

- [ ] **Step 5: Create `me/updateCollection.operation.ts`**

Port from `collection/update.operation.ts`. Changes: `resource: ['me']`, `operation: ['updateCollection']`.

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { collectionTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'PATCH', url: '=/v0/users/-/collections/{{$value}}' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const type = this.getNodeParameter('type', 0) as number | undefined;
						const rate = this.getNodeParameter('rate', 0) as number | undefined;
						const comment = this.getNodeParameter('comment', 0) as string | undefined;
						const tags = this.getNodeParameter('tags', 0) as string;
						const privacy = this.getNodeParameter('privacy', 0) as boolean | undefined;
						const body: Record<string, unknown> = {};
						if (type !== undefined) body.type = type;
						if (rate !== undefined) body.rate = rate;
						if (comment) body.comment = comment;
						if (tags) {
							const tagArray = tags
								.split(',')
								.map((t) => t.trim())
								.filter(Boolean);
							if (tagArray.length > 0) body.tags = tagArray;
						}
						if (privacy !== undefined) body.private = privacy;
						if (Object.keys(body).length > 0) requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['me'], operation: ['updateCollection'] } },
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: collectionTypeOptions,
		default: 1,
		displayOptions: { show: { resource: ['me'], operation: ['updateCollection'] } },
	},
	{
		displayName: 'Rate',
		name: 'rate',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, maxValue: 10 },
		displayOptions: { show: { resource: ['me'], operation: ['updateCollection'] } },
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['me'], operation: ['updateCollection'] } },
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		description: 'Comma-separated tag names',
		displayOptions: { show: { resource: ['me'], operation: ['updateCollection'] } },
	},
	{
		displayName: 'Private',
		name: 'privacy',
		type: 'boolean',
		default: false,
		description: 'Whether the collection is only visible to self',
		displayOptions: { show: { resource: ['me'], operation: ['updateCollection'] } },
	},
];
```

- [ ] **Step 6: Create `me/getEpisodes.operation.ts`**

Port from `collection/getEpisodes.operation.ts`. Changes: `resource: ['me']`, `operation: ['getEpisodes']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { episodeCollectionLimitProperty, offsetProperty, episodeTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/-/collections/{{$value}}/episodes',
			},
		},
		displayOptions: { show: { resource: ['me'], operation: ['getEpisodes'] } },
	},
	{
		displayName: 'Episode Type',
		name: 'episodeType',
		type: 'options',
		options: episodeTypeOptions,
		default: 0,
		description: 'Filter by episode type',
		displayOptions: { show: { resource: ['me'], operation: ['getEpisodes'] } },
		routing: { request: { qs: { episode_type: '={{$value}}' } } },
	},
	{
		...episodeCollectionLimitProperty,
		displayOptions: { show: { resource: ['me'], operation: ['getEpisodes'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['me'], operation: ['getEpisodes'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 7: Create `me/updateEpisodes.operation.ts`**

Port from `collection/updateEpisodes.operation.ts`. Changes: `resource: ['me']`, `operation: ['updateEpisodes']`.

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { episodeCollectionTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'PATCH', url: '=/v0/users/-/collections/{{$value}}/episodes' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const episodeIds = this.getNodeParameter('episodeIds', 0) as string;
						const type = this.getNodeParameter('type', 0) as number;
						requestOptions.body = {
							episode_id: episodeIds.split(',').map(Number),
							type,
						};
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['me'], operation: ['updateEpisodes'] } },
	},
	{
		displayName: 'Episode IDs',
		name: 'episodeIds',
		type: 'string',
		required: true,
		default: '',
		description: 'Comma-separated episode IDs',
		displayOptions: { show: { resource: ['me'], operation: ['updateEpisodes'] } },
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: episodeCollectionTypeOptions,
		required: true,
		default: 1,
		description: 'Episode collection type',
		displayOptions: { show: { resource: ['me'], operation: ['updateEpisodes'] } },
	},
];
```

- [ ] **Step 8: Create `me/getEpisode.operation.ts`**

Port from `collection/getEpisode.operation.ts`. Changes: `resource: ['me']`, `operation: ['getEpisode']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Episode ID',
		name: 'episodeId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'GET', url: '=/v0/users/-/collections/-/episodes/{{$value}}' },
		},
		displayOptions: { show: { resource: ['me'], operation: ['getEpisode'] } },
	},
];
```

- [ ] **Step 9: Create `me/updateEpisode.operation.ts`**

Port from `collection/updateEpisode.operation.ts`. Changes: `resource: ['me']`, `operation: ['updateEpisode']`.

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { episodeCollectionTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Episode ID',
		name: 'episodeId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'PUT', url: '=/v0/users/-/collections/-/episodes/{{$value}}' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const type = this.getNodeParameter('type', 0) as number;
						requestOptions.body = { type };
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['me'], operation: ['updateEpisode'] } },
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: episodeCollectionTypeOptions,
		required: true,
		default: 1,
		description: 'Episode collection type',
		displayOptions: { show: { resource: ['me'], operation: ['updateEpisode'] } },
	},
];
```

- [ ] **Step 10: Create `me/createCharacterCollect.operation.ts`**

Port from `character/collect.operation.ts`. Changes: `resource: ['me']`, `operation: ['createCharacterCollect']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'POST',
				url: '=/v0/characters/{{$value}}/collect',
			},
		},
		displayOptions: {
			show: { resource: ['me'], operation: ['createCharacterCollect'] },
		},
	},
];
```

- [ ] **Step 11: Create `me/deleteCharacterCollect.operation.ts`**

Port from `character/uncollect.operation.ts`. Changes: `resource: ['me']`, `operation: ['deleteCharacterCollect']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'DELETE',
				url: '=/v0/characters/{{$value}}/collect',
			},
		},
		displayOptions: {
			show: { resource: ['me'], operation: ['deleteCharacterCollect'] },
		},
	},
];
```

- [ ] **Step 12: Create `me/createPersonCollect.operation.ts`**

Port from `person/collect.operation.ts`. Changes: `resource: ['me']`, `operation: ['createPersonCollect']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'POST',
				url: '=/v0/persons/{{$value}}/collect',
			},
		},
		displayOptions: {
			show: { resource: ['me'], operation: ['createPersonCollect'] },
		},
	},
];
```

- [ ] **Step 13: Create `me/deletePersonCollect.operation.ts`**

Port from `person/uncollect.operation.ts`. Changes: `resource: ['me']`, `operation: ['deletePersonCollect']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'DELETE',
				url: '=/v0/persons/{{$value}}/collect',
			},
		},
		displayOptions: {
			show: { resource: ['me'], operation: ['deletePersonCollect'] },
		},
	},
];
```

- [ ] **Step 14: Create `me/createIndexCollect.operation.ts`**

Port from `index/collect.operation.ts`. Changes: `resource: ['me']`, `operation: ['createIndexCollect']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		default: '',
		routing: { request: { method: 'POST', url: '=/v0/indices/{{$value}}/collect' } },
		displayOptions: { show: { resource: ['me'], operation: ['createIndexCollect'] } },
	},
];
```

- [ ] **Step 15: Create `me/deleteIndexCollect.operation.ts`**

Port from `index/uncollect.operation.ts`. Changes: `resource: ['me']`, `operation: ['deleteIndexCollect']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		default: '',
		routing: { request: { method: 'DELETE', url: '=/v0/indices/{{$value}}/collect' } },
		displayOptions: { show: { resource: ['me'], operation: ['deleteIndexCollect'] } },
	},
];
```

- [ ] **Step 16: Create `me/Me.resource.ts`**

All 14 operations registered with n8n UX-compliant names/actions/descriptions per spec section 3.6.

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as getCollectionProps } from './getCollection.operation';
import { properties as createOrUpdateCollectionProps } from './createOrUpdateCollection.operation';
import { properties as updateCollectionProps } from './updateCollection.operation';
import { properties as getEpisodesProps } from './getEpisodes.operation';
import { properties as updateEpisodesProps } from './updateEpisodes.operation';
import { properties as getEpisodeProps } from './getEpisode.operation';
import { properties as updateEpisodeProps } from './updateEpisode.operation';
import { properties as createCharacterCollectProps } from './createCharacterCollect.operation';
import { properties as deleteCharacterCollectProps } from './deleteCharacterCollect.operation';
import { properties as createPersonCollectProps } from './createPersonCollect.operation';
import { properties as deletePersonCollectProps } from './deletePersonCollect.operation';
import { properties as createIndexCollectProps } from './createIndexCollect.operation';
import { properties as deleteIndexCollectProps } from './deleteIndexCollect.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Create Character Collection',
				value: 'createCharacterCollect',
				action: 'Create character collection for current user',
				description: 'Add character to current user\'s collection',
			},
			{
				name: 'Create Index Collection',
				value: 'createIndexCollect',
				action: 'Create index collection for current user',
				description: 'Add index to current user\'s collection',
			},
			{
				name: 'Create or Update Collection',
				value: 'createOrUpdateCollection',
				action: 'Create or update subject collection for current user',
				description: 'Create a new subject collection or update existing one',
			},
			{
				name: 'Create Person Collection',
				value: 'createPersonCollect',
				action: 'Create person collection for current user',
				description: 'Add person to current user\'s collection',
			},
			{
				name: 'Delete Character Collection',
				value: 'deleteCharacterCollect',
				action: 'Delete character collection for current user',
				description: 'Remove character from current user\'s collection',
			},
			{
				name: 'Delete Index Collection',
				value: 'deleteIndexCollect',
				action: 'Delete index collection for current user',
				description: 'Remove index from current user\'s collection',
			},
			{
				name: 'Delete Person Collection',
				value: 'deletePersonCollect',
				action: 'Delete person collection for current user',
				description: 'Remove person from current user\'s collection',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get current user',
				description: 'Retrieve current authenticated user profile',
			},
			{
				name: 'Get Collection',
				value: 'getCollection',
				action: 'Get subject collection for current user',
				description: 'Retrieve subject collection status for current user',
			},
			{
				name: 'Get Episode',
				value: 'getEpisode',
				action: 'Get episode collection for current user',
				description: 'Retrieve single episode collection status',
			},
			{
				name: 'Get Many Episodes',
				value: 'getEpisodes',
				action: 'Get many episode collections for current user',
				description: 'Retrieve episode collection statuses for a subject',
			},
			{
				name: 'Update Collection',
				value: 'updateCollection',
				action: 'Update subject collection for current user',
				description: 'Update subject collection status for current user',
			},
			{
				name: 'Update Episode',
				value: 'updateEpisode',
				action: 'Update episode collection for current user',
				description: 'Update single episode collection status',
			},
			{
				name: 'Update Episodes',
				value: 'updateEpisodes',
				action: 'Update episode collections for current user',
				description: 'Update episode collection statuses for a subject',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['me'] } },
	},
	...getProps,
	...getCollectionProps,
	...createOrUpdateCollectionProps,
	...updateCollectionProps,
	...getEpisodesProps,
	...updateEpisodesProps,
	...getEpisodeProps,
	...updateEpisodeProps,
	...createCharacterCollectProps,
	...deleteCharacterCollectProps,
	...createPersonCollectProps,
	...deletePersonCollectProps,
	...createIndexCollectProps,
	...deleteIndexCollectProps,
];
```

- [ ] **Step 17: Verify build**

Run: `bun run build`
Expected: PASS (new files are unused, no conflicts)

- [ ] **Step 18: Commit**

```bash
git add nodes/BangumitvApi/actions/me/
git commit -m "feat: add Me resource with 14 current-user operations"
```

---

## Task 2: Create User Collection Operation Files

Create 5 new operation files under `user/` ported from `collection/`. These handle any-user-visible collection queries (use username parameter, not `-` placeholder).

**Files:**
- Create: `nodes/BangumitvApi/actions/user/getCollections.operation.ts`
- Create: `nodes/BangumitvApi/actions/user/getCharacterCollections.operation.ts`
- Create: `nodes/BangumitvApi/actions/user/getCharacterCollection.operation.ts`
- Create: `nodes/BangumitvApi/actions/user/getPersonCollections.operation.ts`
- Create: `nodes/BangumitvApi/actions/user/getPersonCollection.operation.ts`

- [ ] **Step 1: Create `user/getCollections.operation.ts`**

Port from `collection/getCollections.operation.ts`. Change `resource: ['user']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';
import {
	limitProperty,
	offsetProperty,
	subjectTypeOptions,
	collectionTypeOptions,
} from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/{{$value}}/collections',
			},
		},
		displayOptions: { show: { resource: ['user'], operation: ['getCollections'] } },
	},
	{
		displayName: 'Subject Type',
		name: 'subjectType',
		type: 'options',
		options: [{ name: 'All', value: '' }, ...subjectTypeOptions],
		default: '',
		description: 'Filter by subject type',
		displayOptions: { show: { resource: ['user'], operation: ['getCollections'] } },
		routing: { request: { qs: { subject_type: '={{$value}}' } } },
	},
	{
		displayName: 'Collection Type',
		name: 'collectionType',
		type: 'options',
		options: [{ name: 'All', value: '' }, ...collectionTypeOptions],
		default: '',
		description: 'Filter by collection type',
		displayOptions: { show: { resource: ['user'], operation: ['getCollections'] } },
		routing: { request: { qs: { type: '={{$value}}' } } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['user'], operation: ['getCollections'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['user'], operation: ['getCollections'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 2: Create `user/getCharacterCollections.operation.ts`**

Port from `collection/getCharacterCollections.operation.ts`. Change `resource: ['user']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'GET', url: '=/v0/users/{{$value}}/collections/-/characters' },
		},
		displayOptions: { show: { resource: ['user'], operation: ['getCharacterCollections'] } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['user'], operation: ['getCharacterCollections'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['user'], operation: ['getCharacterCollections'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 3: Create `user/getCharacterCollection.operation.ts`**

Port from `collection/getCharacterCollection.operation.ts`. Change `resource: ['user']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/{{$value}}/collections/-/characters/{{$parameter["characterId"]}}',
			},
		},
		displayOptions: { show: { resource: ['user'], operation: ['getCharacterCollection'] } },
	},
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['getCharacterCollection'] } },
	},
];
```

- [ ] **Step 4: Create `user/getPersonCollections.operation.ts`**

Port from `collection/getPersonCollections.operation.ts`. Change `resource: ['user']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'GET', url: '=/v0/users/{{$value}}/collections/-/persons' },
		},
		displayOptions: { show: { resource: ['user'], operation: ['getPersonCollections'] } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['user'], operation: ['getPersonCollections'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['user'], operation: ['getPersonCollections'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 5: Create `user/getPersonCollection.operation.ts`**

Port from `collection/getPersonCollection.operation.ts`. Change `resource: ['user']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/{{$value}}/collections/-/persons/{{$parameter["personId"]}}',
			},
		},
		displayOptions: { show: { resource: ['user'], operation: ['getPersonCollection'] } },
	},
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['getPersonCollection'] } },
	},
];
```

- [ ] **Step 6: Verify build**

Run: `bun run build`
Expected: PASS (new files unused)

- [ ] **Step 7: Commit**

```bash
git add nodes/BangumitvApi/actions/user/
git commit -m "feat: add collection query operations to User resource"
```

---

## Task 3: Update descriptions.ts

Replace Collection import with Me, update resource dropdown.

**Files:**
- Modify: `nodes/BangumitvApi/actions/descriptions.ts`

- [ ] **Step 1: Update descriptions.ts**

Replace the entire file content:

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { description as subjectDescription } from './subject/Subject.resource';
import { description as episodeDescription } from './episode/Episode.resource';
import { description as characterDescription } from './character/Character.resource';
import { description as personDescription } from './person/Person.resource';
import { description as userDescription } from './user/User.resource';
import { description as meDescription } from './me/Me.resource';
import { description as revisionDescription } from './revision/Revision.resource';
import { description as indexDescription } from './index/Index.resource';

export const properties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Character', value: 'character' },
			{ name: 'Episode', value: 'episode' },
			{ name: 'Index', value: 'index' },
			{ name: 'Me', value: 'me' },
			{ name: 'Person', value: 'person' },
			{ name: 'Revision', value: 'revision' },
			{ name: 'Subject', value: 'subject' },
			{ name: 'User', value: 'user' },
		],
		default: 'subject',
	},
	...subjectDescription,
	...episodeDescription,
	...characterDescription,
	...personDescription,
	...userDescription,
	...meDescription,
	...revisionDescription,
	...indexDescription,
];
```

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: PASS (Me.resource.ts exists, Collection.resource.ts is dead code but not imported)

- [ ] **Step 3: Commit**

```bash
git add nodes/BangumitvApi/actions/descriptions.ts
git commit -m "refactor: replace Collection with Me resource in descriptions"
```

---

## Task 4: Update User Resource

Add 5 collection operations, remove getMyself, update naming per spec section 3.5.

**Files:**
- Modify: `nodes/BangumitvApi/actions/user/User.resource.ts`

- [ ] **Step 1: Rewrite `user/User.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as getAvatarProps } from './getAvatar.operation';
import { properties as getCollectionsProps } from './getCollections.operation';
import { properties as getCharacterCollectionsProps } from './getCharacterCollections.operation';
import { properties as getCharacterCollectionProps } from './getCharacterCollection.operation';
import { properties as getPersonCollectionsProps } from './getPersonCollections.operation';
import { properties as getPersonCollectionProps } from './getPersonCollection.operation';

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
				action: 'Get user',
				description: 'Retrieve user profile by username',
			},
			{
				name: 'Get Avatar',
				value: 'getAvatar',
				action: 'Get user avatar',
				description: 'Retrieve user avatar by username',
			},
			{
				name: 'Get Many Collections',
				value: 'getCollections',
				action: 'Get many user collections',
				description: 'Retrieve subject collections for user',
			},
			{
				name: 'Get Many Character Collections',
				value: 'getCharacterCollections',
				action: 'Get many user character collections',
				description: 'Retrieve character collections for user',
			},
			{
				name: 'Get Character Collection',
				value: 'getCharacterCollection',
				action: 'Get user character collection',
				description: 'Retrieve single character collection for user',
			},
			{
				name: 'Get Many Person Collections',
				value: 'getPersonCollections',
				action: 'Get many user person collections',
				description: 'Retrieve person collections for user',
			},
			{
				name: 'Get Person Collection',
				value: 'getPersonCollection',
				action: 'Get user person collection',
				description: 'Retrieve single person collection for user',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['user'] } },
	},
	...getProps,
	...getAvatarProps,
	...getCollectionsProps,
	...getCharacterCollectionsProps,
	...getCharacterCollectionProps,
	...getPersonCollectionsProps,
	...getPersonCollectionProps,
];
```

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add nodes/BangumitvApi/actions/user/User.resource.ts
git commit -m "refactor: update User resource with collection operations"
```

---

## Task 5: Update Subject Resource

Rename `getAll` → `getMany`, update all operation names/actions/descriptions per spec section 3.1.

**Files:**
- Create: `nodes/BangumitvApi/actions/subject/getMany.operation.ts`
- Modify: `nodes/BangumitvApi/actions/subject/Subject.resource.ts`

- [ ] **Step 1: Create `subject/getMany.operation.ts`**

Port from `subject/getAll.operation.ts`. Change `operation: ['getAll']` → `operation: ['getMany']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';
import {
	limitProperty,
	offsetProperty,
	subjectTypeOptions,
	subjectSortOptions,
} from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject Type',
		name: 'subjectType',
		type: 'options',
		options: subjectTypeOptions,
		required: true,
		default: 2,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/subjects',
				qs: { type: '={{$value}}' },
			},
		},
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'options',
		options: subjectSortOptions,
		default: 'date',
		description: 'Sort order (date or rank)',
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getMany'],
			},
		},
		routing: { request: { qs: { sort: '={{$value}}' } } },
	},
	{
		displayName: 'Year',
		name: 'year',
		type: 'number',
		default: 0,
		description: 'Filter by year',
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getMany'],
			},
		},
		routing: { request: { qs: { year: '={{$value}}' } } },
	},
	{
		displayName: 'Month',
		name: 'month',
		type: 'number',
		default: 0,
		description: 'Filter by month',
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getMany'],
			},
		},
		routing: { request: { qs: { month: '={{$value}}' } } },
	},
	{
		...limitProperty,
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getMany'],
			},
		},
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getMany'],
			},
		},
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 2: Rewrite `subject/Subject.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getCalendarProps } from './getCalendar.operation';
import { properties as searchProps } from './search.operation';
import { properties as getManyProps } from './getMany.operation';
import { properties as getProps } from './get.operation';
import { properties as getImageProps } from './getImage.operation';
import { properties as getPersonsProps } from './getPersons.operation';
import { properties as getCharactersProps } from './getCharacters.operation';
import { properties as getRelationsProps } from './getRelations.operation';

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
				action: 'Get subject',
				description: 'Retrieve a subject by ID',
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
				description: 'Browse subjects with filters',
			},
			{
				name: 'Get Many Characters',
				value: 'getCharacters',
				action: 'Get related characters for subject',
				description: 'Retrieve related characters for a subject',
			},
			{
				name: 'Get Many Persons',
				value: 'getPersons',
				action: 'Get related persons for subject',
				description: 'Retrieve related persons for a subject',
			},
			{
				name: 'Get Many Related Subjects',
				value: 'getRelations',
				action: 'Get related subjects for subject',
				description: 'Retrieve related subjects for a subject',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search subjects',
				description: 'Search subjects by keyword',
			},
		],
		default: 'getMany',
		displayOptions: {
			show: {
				resource: ['subject'],
			},
		},
	},
	...getCalendarProps,
	...searchProps,
	...getManyProps,
	...getProps,
	...getImageProps,
	...getPersonsProps,
	...getCharactersProps,
	...getRelationsProps,
];
```

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add nodes/BangumitvApi/actions/subject/
git commit -m "refactor: normalize Subject resource naming (getAll→getMany, related ops)"
```

---

## Task 6: Update Episode Resource

Rename `getAll` → `getMany`, update naming per spec section 3.2.

**Files:**
- Create: `nodes/BangumitvApi/actions/episode/getMany.operation.ts`
- Modify: `nodes/BangumitvApi/actions/episode/Episode.resource.ts`

- [ ] **Step 1: Create `episode/getMany.operation.ts`**

Port from `episode/getAll.operation.ts`. Change `operation: ['getAll']` → `operation: ['getMany']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { episodeLimitProperty, offsetProperty, episodeTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/episodes',
				qs: { subject_id: '={{$value}}' },
			},
		},
		displayOptions: {
			show: {
				resource: ['episode'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Episode Type',
		name: 'episodeType',
		type: 'options',
		options: episodeTypeOptions,
		description: 'Filter by episode type',
		default: '',
		displayOptions: {
			show: {
				resource: ['episode'],
				operation: ['getMany'],
			},
		},
		routing: { request: { qs: { type: '={{$value}}' } } },
	},
	{
		...episodeLimitProperty,
		displayOptions: {
			show: {
				resource: ['episode'],
				operation: ['getMany'],
			},
		},
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: {
			show: {
				resource: ['episode'],
				operation: ['getMany'],
			},
		},
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 2: Rewrite `episode/Episode.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getManyProps } from './getMany.operation';
import { properties as getProps } from './get.operation';

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
				description: 'Retrieve an episode by ID',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many episodes',
				description: 'Retrieve episodes for a subject',
			},
		],
		default: 'getMany',
		displayOptions: {
			show: {
				resource: ['episode'],
			},
		},
	},
	...getManyProps,
	...getProps,
];
```

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add nodes/BangumitvApi/actions/episode/
git commit -m "refactor: normalize Episode resource naming (getAll→getMany)"
```

---

## Task 7: Update Character Resource

Remove collect/uncollect operations, update naming per spec section 3.3.

**Files:**
- Modify: `nodes/BangumitvApi/actions/character/Character.resource.ts`

- [ ] **Step 1: Rewrite `character/Character.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as searchProps } from './search.operation';
import { properties as getSubjectsProps } from './getSubjects.operation';
import { properties as getPersonsProps } from './getPersons.operation';
import { properties as getImageProps } from './getImage.operation';

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
				action: 'Get character',
				description: 'Retrieve a character by ID',
			},
			{
				name: 'Get Image',
				value: 'getImage',
				action: 'Get character image',
				description: 'Retrieve character image',
			},
			{
				name: 'Get Many Persons',
				value: 'getPersons',
				action: 'Get related persons for character',
				description: 'Retrieve related persons for a character',
			},
			{
				name: 'Get Many Subjects',
				value: 'getSubjects',
				action: 'Get related subjects for character',
				description: 'Retrieve related subjects for a character',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search characters',
				description: 'Search characters by keyword',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['character'] } },
	},
	...getProps,
	...searchProps,
	...getSubjectsProps,
	...getPersonsProps,
	...getImageProps,
];
```

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: PASS (collect/uncollect files still exist but no longer imported by Character.resource.ts)

- [ ] **Step 3: Commit**

```bash
git add nodes/BangumitvApi/actions/character/Character.resource.ts
git commit -m "refactor: update Character resource (remove collect/uncollect, normalize naming)"
```

---

## Task 8: Update Person Resource

Remove collect/uncollect operations, update naming per spec section 3.4.

**Files:**
- Modify: `nodes/BangumitvApi/actions/person/Person.resource.ts`

- [ ] **Step 1: Rewrite `person/Person.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as searchProps } from './search.operation';
import { properties as getSubjectsProps } from './getSubjects.operation';
import { properties as getCharactersProps } from './getCharacters.operation';
import { properties as getImageProps } from './getImage.operation';

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
				action: 'Get person',
				description: 'Retrieve a person by ID',
			},
			{
				name: 'Get Image',
				value: 'getImage',
				action: 'Get person image',
				description: 'Retrieve person image',
			},
			{
				name: 'Get Many Characters',
				value: 'getCharacters',
				action: 'Get related characters for person',
				description: 'Retrieve related characters for a person',
			},
			{
				name: 'Get Many Subjects',
				value: 'getSubjects',
				action: 'Get related subjects for person',
				description: 'Retrieve related subjects for a person',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search persons',
				description: 'Search persons by keyword',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['person'] } },
	},
	...getProps,
	...searchProps,
	...getSubjectsProps,
	...getCharactersProps,
	...getImageProps,
];
```

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add nodes/BangumitvApi/actions/person/Person.resource.ts
git commit -m "refactor: update Person resource (remove collect/uncollect, normalize naming)"
```

---

## Task 9: Update Index Resource

Remove collect/uncollect, rename Edit→Update/Edit Subject→Update Subject/Remove Subject→Delete Subject, update naming per spec section 3.8.

**Files:**
- Create: `nodes/BangumitvApi/actions/index/update.operation.ts`
- Create: `nodes/BangumitvApi/actions/index/updateSubject.operation.ts`
- Create: `nodes/BangumitvApi/actions/index/deleteSubject.operation.ts`
- Modify: `nodes/BangumitvApi/actions/index/Index.resource.ts`

- [ ] **Step 1: Create `index/update.operation.ts`**

Port from `index/edit.operation.ts`. Change `operation: ['edit']` → `operation: ['update']`.

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: { method: 'PUT', url: '=/v0/indices/{{$value}}' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const title = this.getNodeParameter('title', 0) as string | undefined;
						const description = this.getNodeParameter('description', 0) as string | undefined;
						const body: Record<string, unknown> = {};
						if (title) body.title = title;
						if (description) body.description = description;
						if (Object.keys(body).length > 0) requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['index'], operation: ['update'] } },
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['update'] } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['update'] } },
	},
];
```

- [ ] **Step 2: Create `index/updateSubject.operation.ts`**

Port from `index/editSubject.operation.ts`. Change `operation: ['editSubject']` → `operation: ['updateSubject']`.

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'PUT',
				url: '=/v0/indices/{{$value}}/subjects/{{$parameter["subjectId"]}}',
			},
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
						const sort = this.getNodeParameter('sort', 0) as number | undefined;
						const comment = this.getNodeParameter('comment', 0) as string | undefined;
						const body: Record<string, unknown> = {};
						if (sort !== undefined) body.sort = sort;
						if (comment) body.comment = comment;
						if (Object.keys(body).length > 0) requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['index'], operation: ['updateSubject'] } },
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['updateSubject'] } },
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['index'], operation: ['updateSubject'] } },
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['updateSubject'] } },
	},
];
```

- [ ] **Step 3: Create `index/deleteSubject.operation.ts`**

Port from `index/removeSubject.operation.ts`. Change `operation: ['removeSubject']` → `operation: ['deleteSubject']`.

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'DELETE',
				url: '=/v0/indices/{{$value}}/subjects/{{$parameter["subjectId"]}}',
			},
		},
		displayOptions: { show: { resource: ['index'], operation: ['deleteSubject'] } },
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['index'], operation: ['deleteSubject'] } },
	},
];
```

- [ ] **Step 4: Rewrite `index/Index.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as createProps } from './create.operation';
import { properties as getProps } from './get.operation';
import { properties as updateProps } from './update.operation';
import { properties as getSubjectsProps } from './getSubjects.operation';
import { properties as addSubjectProps } from './addSubject.operation';
import { properties as updateSubjectProps } from './updateSubject.operation';
import { properties as deleteSubjectProps } from './deleteSubject.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Append Subject',
				value: 'addSubject',
				action: 'Append subject to index',
				description: 'Insert a subject into an index',
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
				description: 'Remove a subject from an index',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get index',
				description: 'Retrieve an index by ID',
			},
			{
				name: 'Get Many Subjects',
				value: 'getSubjects',
				action: 'Get many subjects in index',
				description: 'Retrieve subjects in an index',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update index',
				description: 'Update index information',
			},
			{
				name: 'Update Subject',
				value: 'updateSubject',
				action: 'Update subject in index',
				description: 'Update subject information in an index',
			},
		],
		default: 'get',
		displayOptions: { show: { resource: ['index'] } },
	},
	...createProps,
	...getProps,
	...updateProps,
	...getSubjectsProps,
	...addSubjectProps,
	...updateSubjectProps,
	...deleteSubjectProps,
];
```

- [ ] **Step 5: Verify build**

Run: `bun run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add nodes/BangumitvApi/actions/index/
git commit -m "refactor: normalize Index resource (edit→update, remove→delete, remove collect)"
```

---

## Task 10: Update Revision Resource

Update batch operation names to include "Get Many" prefix per spec section 3.7.

**Files:**
- Modify: `nodes/BangumitvApi/actions/revision/Revision.resource.ts`

- [ ] **Step 1: Rewrite `revision/Revision.resource.ts`**

No file renames needed — values stay the same. Only name/action/description fields update.

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getSubjectRevisionsProps } from './getSubjectRevisions.operation';
import { properties as getEpisodeRevisionsProps } from './getEpisodeRevisions.operation';
import { properties as getCharacterRevisionsProps } from './getCharacterRevisions.operation';
import { properties as getPersonRevisionsProps } from './getPersonRevisions.operation';
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
				name: 'Get Character Revision',
				value: 'getCharacterRevision',
				action: 'Get character revision',
				description: 'Retrieve a character revision by ID',
			},
			{
				name: 'Get Episode Revision',
				value: 'getEpisodeRevision',
				action: 'Get episode revision',
				description: 'Retrieve an episode revision by ID',
			},
			{
				name: 'Get Many Character Revisions',
				value: 'getCharacterRevisions',
				action: 'Get many character revisions',
				description: 'Retrieve revision history for a character',
			},
			{
				name: 'Get Many Episode Revisions',
				value: 'getEpisodeRevisions',
				action: 'Get many episode revisions',
				description: 'Retrieve revision history for an episode',
			},
			{
				name: 'Get Many Person Revisions',
				value: 'getPersonRevisions',
				action: 'Get many person revisions',
				description: 'Retrieve revision history for a person',
			},
			{
				name: 'Get Many Subject Revisions',
				value: 'getSubjectRevisions',
				action: 'Get many subject revisions',
				description: 'Retrieve revision history for a subject',
			},
			{
				name: 'Get Person Revision',
				value: 'getPersonRevision',
				action: 'Get person revision',
				description: 'Retrieve a person revision by ID',
			},
			{
				name: 'Get Subject Revision',
				value: 'getSubjectRevision',
				action: 'Get subject revision',
				description: 'Retrieve a subject revision by ID',
			},
		],
		default: 'getSubjectRevisions',
		displayOptions: {
			show: {
				resource: ['revision'],
			},
		},
	},
	...getSubjectRevisionsProps,
	...getEpisodeRevisionsProps,
	...getCharacterRevisionsProps,
	...getPersonRevisionsProps,
	...getSubjectRevisionProps,
	...getEpisodeRevisionProps,
	...getCharacterRevisionProps,
	...getPersonRevisionProps,
];
```

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add nodes/BangumitvApi/actions/revision/Revision.resource.ts
git commit -m "refactor: normalize Revision resource naming (batch ops get 'Get Many' prefix)"
```

---

## Task 11: Delete Old Files

Remove all deprecated files that are no longer imported by any resource.

**Files to delete:**
- `nodes/BangumitvApi/actions/collection/` (entire directory: 14 files)
- `nodes/BangumitvApi/actions/character/collect.operation.ts`
- `nodes/BangumitvApi/actions/character/uncollect.operation.ts`
- `nodes/BangumitvApi/actions/person/collect.operation.ts`
- `nodes/BangumitvApi/actions/person/uncollect.operation.ts`
- `nodes/BangumitvApi/actions/index/collect.operation.ts`
- `nodes/BangumitvApi/actions/index/uncollect.operation.ts`
- `nodes/BangumitvApi/actions/index/edit.operation.ts`
- `nodes/BangumitvApi/actions/index/editSubject.operation.ts`
- `nodes/BangumitvApi/actions/index/removeSubject.operation.ts`
- `nodes/BangumitvApi/actions/user/getMyself.operation.ts`
- `nodes/BangumitvApi/actions/subject/getAll.operation.ts`
- `nodes/BangumitvApi/actions/episode/getAll.operation.ts`

- [ ] **Step 1: Delete collection directory**

```bash
rm -rf nodes/BangumitvApi/actions/collection/
```

- [ ] **Step 2: Delete character collect/uncollect**

```bash
rm nodes/BangumitvApi/actions/character/collect.operation.ts
rm nodes/BangumitvApi/actions/character/uncollect.operation.ts
```

- [ ] **Step 3: Delete person collect/uncollect**

```bash
rm nodes/BangumitvApi/actions/person/collect.operation.ts
rm nodes/BangumitvApi/actions/person/uncollect.operation.ts
```

- [ ] **Step 4: Delete index collect/uncollect and old renamed files**

```bash
rm nodes/BangumitvApi/actions/index/collect.operation.ts
rm nodes/BangumitvApi/actions/index/uncollect.operation.ts
rm nodes/BangumitvApi/actions/index/edit.operation.ts
rm nodes/BangumitvApi/actions/index/editSubject.operation.ts
rm nodes/BangumitvApi/actions/index/removeSubject.operation.ts
```

- [ ] **Step 5: Delete user/getMyself**

```bash
rm nodes/BangumitvApi/actions/user/getMyself.operation.ts
```

- [ ] **Step 6: Delete old getAll files (replaced by getMany)**

```bash
rm nodes/BangumitvApi/actions/subject/getAll.operation.ts
rm nodes/BangumitvApi/actions/episode/getAll.operation.ts
```

- [ ] **Step 7: Verify build**

Run: `bun run build`
Expected: PASS (all deleted files are no longer imported)

- [ ] **Step 8: Commit**

```bash
git add -A nodes/BangumitvApi/actions/
git commit -m "chore: remove deprecated Collection resource and old operation files"
```

---

## Task 12: Final Build and Lint Verification

- [ ] **Step 1: Run full build**

```bash
bun run build
```

Expected: Clean build with no errors.

- [ ] **Step 2: Run linter**

```bash
bun run lint
```

Expected: No lint errors.

- [ ] **Step 3: Verify final directory structure**

Expected structure under `nodes/BangumitvApi/actions/`:

```
├── descriptions.ts
├── common.descriptions.ts
├── subject/           # 8 ops: get, getMany, search, getCalendar, getImage, getCharacters, getPersons, getRelations
├── episode/           # 2 ops: get, getMany
├── character/         # 5 ops: get, search, getImage, getSubjects, getPersons
├── person/            # 5 ops: get, search, getImage, getSubjects, getCharacters
├── user/              # 7 ops: get, getAvatar, getCollections, getCharacterCollections, getCharacterCollection, getPersonCollections, getPersonCollection
├── me/                # 14 ops (NEW): get, getCollection, createOrUpdateCollection, updateCollection, getEpisodes, updateEpisodes, getEpisode, updateEpisode, createCharacterCollect, deleteCharacterCollect, createPersonCollect, deletePersonCollect, createIndexCollect, deleteIndexCollect
├── revision/          # 8 ops: getSubjectRevision, getSubjectRevisions, getEpisodeRevision, getEpisodeRevisions, getCharacterRevision, getCharacterRevisions, getPersonRevision, getPersonRevisions
└── index/             # 7 ops: create, get, update, getSubjects, addSubject, updateSubject, deleteSubject
```

Total: 8 resources, 56 operations. No `collection/` directory. No `getAll.operation.ts` files. No `collect.operation.ts` or `uncollect.operation.ts` outside `me/`.

---

## Self-Review Checklist

### 1. Spec Coverage

| Spec Requirement | Task |
|---|---|
| Add Me resource (14 ops) | Task 1 |
| Remove Collection resource | Task 11 |
| Move Collection ops to User (5) | Task 2 + Task 4 |
| Move getMyself to Me | Task 1 (step 2) |
| Move collect/uncollect to Me (6 ops) | Task 1 (steps 10-15) |
| Subject: getAll→getMany, related naming | Task 5 |
| Episode: getAll→getMany | Task 6 |
| Character: remove collect/uncollect, related naming | Task 7 |
| Person: remove collect/uncollect, related naming | Task 8 |
| Index: edit→update, editSubject→updateSubject, removeSubject→deleteSubject | Task 9 |
| Revision: batch ops "Get Many" prefix | Task 10 |
| descriptions.ts: Collection→Me, alphabetical dropdown | Task 3 |

### 2. Placeholder Scan

No TBD, TODO, "implement later", "add validation", or "similar to" patterns found.

### 3. Type Consistency

All `displayOptions.show.resource` and `operation` values in operation files match the values defined in their parent resource files. All imports reference existing files. All `value` fields are unique within each resource.
