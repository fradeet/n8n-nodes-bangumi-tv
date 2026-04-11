# Bangumi Full API Node Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all 50 public Bangumi API operations in a single declarative n8n node with 8 resources.

**Architecture:** Single declarative node using `routing` on each property to define HTTP requests. Properties organized in `actions/` directory with `.resource.ts` aggregators and `.operation.ts` files. Shared properties extracted to `common.descriptions.ts`.

**Tech Stack:** TypeScript, n8n-workflow, n8n-node CLI, pnpm

**Design Spec:** `docs/superpowers/specs/2026-04-07-bangumitv-full-api-design.md`

**API Source:** OpenAPI 3.0.3 spec at https://bangumi.github.io/api/dist.json (version 2026-02-22)

---

## Routing Patterns Reference

This plan uses three routing patterns for declarative n8n nodes:

**Pattern A — Simple GET with path param:**
```typescript
routing: { request: { method: 'GET', url: '=/v0/subjects/{{$value}}' } }
```

**Pattern B — GET with query params (on first param define method+url+qs, on others only qs):**
```typescript
// First param defines method and url
routing: { request: { method: 'GET', url: '=/v0/subjects', qs: { type: '={{$value}}' } } }
// Subsequent params only add their qs
routing: { request: { qs: { limit: '={{$value}}' } } }
```

**Pattern C — POST/PUT/PATCH with JSON body (use preSend):**
```typescript
routing: {
  request: { method: 'POST', url: '=/v0/search/subjects' },
  send: {
    preSend: [
      async function (this: IExecuteSingleFunctions, requestOptions: IRequestOptions) {
        const keyword = this.getNodeParameter('keyword', 0) as string;
        const sort = this.getNodeParameter('sort', 0) as string;
        requestOptions.body = { keyword } as Record<string, unknown>;
        if (sort) (requestOptions.body as Record<string, unknown>).sort = sort;
        return requestOptions;
      },
    ],
  },
}
```

---

## File Map

| File | Responsibility |
|------|---------------|
| `nodes/BangumitvApi/BangumitvApi.node.ts` | Main node class, imports properties from descriptions.ts |
| `nodes/BangumitvApi/BangumitvApi.node.json` | Node metadata |
| `nodes/BangumitvApi/actions/descriptions.ts` | Aggregates all 8 resource descriptions + resource selector |
| `nodes/BangumitvApi/actions/common.descriptions.ts` | Shared properties: limit, offset, subjectType, collectionType, etc. |
| `nodes/BangumitvApi/actions/subject/Subject.resource.ts` | Subject resource: operation selector + 8 operations |
| `nodes/BangumitvApi/actions/subject/*.operation.ts` | 8 operation files |
| `nodes/BangumitvApi/actions/episode/Episode.resource.ts` | Episode resource: 2 operations |
| `nodes/BangumitvApi/actions/episode/*.operation.ts` | 2 operation files |
| `nodes/BangumitvApi/actions/character/Character.resource.ts` | Character resource: 7 operations |
| `nodes/BangumitvApi/actions/character/*.operation.ts` | 7 operation files |
| `nodes/BangumitvApi/actions/person/Person.resource.ts` | Person resource: 7 operations |
| `nodes/BangumitvApi/actions/person/*.operation.ts` | 7 operation files |
| `nodes/BangumitvApi/actions/user/User.resource.ts` | User resource: 3 operations |
| `nodes/BangumitvApi/actions/user/*.operation.ts` | 3 operation files |
| `nodes/BangumitvApi/actions/collection/Collection.resource.ts` | Collection resource: 12 operations |
| `nodes/BangumitvApi/actions/collection/*.operation.ts` | 12 operation files |
| `nodes/BangumitvApi/actions/revision/Revision.resource.ts` | Revision resource: 8 operations |
| `nodes/BangumitvApi/actions/revision/*.operation.ts` | 8 operation files |
| `nodes/BangumitvApi/actions/index/Index.resource.ts` | Index resource: 9 operations |
| `nodes/BangumitvApi/actions/index/*.operation.ts` | 9 operation files |

---

### Task 1: Foundation — Cleanup, Common Properties, Main Node

**Files:**
- Delete: `nodes/BangumitvApi/resources/` (entire directory)
- Modify: `nodes/BangumitvApi/BangumitvApi.node.ts`
- Modify: `nodes/BangumitvApi/BangumitvApi.node.json`
- Create: `nodes/BangumitvApi/actions/common.descriptions.ts`
- Create: `nodes/BangumitvApi/actions/descriptions.ts` (placeholder — will be completed in Task 9)

- [ ] **Step 1: Delete old resources directory**

```bash
rm -rf nodes/BangumitvApi/resources/
```

- [x] **Step 2: Create `common.descriptions.ts`**

```typescript
// nodes/BangumitvApi/actions/common.descriptions.ts
import type { INodeProperties } from 'n8n-workflow';

export const limitProperty: INodeProperties = {
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 30,
	typeOptions: {
		minValue: 1,
		maxValue: 50,
	},
	description: 'Max number of results to return',
};

export const limitPropertyLarge: INodeProperties = {
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 100,
	typeOptions: {
		minValue: 1,
		maxValue: 1000,
	},
	description: 'Max number of results to return',
};

export const offsetProperty: INodeProperties = {
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	typeOptions: {
		minValue: 0,
	},
	description: 'Number of results to skip',
};

export const subjectTypeOptions = [
	{ name: 'Book', value: 1 },
	{ name: 'Anime', value: 2 },
	{ name: 'Music', value: 3 },
	{ name: 'Game', value: 4 },
	{ name: 'Real', value: 6 },
];

export const collectionTypeOptions = [
	{ name: 'Wish', value: 1 },
	{ name: 'Done', value: 2 },
	{ name: 'Doing', value: 3 },
	{ name: 'On Hold', value: 4 },
	{ name: 'Dropped', value: 5 },
];

export const episodeCollectionTypeOptions = [
	{ name: 'Wish', value: 1 },
	{ name: 'Done', value: 2 },
	{ name: 'Dropped', value: 3 },
];

export const episodeTypeOptions = [
	{ name: 'Main Story', value: 0 },
	{ name: 'Special', value: 1 },
	{ name: 'OP', value: 2 },
	{ name: 'ED', value: 3 },
	{ name: 'PV/Promo', value: 4 },
	{ name: 'MAD', value: 5 },
	{ name: 'Other', value: 6 },
];

export const subjectSortOptions = [
	{ name: 'Date', value: 'date' },
	{ name: 'Rank', value: 'rank' },
];

export const searchSortOptions = [
	{ name: 'Match', value: 'match' },
	{ name: 'Heat', value: 'heat' },
	{ name: 'Rank', value: 'rank' },
	{ name: 'Score', value: 'score' },
];
```

