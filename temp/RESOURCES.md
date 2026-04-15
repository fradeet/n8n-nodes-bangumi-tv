# Bangumi.tv API - 资源和操作列表

本文档列出了 Bangumi.tv n8n 节点的所有资源（Resource）及其对应的操作（Operation）。

## Character (角色)

### Create Collection (收藏)
- **value**: `createCollection`
- **action**: Create character collection
- **description**: Create a new character collection
- **url**: `POST /v0/characters/{$characterId}/collect`

### Get (获取)
- **value**: `get`
- **action**: Get character
- **description**: Retrieve a character detail
- **url**: `GET /v0/characters/{$characterId}`

### Get Image (获取图片)
- **value**: `getImage`
- **action**: Get character image
- **description**: Retrieve character image
- **url**: `GET /v0/characters/{$characterId}/image`

### Get Related Persons (获取相关人物)
- **value**: `getManyRelatedPersons`
- **action**: Get related persons for character
- **description**: List all related persons in a character
- **url**: `GET /v0/characters/{$characterId}/persons`

### Get Related Subjects (获取相关条目)
- **value**: `getManyRelatedSubjects`
- **action**: Get related subjects for character
- **description**: List all related subjects in a character
- **url**: `GET /v0/characters/{$characterId}/subjects`

### Search (搜索)
- **value**: `search`
- **action**: Search characters
- **description**: Search characters by keyword
- **url**: `GET /v0/search/characters`

### Delete Collection (取消收藏)
- **value**: `deleteCollection`
- **action**: Delete character collection
- **description**: Delete a character collection
- **url**: `DELETE /v0/characters/{$characterId}/collect`

---

## Collection (收藏)

### Get Character (获取角色收藏)
- **value**: `getCharacter`
- **action**: Get user's character collection
- **description**: Retrieve a user's character collection
- **url**: `GET /v0/users/{$username}/collections/-/characters/{$characterId}`

### Get Many Subjects (获取多个收藏)
- **value**: `getManySubjects`
- **action**: Get many user's subject collections
- **description**: Retrieve a list of user's subject collections
- **url**: `GET /v0/users/{$username}/collections`

### Get Many Characters (获取多个角色收藏)
- **value**: `getManyCharacters`
- **action**: Get many user's character collections
- **description**: Retrieve a list of user's character collections
- **url**: `GET /v0/users/{$username}/collections/-/characters`

### Get Many Persons (获取多个人物收藏)
- **value**: `getManyPersons`
- **action**: Get many user's person collections
- **description**: Retrieve a list of person collections
- **url**: `GET /v0/users/{$username}/collections/-/persons`

### Get Person (获取人物收藏)
- **value**: `getPerson`
- **action**: Get user's person collection
- **description**: Retrieve a person collection
- **url**: `GET /v0/users/{$username}/collections/-/persons/{$personId}`

---

## Episode (章节)

### Get (获取)
- **value**: `get`
- **action**: Get episode
- **description**: Retrieve an episode detail
- **url**: `GET /v0/episodes/{$episodeId}`

### Get Collection (获取收藏状态)
- **value**: `getCollection`
- **action**: Get episode collection
- **description**: Retrieve watch status for an episode
- **url**: `GET /v0/users/-/collections/-/episodes/{$episodeId}`

### Get Many (获取多个)
- **value**: `getMany`
- **action**: Get many episodes
- **description**: Retrieve a list of episodes
- **url**: `GET /v0/episodes`

### Get Many Collection (获取多个收藏状态)
- **value**: `getManyCollection`
- **action**: Get many episode collection
- **description**: Retrieve episode watch statuses for a subject
- **url**: `GET /v0/users/-/collections/{$subjectId}/episodes`

### Update Collection (更新收藏状态)
- **value**: `updateCollection`
- **action**: Update episode collection status
- **description**: Update one episode collection status
- **url**: `PUT /v0/users/-/collections/-/episodes/{$episodeId}`

