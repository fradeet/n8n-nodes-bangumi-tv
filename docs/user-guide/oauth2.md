# Oauth2: Create an Application and set up Credentials

## Step 1: Get OAuth Redirect URL
Navigate to n8n credentials tab, and click "Create Credential", select "Bangumi.tv OAuth2 API", and get "OAuth Redirect URL".

![](/img/oauth2-1.jpg)

## Step 2: Create Application
Navigate to [Bangumi.tv Developer Platform](https://bangumi.tv/dev), click "Create a new Application".

![](/img/oauth2-2.jpg)

Fill the form and click "Create":
- **Application Name**: **Required**, whatever you want.
- **Homepage**: _Optional_
- **Type**: Application
- **Description**: _Optional_
- **Cross Origin (CORS)**: false

![](/img/oauth2-3.jpg)

Get the **App ID** and **App Secret** from the tab, and set the redirect URI, which you found in n8n credentials tab.

![](/img/oauth2-4.jpg)

## Step 3: Set Up Credentials
Fill App ID and App Secret into n8n credentials tab:
- **Client ID**: App ID
- **Client Secret**: App Secret

Click "Connect to Bangumi.tv" to complete the setup.