- [x] **Step 3: Update `BangumitvApi.node.ts`**

```typescript
// nodes/BangumitvApi/BangumitvApi.node.ts
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
		defaults: {
			name: 'Bangumi',
		},
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

- [x] **Step 4: Update `BangumitvApi.node.json`**

```json
{
	"node": "n8n-nodes-bangumi-tv",
	"nodeVersion": "1.0",
	"codexVersion": "1.0",
	"categories": ["Development", "Developer Tools"],
	"resources": {
		"credentialDocumentation": [
			{
				"url": "https://github.com/bangumi/api/blob/master/docs-raw/How-to-Auth.md"
			}
		],
		"primaryDocumentation": [
			{
				"url": "https://github.com/bangumi/api"
			}
		]
	}
}
```

- [x] **Step 5: Create placeholder `descriptions.ts`**

```typescript
// nodes/BangumitvApi/actions/descriptions.ts
import type { INodeProperties } from 'n8n-workflow';

// Will be populated as resources are implemented
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
];
```

- [x] **Step 6: Build and verify**

```bash
pnpm run build
```

Expected: Build succeeds with no errors.

- [x] **Step 7: Commit**

```bash
git add -A && git commit -m "refactor: clean up old resources, add common properties and placeholder structure"
```

---

### Task 2: Subject Resource (8 operations)

**Files:**
- Create: `nodes/BangumitvApi/actions/subject/getCalendar.operation.ts`
- Create: `nodes/BangumitvApi/actions/subject/search.operation.ts`
- Create: `nodes/BangumitvApi/actions/subject/getAll.operation.ts`
- Create: `nodes/BangumitvApi/actions/subject/get.operation.ts`
- Create: `nodes/BangumitvApi/actions/subject/getImage.operation.ts`
- Create: `nodes/BangumitvApi/actions/subject/getPersons.operation.ts`
- Create: `nodes/BangumitvApi/actions/subject/getCharacters.operation.ts`
- Create: `nodes/BangumitvApi/actions/subject/getRelations.operation.ts`
- Create: `nodes/BangumitvApi/actions/subject/Subject.resource.ts`

- [x] **Step 1: Create `getCalendar.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Get Calendar',
		name: 'getCalendar',
		type: 'hidden',
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/calendar',
			},
		},
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getCalendar'],
			},
		},
	},
];
```

- [x] **Step 2: Create `search.operation.ts`**

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IRequestOptions } from 'n8n-workflow';
import { limitProperty, offsetProperty, searchSortOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Keyword',
		name: 'keyword',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'POST',
				url: '=/v0/search/subjects',
			},
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IRequestOptions) {
						const keyword = this.getNodeParameter('keyword', 0) as string;
						const sort = this.getNodeParameter('sort', 0) as string;
						const filterJson = this.getNodeParameter('filter', 0) as string;
						const body: Record<string, unknown> = { keyword };
						if (sort) body.sort = sort;
						if (filterJson) {
							try {
								body.filter = JSON.parse(filterJson);
							} catch {
								// ignore invalid JSON
							}
						}
						requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'options',
		options: searchSortOptions,
		default: 'match',
		description: 'Sort order for results',
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['search'],
			},
		},
	},
	{
		...limitProperty,
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['search'],
			},
		},
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['search'],
			},
		},
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
	{
		displayName: 'Filter (JSON)',
		name: 'filter',
		type: 'string',
		default: '',
		description: 'Optional JSON filter object (type, tag, air_date, rating, etc.)',
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['search'],
			},
		},
	},
];
```

- [x] **Step 3: Create `getAll.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty, subjectTypeOptions, subjectSortOptions } from '../common.descriptions';

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
				operation: ['getAll'],
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
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { sort: '={{$value}}' } } },
	},
	{
		displayName: 'Year',
		name: 'year',
		type: 'number',
		description: 'Filter by year',
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { year: '={{$value}}' } } },
	},
	{
		displayName: 'Month',
		name: 'month',
		type: 'number',
		description: 'Filter by month',
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { month: '={{$value}}' } } },
	},
	{
		...limitProperty,
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [x] **Step 4: Create `get.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

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

- [x] **Step 5: Create `getImage.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/subjects/{{$value}}/image',
			},
		},
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getImage'],
			},
		},
	},
];
```

- [x] **Step 6: Create `getPersons.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/subjects/{{$value}}/persons',
			},
		},
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getPersons'],
			},
		},
	},
];
```

- [x] **Step 7: Create `getCharacters.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/subjects/{{$value}}/characters',
			},
		},
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getCharacters'],
			},
		},
	},
];
```

- [x] **Step 8: Create `getRelations.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/subjects/{{$value}}/subjects',
			},
		},
		displayOptions: {
			show: {
				resource: ['subject'],
				operation: ['getRelations'],
			},
		},
	},
];
```

- [x] **Step 9: Create `Subject.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getCalendarProps } from './getCalendar.operation';
import { properties as searchProps } from './search.operation';
import { properties as getAllProps } from './getAll.operation';
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
			{ name: 'Get Calendar', value: 'getCalendar', description: 'Get daily broadcast schedule' },
			{ name: 'Search', value: 'search', description: 'Search subjects by keyword' },
			{ name: 'Get All', value: 'getAll', description: 'Browse subjects' },
			{ name: 'Get', value: 'get', description: 'Get a subject by ID' },
			{ name: 'Get Image', value: 'getImage', description: 'Get subject image' },
			{ name: 'Get Persons', value: 'getPersons', description: 'Get related persons' },
			{ name: 'Get Characters', value: 'getCharacters', description: 'Get related characters' },
			{ name: 'Get Relations', value: 'getRelations', description: 'Get related subjects' },
		],
		default: 'getAll',
		displayOptions: {
			show: {
				resource: ['subject'],
			},
		},
	},
	...getCalendarProps,
	...searchProps,
	...getAllProps,
	...getProps,
	...getImageProps,
	...getPersonsProps,
	...getCharactersProps,
	...getRelationsProps,
];
```

