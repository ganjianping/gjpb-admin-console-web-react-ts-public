import i18n from "../../../../shared-lib/src/i18n/i18n";

// English translations for Dashboard
const enDashboard = {
  welcome: "Welcome",
  userInfo: {
    title: "User Information",
    basicInfo: "Basic Information",
    displayName: "Display Name",
    username: "Username",
    email: "Email",
    mobile: "Mobile",
    accountStatus: "Account Status",
    loginActivity: "Login Activity",
    lastLogin: "Last Login",
    never: "Never",
    lastLoginIp: "Last Login IP",
    notAvailable: "Not available",
    failedAttempts: "Failed Login Attempts",
    lastFailedLogin: "Last Failed Login",
    roles: "User Roles",
  },
  appSettings: {
    title: "App Settings",
    app_name: "App Name",
    app_version: "App Version",
    app_company: "Company",
    app_description: "Description",
    website_tags: "Website Tags",
  },
};

// Chinese translations for Dashboard
const zhDashboard = {
  welcome: "欢迎",
  userInfo: {
    title: "用户信息",
    basicInfo: "基本信息",
    displayName: "显示名称",
    username: "用户名",
    email: "邮箱",
    mobile: "手机号码",
    accountStatus: "账户状态",
    loginActivity: "登录活动",
    lastLogin: "最后登录",
    never: "从未",
    lastLoginIp: "最后登录IP",
    notAvailable: "不可用",
    failedAttempts: "失败登录尝试",
    lastFailedLogin: "最后失败登录",
    roles: "用户角色",
  },
  appSettings: {
    title: "应用设置",
    app_name: "应用名称",
    app_version: "应用版本",
    app_company: "公司",
    app_description: "描述",
    website_tags: "网站标签",
  },
};

// Add dashboard translations to i18n
// Use deep merge to add dashboard namespace to existing translation resources
if (i18n.isInitialized) {
  i18n.addResourceBundle(
    "en",
    "translation",
    { dashboard: enDashboard },
    true,
    true,
  );
  i18n.addResourceBundle(
    "zh",
    "translation",
    { dashboard: zhDashboard },
    true,
    true,
  );
} else {
  // If i18n is not initialized yet, wait for it
  i18n.on("initialized", () => {
    i18n.addResourceBundle(
      "en",
      "translation",
      { dashboard: enDashboard },
      true,
      true,
    );
    i18n.addResourceBundle(
      "zh",
      "translation",
      { dashboard: zhDashboard },
      true,
      true,
    );
  });
}

export { enDashboard, zhDashboard };