### Update Many Collection (批量更新收藏状态)
- **value**: `updateManyCollections`
- **action**: Update episode collection statuses
- **description**: Update episodes inside a subject
- **url**: `PATCH /v0/users/-/collections/{$subjectId}/episodes`

---

## Index (索引)

### Append Subject (追加条目)
- **value**: `addendSubject`
- **action**: Append subject to index
- **description**: Append a subject into an index
- **url**: `POST /v0/indices/{$indexId}/subjects`

### Create Collection (收藏)
- **value**: `createCollection`
- **action**: Create index collection
- **description**: Create a new index collection
- **url**: `POST /v0/indices/{$indexId}/collect`

### Create (创建)
- **value**: `create`
- **action**: Create index
- **description**: Create a new index
- **url**: `POST /v0/indices`

### Delete Subject (删除条目)
- **value**: `deleteSubject`
- **action**: Delete subject from index
- **description**: Delete a subject inside an index
- **url**: `DELETE /v0/indices/{$indexId}/subjects/{$subjectId}`

### Get (获取)
- **value**: `get`
- **action**: Get index
- **description**: Retrieve an index detail
- **url**: `GET /v0/indices/{$indexId}`

### Get Subjects (获取多个条目)
- **value**: `getManySubjects`
- **action**: Get subjects in index
- **description**: List all subjects in an index
- **url**: `GET /v0/indices/{$indexId}/subjects`

### Delete Collection (取消收藏)
- **value**: `deleteCollection`
- **action**: Delete index collection
- **description**: Delete an index collection
- **url**: `DELETE /v0/indices/{$indexId}/collect`

### Update (更新)
- **value**: `update`
- **action**: Update index
- **description**: Update a index
- **url**: `PUT /v0/indices/{$indexId}`

### Update Subject (更新条目)
- **value**: `updateSubject`
- **action**: Update subject in index
- **description**: Update subject inside a index
- **url**: `PUT /v0/indices/{$indexId}/subjects/{$subjectId}`


---

## Person (人物)

### Create Collection (收藏)
- **value**: `createCollection`
- **action**: Create character collection
- **description**: Create a new character collection
- **url**: `POST /v0/persons/{$personId}/collect`

### Get (获取)
- **value**: `get`
- **action**: Get person
- **description**: Retrieve a person detail
- **url**: `GET /v0/persons/{$personId}`

### Get Image (获取图片)
- **value**: `getImage`
- **action**: Get person image
- **description**: Retrieve person image
- **url**: `GET /v0/persons/{$personId}/image`

### Get Related Characters (获取相关角色)
- **value**: `getManyRelatedCharacters`
- **action**: Get related characters for person
- **description**: Retrieve related characters for a person
- **url**: `GET /v0/persons/{$personId}/characters`

### Get Related Subjects (获取相关条目)
- **value**: `getManyRelatedSubjects`
- **action**: Get related subjects for person
- **description**: Retrieve related subjects for a person
- **url**: `GET /v0/persons/{$personId}/subjects`

### Search (搜索)
- **value**: `search`
- **action**: Search persons
- **description**: Search persons by keyword
- **url**: `GET /v0/search/persons`

### Delete Collection (取消收藏)
- **value**: `deleteCollection`
- **action**: Delete person collection
- **description**: Delete a person collection
- **url**: `DELETE /v0/persons/{$personId}/collect`

---

## Revision (修订)

### Get Character (获取角色修订)
- **value**: `getCharacterRevision`
- **action**: Get character revision
- **description**: Retrieve a character revision
- **url**: `GET /v0/revisions/characters/{$revisionId}`

### Get Episode (获取章节修订)
- **value**: `getEpisodeRevision`
- **action**: Get episode revision
- **description**: Retrieve an episode revision
- **url**: `GET /v0/revisions/episodes/{$revisionId}`

### Get Many Character (获取多个角色修订)
- **value**: `getManyCharacterRevisions`
- **action**: Get many character revisions
- **description**: List all revisions in a character
- **url**: `GET /v0/revisions/characters`

### Get Many Episode (获取多个章节修订)
- **value**: `getManyEpisodeRevisions`
- **action**: Get many episode revisions
- **description**: List all revisions in an episode
- **url**: `GET /v0/revisions/episodes`