- [x] **Step 10: Update `descriptions.ts` to include Subject**

In `descriptions.ts`, add the import and spread:
```typescript
import { description as subjectDescription } from './subject/Subject.resource';
```
And add `...subjectDescription,` after the resource selector.

- [x] **Step 11: Build and verify**

```bash
pnpm run build
```

- [x] **Step 12: Commit**

```bash
git add -A && git commit -m "feat: add Subject resource with 8 operations"
```

---

### Task 3: Episode Resource (2 operations)

**Files:**
- Create: `nodes/BangumitvApi/actions/episode/getAll.operation.ts`
- Create: `nodes/BangumitvApi/actions/episode/get.operation.ts`
- Create: `nodes/BangumitvApi/actions/episode/Episode.resource.ts`

- [x] **Step 1: Create `getAll.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitPropertyLarge, offsetProperty, episodeTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
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
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Episode Type',
		name: 'episodeType',
		type: 'options',
		options: episodeTypeOptions,
		description: 'Filter by episode type',
		displayOptions: {
			show: {
				resource: ['episode'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { type: '={{$value}}' } } },
	},
	{
		...limitPropertyLarge,
		displayOptions: {
			show: {
				resource: ['episode'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: {
			show: {
				resource: ['episode'],
				operation: ['getAll'],
			},
		},
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 2: Create `get.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Episode ID',
		name: 'episodeId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/episodes/{{$value}}',
			},
		},
		displayOptions: {
			show: {
				resource: ['episode'],
				operation: ['get'],
			},
		},
	},
];
```

- [ ] **Step 3: Create `Episode.resource.ts`**

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
			{ name: 'Get All', value: 'getAll', description: 'Get episodes for a subject' },
			{ name: 'Get', value: 'get', description: 'Get an episode by ID' },
		],
		default: 'getAll',
		displayOptions: {
			show: {
				resource: ['episode'],
			},
		},
	},
	...getAllProps,
	...getProps,
];
```

- [ ] **Step 4: Update `descriptions.ts` to include Episode**

```typescript
import { description as episodeDescription } from './episode/Episode.resource';
```
Add `...episodeDescription,` after the subject spread.

- [ ] **Step 5: Build and commit**

```bash
pnpm run build && git add -A && git commit -m "feat: add Episode resource with 2 operations"
```

---

### Task 4: Character Resource (7 operations)

**Files:**
- Create: `nodes/BangumitvApi/actions/character/get.operation.ts`
- Create: `nodes/BangumitvApi/actions/character/search.operation.ts`
- Create: `nodes/BangumitvApi/actions/character/getSubjects.operation.ts`
- Create: `nodes/BangumitvApi/actions/character/getPersons.operation.ts`
- Create: `nodes/BangumitvApi/actions/character/getImage.operation.ts`
- Create: `nodes/BangumitvApi/actions/character/collect.operation.ts`
- Create: `nodes/BangumitvApi/actions/character/uncollect.operation.ts`
- Create: `nodes/BangumitvApi/actions/character/Character.resource.ts`

- [ ] **Step 1: Create `get.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/characters/{{$value}}',
			},
		},
		displayOptions: {
			show: {
				resource: ['character'],
				operation: ['get'],
			},
		},
	},
];
```

