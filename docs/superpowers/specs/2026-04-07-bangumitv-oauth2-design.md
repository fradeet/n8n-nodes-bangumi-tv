# BangumiTV OAuth2 认证实现设计

**日期**: 2026-04-07
**状态**: 已批准
**作者**: Claude Code
**审查者**: 待定

## 1. 概述

### 1.1 目标
更新现有的 BangumiTV n8n 社区节点的 OAuth2 凭证配置，使其与实际的 BangumiTV API OAuth2 端点匹配，实现完整的用户授权流程。

### 1.2 背景
- 项目已创建基础 OAuth2 凭证类，但使用占位符 URL
- 用户已拥有 BangumiTV 应用凭证（client_id 和 client_secret）
- BangumiTV API 使用标准的 OAuth2 Authorization Code 流程

### 1.3 修改范围
**仅修改** `credentials/BangumitvApiOAuth2Api.credentials.ts` 文件
**不修改** 节点文件、资源文件、package.json 配置

## 2. 技术方案

### 2.1 OAuth2 端点配置

根据 [BangumiTV API 官方文档](https://github.com/bangumi/api/blob/master/docs-raw/How-to-Auth.md)：

```typescript
// 授权端点
authUrl: 'https://bgm.tv/oauth/authorize'

// Token 端点
accessTokenUrl: 'https://bgm.tv/oauth/access_token'

// 认证方式
authentication: 'header' // 使用 Authorization Header
```

### 2.2 Scope 处理
BangumiTV API 文档明确指出 scope 功能"尚未实现"，因此：
- 配置为空字符串 `''`
- 不设置任何权限范围
- 依赖 API 返回的默认权限

### 2.3 Token 有效期
- Access Token 有效期：604800 秒（7 天）
- Authorization Code 有效期：60 秒（需快速完成交换）
- 支持 Refresh Token 自动刷新
- n8n OAuth2 框架自动处理 token 刷新

### 2.5 Token 状态查询
BangumiTV 提供 `POST https://bgm.tv/oauth/token_status` 端点用于查询当前授权状态，可用作凭证有效性测试。

### 2.6 认证头格式
```
Authorization: Bearer {access_token}
```

## 3. 实现细节

### 3.1 文件修改

**文件**: `credentials/BangumitvApiOAuth2Api.credentials.ts`

**修改内容**:
```typescript
export class BangumitvApiOAuth2Api implements ICredentialType {
	name = 'bangumitvApiOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'Bangumitv Api OAuth2 API';
	documentationUrl = 'https://github.com/bangumi/api/blob/master/docs-raw/How-to-Auth.md';

	// Test credential validity by querying token status
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://bgm.tv',
			url: '/oauth/token_status',
			method: 'POST',
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://bgm.tv/oauth/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://bgm.tv/oauth/access_token',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}
```

**关键变更**:
- `documentationUrl`: `https://github.com/org/-bangumitv-api?tab=readme-ov-file#credentials` → `https://github.com/bangumi/api/blob/master/docs-raw/How-to-Auth.md`
- `authUrl`: `https://api.example.com/oauth/authorize` → `https://bgm.tv/oauth/authorize`
- `accessTokenUrl`: `https://api.example.com/oauth/token` → `https://bgm.tv/oauth/access_token`
- `scope`: `'users:read users:write companies:read'` → `''`（空字符串）
- 新增 `test` 请求配置：使用 `/oauth/token_status` 端点验证凭证有效性

### 3.2 配置说明

**保留的默认配置**（继承自 n8n oAuth2Api）:
- Grant Type: `authorizationCode`
- Authentication: `header`（Bearer token 通过 Authorization 请求头发送）
- 自动 token 刷新

**用户需要提供的凭证**:
- Client ID（App ID）
- Client Secret（App Secret）

### 3.3 回调 URL 配置

本地开发环境:
```
http://localhost:5678/rest/oauth2-credential/callback
```

生产环境:
```
https://<your-n8n-domain>/rest/oauth2-credential/callback
```

## 4. 验证测试

### 4.1 单元测试
无需额外单元测试，使用 n8n OAuth2 框架内置测试。

### 4.2 集成测试步骤
1. 在 n8n 中创建新凭证
2. 选择 "Bangumitv Api OAuth2 API"
3. 填入 Client ID 和 Client Secret
4. 点击 "Sign in with BangumiTV"
5. 完成 OAuth 授权流程
6. 验证 token 是否成功保存
7. 测试 API 调用（如获取用户信息）

### 4.3 Token 刷新测试
等待 7 天后验证自动刷新，或使用手动撤销 token 方式测试。

## 5. 部署注意事项

### 5.1 构建命令
```bash
pnpm run build
```

### 5.2 安装到 n8n
```bash
# 开发模式
pnpm run dev

# 或复制到 n8n
cp -r dist/nodes/* ~/.n8n/custom/
cp -r dist/credentials/* ~/.n8n/credentials/
```

### 5.3 环境变量
无需特殊环境变量，n8n 自动处理 OAuth 回调。

## 6. 风险与限制

### 6.1 已知风险
- **Scope 未实现**: BangumiTV API 当前不支持权限范围控制，所有应用具有相同权限
- **API 变更**: 如果 BangumiTV 更新 OAuth 端点，需要及时更新此配置

### 6.2 限制
- 仅支持 Authorization Code 流程
- 依赖 BangumiTV API 的稳定性
- Token 有效期固定为 7 天

## 7. 后续优化建议

### 7.1 短期（本次实现）
- [x] 更新 OAuth2 端点 URL
- [x] 配置正确的认证方式
- [x] 移除无效 scope

### 7.2 中期（可选）
- [ ] 添加认证测试端点
- [ ] 添加详细的错误处理提示
- [ ] 提供 OAuth2 故障排查文档

### 7.3 长期（可选）
- [ ] 支持 API Key 认证作为备选方案
- [ ] 添加 token 撤销功能
- [ ] 实现 token 手动刷新操作

## 8. 参考资料

- [BangumiTV API 认证文档](https://github.com/bangumi/api/blob/master/docs-raw/How-to-Auth.md)
- [BangumiTV API 主页](https://bangumi.github.io/api/)
- [n8n 社区节点开发指南](https://docs.n8n.io/integrations/community-nodes/build-community-nodes/)
- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)

## 9. 变更历史

| 日期 | 版本 | 变更内容 | 作者 |
|------|------|----------|------|
| 2026-04-07 | 1.0 | 初始设计 | Claude Code |
| 2026-04-07 | 1.1 | 审查修订：补充 documentationUrl 变更、新增 test 配置、移除 PKCE 描述、补充 token_status 端点和 code 有效期 | Claude Code |