### Get Many Person (获取多个人物修订)
- **value**: `getManyPersonRevisions`
- **action**: Get many person revisions
- **description**: List all revisions in a person
- **url**: `GET /v0/revisions/persons`

### Get Many Subject (获取多个条目修订)
- **value**: `getManySubjectRevisions`
- **action**: Get many subject revisions
- **description**: List all revisions in a subject
- **url**: `GET /v0/revisions/subjects`

### Get Person (获取人物修订)
- **value**: `getPersonRevision`
- **action**: Get person revision
- **description**: Retrieve a person revision
- **url**: `GET /v0/revisions/persons/{$revisionId}`

### Get Subject (获取条目修订)
- **value**: `getSubjectRevision`
- **action**: Get subject revision
- **description**: Retrieve a subject revision
- **url**: `GET /v0/revisions/subjects/{$revisionId}`

---

## Subject (条目)

### Create or Update Collection (创建或更新收藏状态)
- **value**: `createOrUpdateCollection`
- **action**: Create or update subject collection
- **description**: Create a new subject collection or update an existing one
- **url**: `POST /v0/users/-/collections/{$subjectId}`

### Get (获取)
- **value**: `get`
- **action**: Get subject
- **description**: Retrieve a subject detail
- **url**: `GET /v0/subjects/{$subjectId}`

### Get Calendar (获取日历)
- **value**: `getCalendar`
- **action**: Get calendar
- **description**: Retrieve daily broadcast schedule for subjects
- **url**: `GET /calendar`

### Get Image (获取图片)
- **value**: `getImage`
- **action**: Get subject image
- **description**: Retrieve subject image
- **url**: `GET /v0/subjects/{$subjectId}/image`

### Get Many (获取多个)
- **value**: `getMany`
- **action**: Get many subjects
- **description**: Retrieve a list of subjects
- **url**: `GET /v0/subjects`

### Get Related Characters (获取相关角色)
- **value**: `getManyRelatedCharacters`
- **action**: Get related characters for subject
- **description**: Retrieve related characters inside a subject
- **url**: `GET /v0/subjects/{$subjectId}/characters`

### Get Related Persons (获取相关人物)
- **value**: `getManyRelatedPersons`
- **action**: Get related persons for subject
- **description**: Retrieve related persons inside a subject
- **url**: `GET /v0/subjects/{$subjectId}/persons`

### Get Related Subjects (获取相关条目)
- **value**: `getManyRelatedSubjects`
- **action**: Get related subjects for subject
- **description**: Retrieve related subjects inside a subject
- **url**: `GET /v0/subjects/{$subjectId}/subjects`

### Search (搜索)
- **value**: `search`
- **action**: Search subjects
- **description**: Search subjects by keyword
- **url**: `GET /v0/search/subjects`

### Update Collection (更新收藏状态)
- **value**: `updateCollection`
- **action**: Update subject collection
- **description**: Update collection inside a subject
- **url**: `PATCH /v0/users/-/collections/{$subjectId}`

---

## User (用户)

### Get (获取)
- **value**: `get`
- **action**: Get user's profile
- **description**: Retrieve user profile by username
- **url**: `GET /v0/users/{$username}`

### Get Avatar (获取头像)
- **value**: `getAvatar`
- **action**: Get user's avatar
- **description**: Retrieve user avatar by username
- **url**: `GET /v0/users/{$username}/avatar`

### Get Me (获取)
- **value**: `getMe`
- **action**: Get current user
- **description**: Retrieve current authenticated user profile
- **url**: `GET /v0/me`

---

## 技术实现说明

本节点采用 **声明式架构**，每个操作通过 `routing` 属性定义 HTTP 方法和 URL 路径，利用 n8n 的表达式语法实现动态参数替换：

- `{{$value}}`: 当前字段的值
- `{{$parameter["xxx"]}}`: 引用其他参数的值

这种设计遵循 RESTful API 规范，提供了清晰、可维护的代码结构。