- [ ] **Step 2: Create `search.operation.ts`**

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IRequestOptions } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Keyword',
		name: 'keyword',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'POST',
				url: '=/v0/search/characters',
			},
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IRequestOptions) {
						const keyword = this.getNodeParameter('keyword', 0) as string;
						const nsfw = this.getNodeParameter('nsfw', 0) as boolean | undefined;
						const body: Record<string, unknown> = { keyword };
						if (nsfw !== undefined) {
							body.filter = { nsfw };
						}
						requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: {
			show: {
				resource: ['character'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'NSFW',
		name: 'nsfw',
		type: 'boolean',
		default: false,
		description: 'Include NSFW results (requires permission)',
		displayOptions: {
			show: {
				resource: ['character'],
				operation: ['search'],
			},
		},
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['character'], operation: ['search'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['character'], operation: ['search'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 3: Create `getSubjects.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/characters/{{$value}}/subjects',
			},
		},
		displayOptions: {
			show: { resource: ['character'], operation: ['getSubjects'] },
		},
	},
];
```

- [ ] **Step 4: Create `getPersons.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/characters/{{$value}}/persons',
			},
		},
		displayOptions: {
			show: { resource: ['character'], operation: ['getPersons'] },
		},
	},
];
```

- [ ] **Step 5: Create `getImage.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/characters/{{$value}}/image',
			},
		},
		displayOptions: {
			show: { resource: ['character'], operation: ['getImage'] },
		},
	},
];
```

- [ ] **Step 6: Create `collect.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'POST',
				url: '=/v0/characters/{{$value}}/collect',
			},
		},
		displayOptions: {
			show: { resource: ['character'], operation: ['collect'] },
		},
	},
];
```

- [ ] **Step 7: Create `uncollect.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'DELETE',
				url: '=/v0/characters/{{$value}}/collect',
			},
		},
		displayOptions: {
			show: { resource: ['character'], operation: ['uncollect'] },
		},
	},
];
```

- [ ] **Step 8: Create `Character.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as searchProps } from './search.operation';
import { properties as getSubjectsProps } from './getSubjects.operation';
import { properties as getPersonsProps } from './getPersons.operation';
import { properties as getImageProps } from './getImage.operation';
import { properties as collectProps } from './collect.operation';
import { properties as uncollectProps } from './uncollect.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Get', value: 'get', description: 'Get character detail' },
			{ name: 'Search', value: 'search', description: 'Search characters' },
			{ name: 'Get Subjects', value: 'getSubjects', description: 'Get character related subjects' },
			{ name: 'Get Persons', value: 'getPersons', description: 'Get character related persons' },
			{ name: 'Get Image', value: 'getImage', description: 'Get character image' },
			{ name: 'Collect', value: 'collect', description: 'Collect character' },
			{ name: 'Uncollect', value: 'uncollect', description: 'Uncollect character' },
		],
		default: 'get',
		displayOptions: { show: { resource: ['character'] } },
	},
	...getProps,
	...searchProps,
	...getSubjectsProps,
	...getPersonsProps,
	...getImageProps,
	...collectProps,
	...uncollectProps,
];
```

- [ ] **Step 9: Update `descriptions.ts` to include Character, build and commit**

```bash
pnpm run build && git add -A && git commit -m "feat: add Character resource with 7 operations"
```

---

### Task 5: Person Resource (7 operations)

Person resource mirrors Character exactly (same 7 operation types, same parameter structure). Only the base URL path changes (`/v0/persons/` instead of `/v0/characters/`), and the search filter uses `career` instead of `nsfw`.

**Files:**
- Create: `nodes/BangumitvApi/actions/person/get.operation.ts`
- Create: `nodes/BangumitvApi/actions/person/search.operation.ts`
- Create: `nodes/BangumitvApi/actions/person/getSubjects.operation.ts`
- Create: `nodes/BangumitvApi/actions/person/getCharacters.operation.ts`
- Create: `nodes/BangumitvApi/actions/person/getImage.operation.ts`
- Create: `nodes/BangumitvApi/actions/person/collect.operation.ts`
- Create: `nodes/BangumitvApi/actions/person/uncollect.operation.ts`
- Create: `nodes/BangumitvApi/actions/person/Person.resource.ts`

- [ ] **Step 1: Create `get.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/persons/{{$value}}',
			},
		},
		displayOptions: {
			show: { resource: ['person'], operation: ['get'] },
		},
	},
];
```

- [ ] **Step 2: Create `search.operation.ts`**

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IRequestOptions } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Keyword',
		name: 'keyword',
		type: 'string',
		required: true,
		default: '',
		routing: {
			request: {
				method: 'POST',
				url: '=/v0/search/persons',
			},
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IRequestOptions) {
						const keyword = this.getNodeParameter('keyword', 0) as string;
						const careers = this.getNodeParameter('careers', 0) as string[];
						const body: Record<string, unknown> = { keyword };
						if (careers && careers.length > 0) {
							body.filter = { career: careers };
						}
						requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: {
			show: { resource: ['person'], operation: ['search'] },
		},
	},
	{
		displayName: 'Careers',
		name: 'careers',
		type: 'multiOptions',
		options: [
			{ name: 'Artist', value: 'artist' },
			{ name: 'Director', value: 'director' },
			{ name: 'Producer', value: 'producer' },
			{ name: 'Writer', value: 'writer' },
			{ name: 'Actor', value: 'actor' },
			{ name: 'Musician', value: 'musician' },
		],
		description: 'Filter by career (AND relation)',
		displayOptions: {
			show: { resource: ['person'], operation: ['search'] },
		},
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['person'], operation: ['search'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['person'], operation: ['search'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 3: Create `getSubjects.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'GET', url: '=/v0/persons/{{$value}}/subjects' },
		},
		displayOptions: { show: { resource: ['person'], operation: ['getSubjects'] } },
	},
];
```

- [ ] **Step 4: Create `getCharacters.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'GET', url: '=/v0/persons/{{$value}}/characters' },
		},
		displayOptions: { show: { resource: ['person'], operation: ['getCharacters'] } },
	},
];
```

- [ ] **Step 5: Create `getImage.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'GET', url: '=/v0/persons/{{$value}}/image' },
		},
		displayOptions: { show: { resource: ['person'], operation: ['getImage'] } },
	},
];
```

- [ ] **Step 6: Create `collect.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'POST', url: '=/v0/persons/{{$value}}/collect' },
		},
		displayOptions: { show: { resource: ['person'], operation: ['collect'] } },
	},
];
```

- [ ] **Step 7: Create `uncollect.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'DELETE', url: '=/v0/persons/{{$value}}/collect' },
		},
		displayOptions: { show: { resource: ['person'], operation: ['uncollect'] } },
	},
];
```

- [ ] **Step 8: Create `Person.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as searchProps } from './search.operation';
import { properties as getSubjectsProps } from './getSubjects.operation';
import { properties as getCharactersProps } from './getCharacters.operation';
import { properties as getImageProps } from './getImage.operation';
import { properties as collectProps } from './collect.operation';
import { properties as uncollectProps } from './uncollect.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Get', value: 'get', description: 'Get person detail' },
			{ name: 'Search', value: 'search', description: 'Search persons' },
			{ name: 'Get Subjects', value: 'getSubjects', description: 'Get person related subjects' },
			{ name: 'Get Characters', value: 'getCharacters', description: 'Get person related characters' },
			{ name: 'Get Image', value: 'getImage', description: 'Get person image' },
			{ name: 'Collect', value: 'collect', description: 'Collect person' },
			{ name: 'Uncollect', value: 'uncollect', description: 'Uncollect person' },
		],
		default: 'get',
		displayOptions: { show: { resource: ['person'] } },
	},
	...getProps,
	...searchProps,
	...getSubjectsProps,
	...getCharactersProps,
	...getImageProps,
	...collectProps,
	...uncollectProps,
];
```

- [ ] **Step 9: Update `descriptions.ts`, build and commit**

```bash
pnpm run build && git add -A && git commit -m "feat: add Person resource with 7 operations"
```

---

### Task 6: User Resource (3 operations)

**Files:**
- Create: `nodes/BangumitvApi/actions/user/get.operation.ts`
- Create: `nodes/BangumitvApi/actions/user/getMyself.operation.ts`
- Create: `nodes/BangumitvApi/actions/user/getAvatar.operation.ts`
- Create: `nodes/BangumitvApi/actions/user/User.resource.ts`

- [ ] **Step 1: Create `get.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/{{$value}}',
			},
		},
		displayOptions: {
			show: { resource: ['user'], operation: ['get'] },
		},
	},
];
```

- [ ] **Step 2: Create `getMyself.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Get Myself',
		name: 'getMyself',
		type: 'hidden',
		default: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/me',
			},
		},
		displayOptions: {
			show: { resource: ['user'], operation: ['getMyself'] },
		},
	},
];
```

- [ ] **Step 3: Create `getAvatar.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/{{$value}}/avatar',
			},
		},
		displayOptions: {
			show: { resource: ['user'], operation: ['getAvatar'] },
		},
	},
];
```

- [ ] **Step 4: Create `User.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getProps } from './get.operation';
import { properties as getMyselfProps } from './getMyself.operation';
import { properties as getAvatarProps } from './getAvatar.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Get', value: 'get', description: 'Get user by username' },
			{ name: 'Get Myself', value: 'getMyself', description: 'Get current authenticated user' },
			{ name: 'Get Avatar', value: 'getAvatar', description: 'Get user avatar' },
		],
		default: 'get',
		displayOptions: { show: { resource: ['user'] } },
	},
	...getProps,
	...getMyselfProps,
	...getAvatarProps,
];
```

- [ ] **Step 5: Update `descriptions.ts`, build and commit**

```bash
pnpm run build && git add -A && git commit -m "feat: add User resource with 3 operations"
```

---

### Task 7: Collection Resource (12 operations)

This is the largest resource. Operations fall into 4 groups:
1. **Subject collections** (getCollections, get, create, update)
2. **Episode collections** (getEpisodes, updateEpisodes, getEpisode, updateEpisode)
3. **Character collections** (getCharacterCollections, getCharacterCollection)
4. **Person collections** (getPersonCollections, getPersonCollection)

**Files:**
- Create: 12 operation files in `nodes/BangumitvApi/actions/collection/`
- Create: `nodes/BangumitvApi/actions/collection/Collection.resource.ts`

- [ ] **Step 1: Create `getCollections.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty, subjectTypeOptions, collectionTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/{{$value}}/collections',
			},
		},
		displayOptions: { show: { resource: ['collection'], operation: ['getCollections'] } },
	},
	{
		displayName: 'Subject Type',
		name: 'subjectType',
		type: 'options',
		options: [{ name: 'All', value: '' }, ...subjectTypeOptions],
		default: '',
		description: 'Filter by subject type',
		displayOptions: { show: { resource: ['collection'], operation: ['getCollections'] } },
		routing: { request: { qs: { subject_type: '={{$value}}' } } },
	},
	{
		displayName: 'Collection Type',
		name: 'collectionType',
		type: 'options',
		options: [{ name: 'All', value: '' }, ...collectionTypeOptions],
		default: '',
		description: 'Filter by collection type',
		displayOptions: { show: { resource: ['collection'], operation: ['getCollections'] } },
		routing: { request: { qs: { type: '={{$value}}' } } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['collection'], operation: ['getCollections'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['collection'], operation: ['getCollections'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 2: Create `get.operation.ts`** (get single subject collection)

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'GET', url: '=/v0/users/-/collections/{{$value}}' },
		},
		displayOptions: { show: { resource: ['collection'], operation: ['get'] } },
	},
];
```

- [ ] **Step 3: Create `create.operation.ts`** (POST create/replace collection)

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IRequestOptions } from 'n8n-workflow';
import { collectionTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'POST', url: '=/v0/users/-/collections/{{$value}}' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IRequestOptions) {
						const type = this.getNodeParameter('type', 0) as number | undefined;
						const rate = this.getNodeParameter('rate', 0) as number | undefined;
						const comment = this.getNodeParameter('comment', 0) as string | undefined;
						const tags = this.getNodeParameter('tags', 0) as string[] | undefined;
						const privacy = this.getNodeParameter('privacy', 0) as boolean | undefined;
						const body: Record<string, unknown> = {};
						if (type !== undefined) body.type = type;
						if (rate !== undefined) body.rate = rate;
						if (comment) body.comment = comment;
						if (tags && tags.length > 0) body.tags = tags;
						if (privacy !== undefined) body.private = privacy;
						if (Object.keys(body).length > 0) requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['collection'], operation: ['create'] } },
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: collectionTypeOptions,
		description: 'Collection type',
		displayOptions: { show: { resource: ['collection'], operation: ['create'] } },
	},
	{
		displayName: 'Rate',
		name: 'rate',
		type: 'number',
		typeOptions: { minValue: 0, maxValue: 10 },
		description: 'Rating (0-10)',
		displayOptions: { show: { resource: ['collection'], operation: ['create'] } },
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		description: 'Comment/review',
		displayOptions: { show: { resource: ['collection'], operation: ['create'] } },
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		displayOptions: { show: { resource: ['collection'], operation: ['create'] } },
	},
	{
		displayName: 'Private',
		name: 'privacy',
		type: 'boolean',
		default: false,
		description: 'Only visible to self',
		displayOptions: { show: { resource: ['collection'], operation: ['create'] } },
	},
];
```

- [ ] **Step 4: Create `update.operation.ts`** (PATCH update collection)

Same structure as `create.operation.ts` but with `method: 'PATCH'` and operation name `update`:

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IRequestOptions } from 'n8n-workflow';
import { collectionTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'PATCH', url: '=/v0/users/-/collections/{{$value}}' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IRequestOptions) {
						const type = this.getNodeParameter('type', 0) as number | undefined;
						const rate = this.getNodeParameter('rate', 0) as number | undefined;
						const comment = this.getNodeParameter('comment', 0) as string | undefined;
						const tags = this.getNodeParameter('tags', 0) as string[] | undefined;
						const privacy = this.getNodeParameter('privacy', 0) as boolean | undefined;
						const body: Record<string, unknown> = {};
						if (type !== undefined) body.type = type;
						if (rate !== undefined) body.rate = rate;
						if (comment) body.comment = comment;
						if (tags && tags.length > 0) body.tags = tags;
						if (privacy !== undefined) body.private = privacy;
						if (Object.keys(body).length > 0) requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['collection'], operation: ['update'] } },
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: collectionTypeOptions,
		displayOptions: { show: { resource: ['collection'], operation: ['update'] } },
	},
	{
		displayName: 'Rate',
		name: 'rate',
		type: 'number',
		typeOptions: { minValue: 0, maxValue: 10 },
		displayOptions: { show: { resource: ['collection'], operation: ['update'] } },
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		displayOptions: { show: { resource: ['collection'], operation: ['update'] } },
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		displayOptions: { show: { resource: ['collection'], operation: ['update'] } },
	},
	{
		displayName: 'Private',
		name: 'privacy',
		type: 'boolean',
		displayOptions: { show: { resource: ['collection'], operation: ['update'] } },
	},
];
```

- [ ] **Step 5: Create `getEpisodes.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitPropertyLarge, offsetProperty, episodeTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/-/collections/{{$value}}/episodes',
			},
		},
		displayOptions: { show: { resource: ['collection'], operation: ['getEpisodes'] } },
	},
	{
		displayName: 'Episode Type',
		name: 'episodeType',
		type: 'options',
		options: episodeTypeOptions,
		description: 'Filter by episode type',
		displayOptions: { show: { resource: ['collection'], operation: ['getEpisodes'] } },
		routing: { request: { qs: { episode_type: '={{$value}}' } } },
	},
	{
		...limitPropertyLarge,
		displayOptions: { show: { resource: ['collection'], operation: ['getEpisodes'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['collection'], operation: ['getEpisodes'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 6: Create `updateEpisodes.operation.ts`** (PATCH bulk episode status)

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IRequestOptions } from 'n8n-workflow';
import { episodeCollectionTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'PATCH', url: '=/v0/users/-/collections/{{$value}}/episodes' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IRequestOptions) {
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
		displayOptions: { show: { resource: ['collection'], operation: ['updateEpisodes'] } },
	},
	{
		displayName: 'Episode IDs',
		name: 'episodeIds',
		type: 'string',
		required: true,
		description: 'Comma-separated episode IDs',
		displayOptions: { show: { resource: ['collection'], operation: ['updateEpisodes'] } },
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: episodeCollectionTypeOptions,
		required: true,
		description: 'Episode collection type',
		displayOptions: { show: { resource: ['collection'], operation: ['updateEpisodes'] } },
	},
];
```

- [ ] **Step 7: Create `getEpisode.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Episode ID',
		name: 'episodeId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'GET', url: '=/v0/users/-/collections/-/episodes/{{$value}}' },
		},
		displayOptions: { show: { resource: ['collection'], operation: ['getEpisode'] } },
	},
];
```

- [ ] **Step 8: Create `updateEpisode.operation.ts`** (PUT single episode status)

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IRequestOptions } from 'n8n-workflow';
import { episodeCollectionTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Episode ID',
		name: 'episodeId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'PUT', url: '=/v0/users/-/collections/-/episodes/{{$value}}' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IRequestOptions) {
						const type = this.getNodeParameter('type', 0) as number;
						requestOptions.body = { type };
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['collection'], operation: ['updateEpisode'] } },
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: episodeCollectionTypeOptions,
		required: true,
		description: 'Episode collection type',
		displayOptions: { show: { resource: ['collection'], operation: ['updateEpisode'] } },
	},
];
```

- [ ] **Step 9: Create `getCharacterCollections.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'GET', url: '=/v0/users/{{$value}}/collections/-/characters' },
		},
		displayOptions: { show: { resource: ['collection'], operation: ['getCharacterCollections'] } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['collection'], operation: ['getCharacterCollections'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['collection'], operation: ['getCharacterCollections'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 10: Create `getCharacterCollection.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/{{$value}}/collections/-/characters/{{$parameter["characterId"]}}',
			},
		},
		displayOptions: { show: { resource: ['collection'], operation: ['getCharacterCollection'] } },
	},
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['collection'], operation: ['getCharacterCollection'] } },
	},
];
```

- [ ] **Step 11: Create `getPersonCollections.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'GET', url: '=/v0/users/{{$value}}/collections/-/persons' },
		},
		displayOptions: { show: { resource: ['collection'], operation: ['getPersonCollections'] } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['collection'], operation: ['getPersonCollections'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['collection'], operation: ['getPersonCollections'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 12: Create `getPersonCollection.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/users/{{$value}}/collections/-/persons/{{$parameter["personId"]}}',
			},
		},
		displayOptions: { show: { resource: ['collection'], operation: ['getPersonCollection'] } },
	},
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['collection'], operation: ['getPersonCollection'] } },
	},
];
```

- [ ] **Step 13: Create `Collection.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getCollectionsProps } from './getCollections.operation';
import { properties as getProps } from './get.operation';
import { properties as createProps } from './create.operation';
import { properties as updateProps } from './update.operation';
import { properties as getEpisodesProps } from './getEpisodes.operation';
import { properties as updateEpisodesProps } from './updateEpisodes.operation';
import { properties as getEpisodeProps } from './getEpisode.operation';
import { properties as updateEpisodeProps } from './updateEpisode.operation';
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
			{ name: 'Get Collections', value: 'getCollections', description: 'Get user subject collections' },
			{ name: 'Get', value: 'get', description: 'Get single subject collection' },
			{ name: 'Create', value: 'create', description: 'Create or replace subject collection' },
			{ name: 'Update', value: 'update', description: 'Update subject collection' },
			{ name: 'Get Episodes', value: 'getEpisodes', description: 'Get episode collections for subject' },
			{ name: 'Update Episodes', value: 'updateEpisodes', description: 'Bulk update episode status' },
			{ name: 'Get Episode', value: 'getEpisode', description: 'Get single episode collection' },
			{ name: 'Update Episode', value: 'updateEpisode', description: 'Update single episode status' },
			{ name: 'Get Character Collections', value: 'getCharacterCollections', description: 'Get user character collections' },
			{ name: 'Get Character Collection', value: 'getCharacterCollection', description: 'Get single character collection' },
			{ name: 'Get Person Collections', value: 'getPersonCollections', description: 'Get user person collections' },
			{ name: 'Get Person Collection', value: 'getPersonCollection', description: 'Get single person collection' },
		],
		default: 'getCollections',
		displayOptions: { show: { resource: ['collection'] } },
	},
	...getCollectionsProps,
	...getProps,
	...createProps,
	...updateProps,
	...getEpisodesProps,
	...updateEpisodesProps,
	...getEpisodeProps,
	...updateEpisodeProps,
	...getCharacterCollectionsProps,
	...getCharacterCollectionProps,
	...getPersonCollectionsProps,
	...getPersonCollectionProps,
];
```

- [ ] **Step 14: Update `descriptions.ts`, build and commit**

```bash
pnpm run build && git add -A && git commit -m "feat: add Collection resource with 12 operations"
```

---

### Task 8: Revision Resource (8 operations)

All operations are simple GETs. Two patterns: list (with filter QS) and get by ID.

**Files:**
- Create: 8 operation files in `nodes/BangumitvApi/actions/revision/`
- Create: `nodes/BangumitvApi/actions/revision/Revision.resource.ts`

- [ ] **Step 1: Create `getSubjectRevisions.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: false,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/revisions/subjects',
				qs: { subject_id: '={{$value}}' },
			},
		},
		displayOptions: { show: { resource: ['revision'], operation: ['getSubjectRevisions'] } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['revision'], operation: ['getSubjectRevisions'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['revision'], operation: ['getSubjectRevisions'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 2: Create `getEpisodeRevisions.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Episode ID',
		name: 'episodeId',
		type: 'string',
		required: false,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/revisions/episodes',
				qs: { episode_id: '={{$value}}' },
			},
		},
		displayOptions: { show: { resource: ['revision'], operation: ['getEpisodeRevisions'] } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['revision'], operation: ['getEpisodeRevisions'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['revision'], operation: ['getEpisodeRevisions'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 3: Create `getCharacterRevisions.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Character ID',
		name: 'characterId',
		type: 'string',
		required: false,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/revisions/characters',
				qs: { character_id: '={{$value}}' },
			},
		},
		displayOptions: { show: { resource: ['revision'], operation: ['getCharacterRevisions'] } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['revision'], operation: ['getCharacterRevisions'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['revision'], operation: ['getCharacterRevisions'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 4: Create `getPersonRevisions.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: false,
		routing: {
			request: {
				method: 'GET',
				url: '=/v0/revisions/persons',
				qs: { person_id: '={{$value}}' },
			},
		},
		displayOptions: { show: { resource: ['revision'], operation: ['getPersonRevisions'] } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['revision'], operation: ['getPersonRevisions'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['revision'], operation: ['getPersonRevisions'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 5: Create `getSubjectRevision.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Revision ID',
		name: 'revisionId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'GET', url: '=/v0/revisions/subjects/{{$value}}' },
		},
		displayOptions: { show: { resource: ['revision'], operation: ['getSubjectRevision'] } },
	},
];
```

- [ ] **Step 6: Create `getEpisodeRevision.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Revision ID',
		name: 'revisionId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'GET', url: '=/v0/revisions/episodes/{{$value}}' },
		},
		displayOptions: { show: { resource: ['revision'], operation: ['getEpisodeRevision'] } },
	},
];
```

- [ ] **Step 7: Create `getCharacterRevision.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Revision ID',
		name: 'revisionId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'GET', url: '=/v0/revisions/characters/{{$value}}' },
		},
		displayOptions: { show: { resource: ['revision'], operation: ['getCharacterRevision'] } },
	},
];
```

- [ ] **Step 8: Create `getPersonRevision.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Revision ID',
		name: 'revisionId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'GET', url: '=/v0/revisions/persons/{{$value}}' },
		},
		displayOptions: { show: { resource: ['revision'], operation: ['getPersonRevision'] } },
	},
];
```

- [ ] **Step 9: Create `Revision.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as getSubjectRevisionsProps } from './getSubjectRevisions.operation';
import { properties as getSubjectRevisionProps } from './getSubjectRevision.operation';
import { properties as getEpisodeRevisionsProps } from './getEpisodeRevisions.operation';
import { properties as getEpisodeRevisionProps } from './getEpisodeRevision.operation';
import { properties as getCharacterRevisionsProps } from './getCharacterRevisions.operation';
import { properties as getCharacterRevisionProps } from './getCharacterRevision.operation';
import { properties as getPersonRevisionsProps } from './getPersonRevisions.operation';
import { properties as getPersonRevisionProps } from './getPersonRevision.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Get Subject Revisions', value: 'getSubjectRevisions' },
			{ name: 'Get Subject Revision', value: 'getSubjectRevision' },
			{ name: 'Get Episode Revisions', value: 'getEpisodeRevisions' },
			{ name: 'Get Episode Revision', value: 'getEpisodeRevision' },
			{ name: 'Get Character Revisions', value: 'getCharacterRevisions' },
			{ name: 'Get Character Revision', value: 'getCharacterRevision' },
			{ name: 'Get Person Revisions', value: 'getPersonRevisions' },
			{ name: 'Get Person Revision', value: 'getPersonRevision' },
		],
		default: 'getSubjectRevisions',
		displayOptions: { show: { resource: ['revision'] } },
	},
	...getSubjectRevisionsProps,
	...getSubjectRevisionProps,
	...getEpisodeRevisionsProps,
	...getEpisodeRevisionProps,
	...getCharacterRevisionsProps,
	...getCharacterRevisionProps,
	...getPersonRevisionsProps,
	...getPersonRevisionProps,
];
```

- [ ] **Step 10: Update `descriptions.ts`, build and commit**

```bash
pnpm run build && git add -A && git commit -m "feat: add Revision resource with 8 operations"
```

---

### Task 9: Index Resource (9 operations) + Final Assembly

**Files:**
- Create: 9 operation files in `nodes/BangumitvApi/actions/index/`
- Create: `nodes/BangumitvApi/actions/index/Index.resource.ts`
- Modify: `nodes/BangumitvApi/actions/descriptions.ts` (final version with all 8 resources)

- [ ] **Step 1: Create `create.operation.ts`**

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IRequestOptions } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'POST',
				url: '=/v0/indices',
			},
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IRequestOptions) {
						const title = this.getNodeParameter('title', 0) as string;
						const description = this.getNodeParameter('description', 0) as string | undefined;
						const body: Record<string, unknown> = { title };
						if (description) body.description = description;
						requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['index'], operation: ['create'] } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: { show: { resource: ['index'], operation: ['create'] } },
	},
];
```

- [ ] **Step 2: Create `get.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		routing: { request: { method: 'GET', url: '=/v0/indices/{{$value}}' } },
		displayOptions: { show: { resource: ['index'], operation: ['get'] } },
	},
];
```

- [ ] **Step 3: Create `edit.operation.ts`**

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IRequestOptions } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'PUT', url: '=/v0/indices/{{$value}}' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IRequestOptions) {
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
		displayOptions: { show: { resource: ['index'], operation: ['edit'] } },
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		displayOptions: { show: { resource: ['index'], operation: ['edit'] } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: { show: { resource: ['index'], operation: ['edit'] } },
	},
];
```

- [ ] **Step 4: Create `getSubjects.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { limitProperty, offsetProperty, subjectTypeOptions } from '../common.descriptions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'GET', url: '=/v0/indices/{{$value}}/subjects' },
		},
		displayOptions: { show: { resource: ['index'], operation: ['getSubjects'] } },
	},
	{
		displayName: 'Subject Type',
		name: 'subjectType',
		type: 'options',
		options: [{ name: 'All', value: '' }, ...subjectTypeOptions],
		description: 'Filter by subject type',
		displayOptions: { show: { resource: ['index'], operation: ['getSubjects'] } },
		routing: { request: { qs: { type: '={{$value}}' } } },
	},
	{
		...limitProperty,
		displayOptions: { show: { resource: ['index'], operation: ['getSubjects'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		...offsetProperty,
		displayOptions: { show: { resource: ['index'], operation: ['getSubjects'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
```

- [ ] **Step 5: Create `addSubject.operation.ts`**

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IRequestOptions } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'POST', url: '=/v0/indices/{{$value}}/subjects' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IRequestOptions) {
						const subjectId = this.getNodeParameter('subjectId', 0) as string;
						const sort = this.getNodeParameter('sort', 0) as number | undefined;
						const comment = this.getNodeParameter('comment', 0) as string | undefined;
						const body: Record<string, unknown> = { subject_id: Number(subjectId) };
						if (sort !== undefined) body.sort = sort;
						if (comment) body.comment = comment;
						requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
		displayOptions: { show: { resource: ['index'], operation: ['addSubject'] } },
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['index'], operation: ['addSubject'] } },
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'number',
		description: 'Sort order (lower = first)',
		displayOptions: { show: { resource: ['index'], operation: ['addSubject'] } },
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		displayOptions: { show: { resource: ['index'], operation: ['addSubject'] } },
	},
];
```

- [ ] **Step 6: Create `editSubject.operation.ts`**

```typescript
import type { INodeProperties, IExecuteSingleFunctions, IRequestOptions } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		routing: {
			request: { method: 'PUT', url: '=/v0/indices/{{$value}}/subjects/{{$parameter["subjectId"]}}' },
			send: {
				preSend: [
					async function (this: IExecuteSingleFunctions, requestOptions: IRequestOptions) {
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
		displayOptions: { show: { resource: ['index'], operation: ['editSubject'] } },
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['index'], operation: ['editSubject'] } },
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'number',
		displayOptions: { show: { resource: ['index'], operation: ['editSubject'] } },
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		displayOptions: { show: { resource: ['index'], operation: ['editSubject'] } },
	},
];
```

- [ ] **Step 7: Create `removeSubject.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		routing: {
			request: {
				method: 'DELETE',
				url: '=/v0/indices/{{$value}}/subjects/{{$parameter["subjectId"]}}',
			},
		},
		displayOptions: { show: { resource: ['index'], operation: ['removeSubject'] } },
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['index'], operation: ['removeSubject'] } },
	},
];
```

- [ ] **Step 8: Create `collect.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		routing: { request: { method: 'POST', url: '=/v0/indices/{{$value}}/collect' } },
		displayOptions: { show: { resource: ['index'], operation: ['collect'] } },
	},
];
```

- [ ] **Step 9: Create `uncollect.operation.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
	{
		displayName: 'Index ID',
		name: 'indexId',
		type: 'string',
		required: true,
		routing: { request: { method: 'DELETE', url: '=/v0/indices/{{$value}}/collect' } },
		displayOptions: { show: { resource: ['index'], operation: ['uncollect'] } },
	},
];
```

- [ ] **Step 10: Create `Index.resource.ts`**

```typescript
import type { INodeProperties } from 'n8n-workflow';
import { properties as createProps } from './create.operation';
import { properties as getProps } from './get.operation';
import { properties as editProps } from './edit.operation';
import { properties as getSubjectsProps } from './getSubjects.operation';
import { properties as addSubjectProps } from './addSubject.operation';
import { properties as editSubjectProps } from './editSubject.operation';
import { properties as removeSubjectProps } from './removeSubject.operation';
import { properties as collectProps } from './collect.operation';
import { properties as uncollectProps } from './uncollect.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Create', value: 'create', description: 'Create a new index' },
			{ name: 'Get', value: 'get', description: 'Get index by ID' },
			{ name: 'Edit', value: 'edit', description: 'Edit index info' },
			{ name: 'Get Subjects', value: 'getSubjects', description: 'Get subjects in index' },
			{ name: 'Add Subject', value: 'addSubject', description: 'Add subject to index' },
			{ name: 'Edit Subject', value: 'editSubject', description: 'Edit subject in index' },
			{ name: 'Remove Subject', value: 'removeSubject', description: 'Remove subject from index' },
			{ name: 'Collect', value: 'collect', description: 'Collect index' },
			{ name: 'Uncollect', value: 'uncollect', description: 'Uncollect index' },
		],
		default: 'get',
		displayOptions: { show: { resource: ['index'] } },
	},
	...createProps,
	...getProps,
	...editProps,
	...getSubjectsProps,
	...addSubjectProps,
	...editSubjectProps,
	...removeSubjectProps,
	...collectProps,
	...uncollectProps,
];
```

- [ ] **Step 11: Write final `descriptions.ts` with all 8 resources**

```typescript
// nodes/BangumitvApi/actions/descriptions.ts
import type { INodeProperties } from 'n8n-workflow';
import { description as subjectDescription } from './subject/Subject.resource';
import { description as episodeDescription } from './episode/Episode.resource';
import { description as characterDescription } from './character/Character.resource';
import { description as personDescription } from './person/Person.resource';
import { description as userDescription } from './user/User.resource';
import { description as collectionDescription } from './collection/Collection.resource';
import { description as revisionDescription } from './revision/Revision.resource';
import { description as indexDescription } from './index/Index.resource';

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
	...characterDescription,
	...personDescription,
	...userDescription,
	...collectionDescription,
	...revisionDescription,
	...indexDescription,
];
```

- [ ] **Step 12: Build and commit**

```bash
pnpm run build && git add -A && git commit -m "feat: add Index resource with 9 operations, complete all 8 resources"
```

---

### Task 10: Final Build, Lint, and Verification

- [ ] **Step 1: Run build**

```bash
pnpm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Run lint**

```bash
pnpm run lint
```

Expected: No lint errors.

- [ ] **Step 3: Verify file count**

```bash
find nodes/BangumitvApi/actions -name "*.ts" | wc -l
```

Expected: 67 files (8 resource files + 56 operation files + common.descriptions.ts + descriptions.ts)

- [ ] **Step 4: Verify no old files remain**

```bash
ls nodes/BangumitvApi/resources/ 2>&1
```

Expected: "No such file or directory"

- [ ] **Step 5: Final commit (if any fixes needed)**

```bash
git add -A && git commit -m "chore: final build and lint fixes"
```
